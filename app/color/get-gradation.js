const Color = require('colorjs.io/dist/color.legacy.cjs').default;
const mixColor = require('./mix-color.js');

/**
 * Generates a series of gradations for a given color by either lightening or darkening it.
 * The function uses the Lab color space for perceptual uniformity and mixes the base color
 * with white (for lightening) or black (for darkening) to achieve the desired levels of
 * lightness or darkness, constrained by a maximum lightness level.
 *
 * The ΔΕ2000 algorithm is configured for color manipulation.
 *
 * @param {Object} options - Configuration options for generating color gradations.
 * @param {string} options.color - The base color in any CSS-compatible color format.
 * @param {boolean} [options.lighten=true] - Determines whether the gradations should lighten (true) or darken (false) the base color.
 * @param {number} [options.levels=5] - The number of gradation levels to generate.
 * @param {number} [options.max=100] - The maximum limit for lightening (expressed as a percentage towards white)
 *                                     or the inverse limit for darkening (expressed as a percentage towards black).
 *                                     This parameter helps control the intensity of the final gradation level.
 * @returns {Object} An object containing the generated color gradations, indexed by level,
 *                   with each level representing a color string adjusted towards the desired
 *                   lightness or darkness.
 */
module.exports = ({ color, lighten = true, levels = 5, max = 100 }) => {
   // Configure ΔΕ2000 as the default algorithm.
   // https://colorjs.io/docs/color-difference#setting-the-default-deltae-algorithm
   Color.defaults.deltaE = '2000';

   const color1 = new Color(color);
   const color2 = lighten ? '#FFFFFF' : '#000000';
   const step = max / levels;
   const gradations = {};
   const mixAmount = {};

   for (let i = 1; i <= levels; i++) {
      // percentage value for the current level, limit to 100 if over.
      let percentage = Math.min(step * i, 100);

      // If the last percentage is close, but not equal to the
      // configured limit (max), set it to the requested limit.
      // 0.1 is just an arbitrary number - the difference between
      // the "final" percentage and the "max" should not be greater
      // than that (rounding numbers issue).
      // This could be an issue with smaller ranges (i.e. very light
      // or dark colors), where more gradations are required, but generaly
      // this should not happen, because such gradations would be
      // indistinguishable anyway.
      if (max - percentage < 0.1) percentage = max;

      // Mix with white or black and store the adjusted color
      // for the current level.
      gradations[i] = mixColor(color1, color2, percentage);

      // Used to display amount of white and black in tints and shades.
      mixAmount[i] = percentage;
   }

   return { gradations, mixAmount };
};
