const Color = require('colorjs.io/dist/color.legacy.cjs').default;
const { getLuminance, hexToRgb } = require('./get-luminance.js');

/**
 * Translates the color in various formats, including HEX, RGB, HSL, LAB,
 * and an array of LAB values, and returns them in an object.
 *
 * @param {String} color - Color in any format.
 * @param {String} mixAmount - Info about the proportion of white or black mixed into the color.
 * @returns {Object} An object containing color information in various formats.
 */
module.exports = (color, mixAmount) => {
   // Configure ΔΕ2000 as the default algorithm.
   // https://colorjs.io/docs/color-difference#setting-the-default-deltae-algorithm
   Color.defaults.deltaE = '2000';

   const base = new Color(color);
   const labArr = base.lab;
   // `.toString()` converts to the chosen format and ensures it's in gamut.
   const hex = base.to('srgb').toString({ format: 'hex' }).toUpperCase();
   const luminance = getLuminance(hex);

   return {
      'Perceived lightness (L*)': labArr[0].toFixed(2),
      'Luminance (Y)':
         luminance.luminance.toFixed(5) + ' (' + luminance.luminancePerc + '%)',
      hex,
      'rgb': `rgb(${hexToRgb(hex).join()})`,
      'rgb2': base.to('srgb').toString({ format: 'rgb', precision: 4 }),
      'hsl': base.to('hsl').toString(),
      'hwb': base.to('hwb').toString(),
      'hsv': base.to('hsv').toString(),
      'lab': base.to('lab').toString(),
      'lch': base.to('lch').toString(),
      'p3-linear': base.to('p3-linear').toString(),
      mixAmount,
      labArr,
   };
};
