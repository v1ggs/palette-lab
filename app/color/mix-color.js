const Color = require('colorjs.io/dist/color.legacy.cjs').default;

/**
 * Mixes two colors in the LAB color space and outputs the result in RGB.
 * This function utilizes the ΔΕ2000 algorithm for color difference calculation
 * and interpolates between the two input colors based on a specified percentage.
 *
 * @param {string} c1 - The first color in any CSS color format.
 * @param {string} c2 - The second color in any CSS color format.
 * @param {number} percentage - The percentage of the second color in the mix,
 *                              expressed as a whole number (0-100).
 * @returns {string} The resulting color as a CSS sRGB color string.
 *
 * @example
 * mixColors('#ff0000', '#0000ff', 50) // Returns a mix of red and blue at 50%
 */
module.exports = (c1, c2, percentage) => {
   // Configure ΔΕ2000 as the default algorithm.
   // https://colorjs.io/docs/color-difference#setting-the-default-deltae-algorithm
   Color.defaults.deltaE = '2000';

   percentage = percentage / 100;

   // https://colorjs.io/docs/interpolation#mixing-colors
   const mix = Color.mix(c1, c2, percentage, {
      space: 'lab',
      outputSpace: 'srgb',
   }).toString();

   return mix;
};
