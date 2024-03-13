/**
 * Generates configuration objects for tints and shades based on the input value.
 * If the input is a single number or a single-item array, both tints and shades
 * receive the same value. If the input is a two-item array, the first item is
 * assigned to shades and the second to tints.
 *
 * @param {number|array} value - The value(s) to set for tints and shades. Can be
 * a single number, a single-item array, or a two-item array.
 * @returns {Object} An object with `tintProperty` and `shadeProperty` set according
 * to the input value.
 */
module.exports = value => {
   let tintProperty, shadeProperty;

   // If value is a number or an array with only one item
   if (
      typeof value === 'number' ||
      (Array.isArray(value) && value.length === 1)
   ) {
      const newValue = Array.isArray(value) ? value[0] : value;
      tintProperty = newValue;
      shadeProperty = newValue;
   }
   // If value is an array with exactly two items
   else if (Array.isArray(value) && value.length === 2) {
      shadeProperty = value[0];
      tintProperty = value[1];
   }

   // Return an object containing both configurations
   return { tintProperty, shadeProperty };
};
