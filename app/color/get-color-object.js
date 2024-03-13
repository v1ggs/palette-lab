const colorInfo = require('./get-color-info.js');
const getProperty = require('./get-property.js');
const getGradation = require('./get-gradation.js');
const getBaseColor = require('./get-base-color.js');

/**
 * Processes a color configuration to generate its tints and shades, including gradations in multiple color spaces.
 * It determines the gradations based on the specified levels and max limits for lightening and darkening, and includes
 * additional color information across various color spaces. If the configuration specifies mixing with another color,
 * it applies the mix before calculating gradations.
 *
 * @param {string} colorName - The name of the color to process, as defined in the palette.
 * @param {Object} palette - The color palette containing configurations for base colors, levels, max limits, and optional mixing.
 * @returns {Object} An object representing the processed color, including the original configuration, color information in various
 *                   color spaces, and detailed objects for both tints and shades that contain the number of levels, adjustment
 *                   per gradation, max limits, and all gradations translated into multiple color spaces.
 */
module.exports = (colorName, palette) => {
   // RGB (color is mixed if required in the config)
   const baseColor = getBaseColor(colorName, palette);
   // Single color config
   const colorConfig = palette[colorName];
   const levels = getProperty(colorConfig.gradations);
   const max = getProperty(colorConfig.max);
   // Color representation in other spaces
   const info = colorInfo(baseColor);

   const tints = getGradation({
      color: baseColor,
      lighten: true,
      levels: levels.tintProperty,
      max: max.tintProperty,
   });

   const shades = getGradation({
      color: baseColor,
      lighten: false,
      levels: levels.shadeProperty,
      max: max.shadeProperty,
   });

   // Translate each gradation into other spaces
   const tintsInfo = {};
   for (const [level, tint] of Object.entries(tints.gradations)) {
      tintsInfo[level] = colorInfo(
         tint,
         'white ' + tints.mixAmount[level] + '%',
      );
   }

   // Translate each gradation into other spaces
   const shadesInfo = {};
   for (const [level, shade] of Object.entries(shades.gradations)) {
      shadesInfo[level] = colorInfo(
         shade,
         'black ' + shades.mixAmount[level] + '%',
      );
   }

   const color = {
      // Original color config
      config: colorConfig,

      // Color representation in other spaces
      info,

      tints: {
         // Requested number of tints
         levels: levels.tintProperty,
         // Top/bottom limit
         max: max.tintProperty,
         // All gradations (in multiple spaces)
         gradations: tintsInfo,
      },

      shades: {
         // Requested number of shades
         levels: levels.shadeProperty,
         // Top/bottom limit
         max: max.shadeProperty,
         // All gradations (in multiple spaces)
         gradations: shadesInfo,
      },
   };

   return color;
};
