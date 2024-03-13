/**
 * This function processes a complex color object that includes various color
 * properties and gradation details, extracting and organizing it into a
 * simplified structure, with only required properties.
 *
 * @param {Object} colorObject - The complex color object to simplify.
 * @returns {Object} A simplified color object.
 */
const formatColorObject = colorObject => {
   const colorInfo = {};

   Object.entries(colorObject).forEach(([colorName, colorDetails]) => {
      const name = colorName;
      const config = colorDetails.config;
      const info = colorDetails.info;
      const base = info.rgb;

      const tints = Object.fromEntries(
         Object.entries(colorDetails.tints.gradations).map(
            ([level, gradation]) => [level, gradation.rgb],
         ),
      );

      const shades = Object.fromEntries(
         Object.entries(colorDetails.shades.gradations).map(
            ([level, gradation]) => [level, gradation.rgb],
         ),
      );

      colorInfo[colorName] = {
         name,
         base,
         config,
         info,
         tints,
         shades,
      };
   });

   return colorInfo;
};

/**
 * Prepares a color object for conversion into an SCSS map.
 *
 * This function filters the original color object to retain only the base color, tints, and shades
 * for each color. The resulting object is suitable for generating an SCSS map that includes these
 * specific properties for each color.
 *
 * @param {Object} colorObject - The original color object containing detailed information about each color.
 * @returns {Object} An object formatted for SCSS map conversion, containing base color, tints, and shades.
 */
const prepareForScssMap = colorObject => {
   const obj = {};

   Object.entries(colorObject).forEach(([colorName, colorDetails]) => {
      obj[colorName] = {
         base: colorDetails.base,
         tints: colorDetails.tints,
         shades: colorDetails.shades,
      };
   });

   return obj;
};

const generateColorInfo = colorObject => {
   // Initialize an empty string to accumulate documentation
   let documentationString = '';

   for (const item in colorObject) {
      if (Object.prototype.hasOwnProperty.call(colorObject, item)) {
         const color = colorObject[item];

         const originalCfg = color.config;
         const infos = color.info;

         // Add only the value for the color name
         documentationString += `/// - ${color.name}:\n`;

         // Iterate over the properties of the config
         for (const property in originalCfg) {
            if (Object.prototype.hasOwnProperty.call(originalCfg, property)) {
               if (property === 'levels' || property === 'max') {
                  documentationString += `///    - ${property}: ${originalCfg[property]}\n`;
               }
            }
         }

         // Iterate over the properties of the infos object
         for (const property in infos) {
            if (Object.prototype.hasOwnProperty.call(infos, property)) {
               if (
                  property === 'rgb' ||
                  property === 'hex' ||
                  property === 'hsl'
               ) {
                  documentationString += `///    - ${property}: ${infos[property]}\n`;
               }
            }
         }

         // Add a new line after processing each color
         documentationString += '///\n';
      }
   }

   // Add the final '///' line
   // documentationString += "///";

   return documentationString;
};

/**
 * Generates an SCSS function with documentation for retrieving colors from a palette.
 * This function creates SCSS code for `palette-color`, which fetches base colors,
 * tints, and shades based on a name and optional level. It includes dynamic documentation
 * for available colors and usage examples to aid developers with IntelliSense.
 *
 * @param {String} colormap - The SCSS map variable name containing color data.
 * @param {String} functionName - Function that will be used to retrieve colors from the map.
 * @param {String} colorsInfo - String containing documentation about available colors.
 * @returns {String} SCSS function code with documentation and examples.
 */
const scssFn = (colormap, functionName, colorsInfo) => {
   // Print color infos here, for SCSS intellisense to
   // display them together with the function usage.
   return (
      '\n/// Retrieves a tint or shade from the color palette.\n///\n/// Available (base) colors:\n' +
      colorsInfo +
      `/// Usage:
///   - Use only the color name for the base color
///   - Use positive levels for tints
///   - Use negative levels for shades
///
/// @example
///   palette-color(color-name) // base
///   palette-color(color-name, 3) // tint
///   palette-color(color-name, -3) // shade
///
/// @param {String} $color-name - Name of the color to retrieve.
/// @param {Number} [$level=0] - Optional level for tint or shade (default: 0).
/// @returns {String} RGB color value.
@function ${functionName}($color-name, $level: 0) {
   $levels: base;
   $color-value: '';

   @if $level == 0 {
      // Get the base color
      $color-value: map.get(${colormap}, $color-name, $levels);
   }

   @if $level < 0 {
      $levels: shades;

      // Access the specific tint or shade value from the map
      $color-value: map.get(${colormap}, $color-name, $levels, math.abs($level));
   }

   @if $level > 0 {
      $levels: tints;

      // Access the specific tint or shade value from the map
      $color-value: map.get(${colormap}, $color-name, $levels, math.abs($level));
   }

   // Return the color value
   @return $color-value;
}`
   );
};

/**
 * Converts a JavaScript object to an SCSS map declaration string.
 *
 * Transforms a given JavaScript object into a string formatted as an
 * SCSS map. It automatically formats the object properties and values
 * according to SCSS syntax, including converting object curly braces to
 * parentheses and ensuring strings are correctly quoted. The result is
 * prefixed with `@use` directives for necessary SASS modules and appended
 * with a call to an SCSS function (`scssFn`) on the provided variable.
 *
 * @param {string} variable - The name of the SCSS variable to declare.
 * @param {Object} jsObject - The JavaScript object to convert.
 * @returns {string} A string declaring an SCSS map, ready for inclusion
 *                   in SCSS files.
 */
module.exports = (variable, fn, jsObject) => {
   // Make it a scss variable.
   if (!variable.startsWith('$')) variable = '$' + variable;

   const formattedObject = formatColorObject(jsObject);
   const colorObject = prepareForScssMap(formattedObject);
   const colorsInfo = generateColorInfo(formattedObject);
   const scssFunction = scssFn(variable, fn, colorsInfo);

   const data =
      "@use 'sass:map';\n@use 'sass:math';\n@use 'sass:string';\n\n" +
      `${variable}: ` +
      JSON.stringify(colorObject)
         // Replace curly braces with parentheses
         .replace(/\{/g, '(')
         .replace(/\}/g, ')')
         // Ensure property names are correctly formatted
         .replace(/"([^"]+)":/g, '$1:')
         // Remove quotes from values
         .replace(/:\s*["'](.*?)["']/g, ': $1')
         // Replace semicolons with commas for SCSS syntax
         .replace(/;(?![^\(]*\))/g, ',') + // eslint-disable-line
      ';\n' +
      scssFunction;

   return data;
};
