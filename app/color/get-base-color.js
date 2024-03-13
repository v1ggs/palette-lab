const Color = require('colorjs.io/dist/color.legacy.cjs').default;
const mixColors = require('./mix-color.js');

/**
 * Retrieves or mixes the base color for a given color name from the provided palette.
 * It configures the ΔΕ2000 algorithm for accurate color difference calculations. If the
 * palette specifies a mix for the color, it combines the base color with the specified
 * mix color according to the mix percentage. If no mix is specified, it simply returns
 * the base color. All colors are returned as RGB strings.
 *
 * @param {string} colorName - The name of the color to retrieve or mix.
 * @param {Object} palette - The palette containing color definitions and optional mixes.
 * @returns {string} The base color or mixed color in RGB format.
 *
 * Note: The function depends on external functions like `mixColors()` and the `Color`
 * class from 'colorjs.io' for color mixing and conversions.
 */
module.exports = (colorName, palette) => {
   // Configure ΔΕ2000 as the default algorithm.
   // https://colorjs.io/docs/color-difference#setting-the-default-deltae-algorithm
   Color.defaults.deltaE = '2000';

   const base = palette[colorName]['base'];
   const mix = palette[colorName]['mix'];
   let baseColor;

   // If a mix is requested in config
   if (
      mix &&
      Array.isArray(mix) &&
      mix.length === 2 &&
      typeof mix[0] === 'string' &&
      typeof mix[1] === 'number' &&
      mix[0] !== colorName
   ) {
      const mixColorName = mix[0];
      const mixBase = palette[mixColorName]['base'];
      const mixPercentage = mix[1];

      // mixColors() returns rgb()
      baseColor = mixColors(base, mixBase, mixPercentage);
   } else {
      // mixColors() (above) returns rgb(), therefore:
      // .to('srgb').toString({ format: 'rgb' }), to have
      // the result in the same format in both cases.
      baseColor = new Color(base).to('srgb').toString({ format: 'rgb' });
   }

   // RGB
   return baseColor;
};
