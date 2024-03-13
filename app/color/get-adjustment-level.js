const Color = require('colorjs.io/dist/color.legacy.cjs').default;

/**
 * Calculates the adjustment per level needed to lighten or darken a given color,
 * within specified constraints. It returns the per-level adjustment amount necessary
 * to reach the desired limit of lightness or darkness.
 *
 * The function utilizes the LAB color space for calculations, ensuring perceptual
 * uniformity in color adjustments. It also considers the ΔΕ2000 algorithm for
 * color difference calculations to enhance accuracy.
 *
 * @param {Object} options - Configuration object for the adjustment calculation.
 * @param {string} options.color - The base color in any CSS color format.
 * @param {boolean} [options.lighten=true] - Whether to lighten (true) or darken (false) the color.
 * @param {number} [options.levels=5] - The number of levels to divide the lightness/darkness adjustment into.
 * @param {number} [options.max=100] - The maximum lightness (for lightening) or minimum lightness
 *                                     (for darkening) target, expressed as a percentage of the full range.
 *                                     Defaults to 100 for lightening with no limit, automatically adjusts
 *                                     for darkening.
 * @returns {number|boolean} The adjustment amount per level required to achieve the target lightness/darkness,
 *                           or false if the adjustment is not possible within the specified limits.
 */
module.exports = ({ color, lighten = true, levels, max }) => {
   // Configure ΔΕ2000 as the default algorithm.
   // https://colorjs.io/docs/color-difference#setting-the-default-deltae-algorithm
   Color.defaults.deltaE = '2000';

   if (!max || typeof max !== 'number') max = 100;
   if (!levels || typeof levels !== 'number') levels = 5;

   // Array of Lab values
   color = new Color(color).lab;

   // Convert max for darkening if necessary
   const effectiveLimit = lighten ? max : 100 - max;

   // Check if operation is possible within the specified max
   if (lighten && color[0] >= effectiveLimit) {
      // Lightening beyond or at the limit is not possible
      return false;
   } else if (!lighten && color[0] <= effectiveLimit) {
      // Darkening beyond or at the limit is not possible
      return false;
   }

   // Calculate the difference to effectiveLimit, based on lightening or darkening
   const difference = lighten
      ? effectiveLimit - color[0]
      : color[0] - effectiveLimit;

   // Calculate the adjustment per level
   const adjustmentPerLevel = difference / levels;

   return adjustmentPerLevel;
};
