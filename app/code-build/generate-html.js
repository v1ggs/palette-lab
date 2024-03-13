// Generate color__info-item for each color space.
const colorInfo = colorInfoObj => {
   // Object with the color's representation in other formats.
   const data = Object.entries(colorInfoObj);
   let htmlString = '';

   for (const [space, coords] of data) {
      let text;

      if (space !== 'labArr' && space !== 'mixAmount') {
         if (
            space === 'Perceived lightness (L*)' ||
            space === 'Luminance (Y)'
         ) {
            text =
               space === 'Perceived lightness (L*)'
                  ? `<b>${space}</b>: ${coords}`
                  : `<b>${space}</b>: ${coords}<hr>`;
         } else if (space === 'rgb' || space === 'rgb2') {
            text = `<b>RGB</b>: ${coords}`;
         } else {
            text = `<b>${space.toUpperCase()}</b>: ${coords}`;
         }

         htmlString += `
         <div class="color__info-item">
            ${text}
         </div>`;
      }
   }

   return htmlString;
};

/**
 * Generates an HTML string for a color palette from a specified object.
 *
 * Accepts a colorObject with color categories (e.g., primary, secondary), each
 * including all color info. Constructs an HTML document with styled divs for
 * each color (base) and gradation (tints and shades), for a preview in browser.
 *
 * @param {Object} colorObject - Contains all color info
 * @returns {string} HTML string for the color palette.
 */
module.exports = colorObject => {
   let htmlString = `<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Color Palette</title>
   <style>
   html {
      --color-dark: rgb(22, 22, 22);
      --color-medium-1: rgb(45, 45, 45);
      --color-medium-2: rgb(125, 125, 125);
      --color-medium-3: rgb(200, 200, 200);
      --color-light: rgb(225, 225, 225);

      box-sizing: border-box;
      background-color: var(--color-dark);
      font-size: 100%;
   }

   *,
   *::before,
   *::after {
      box-sizing: inherit;
   }

   body {
      width: 100%;
      margin: 0;
      overflow-x: hidden;
      font-family: sans-serif;
      font-size: 0.6rem;
      line-height: 1.5;
   }

   /* Main container, where all colors are */
   .container {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
   }

   /* Single color container (row) */
   .color {
      display: flex;
      height: 6rem;
      flex: 100%;
      align-items: stretch;
      padding: 1rem 1rem 0;
      background-color: var(--color-medium-1);
   }

   /* One color gradation: base, tint or shade */
   .color__gradation {
      position: relative;
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: flex-end;
      margin-bottom: 1rem;
   }

   .color__gradation:hover {
      z-index: 1;
      outline: 3px solid currentColor;
   }

   /* Element that shows color name or tint/shade level */
   .color__gradation::after {
      position: absolute;
      content: attr(data-text);
      top: 100%;
      left: 0;
      width: 100%;
      height: 1rem;
      padding-top: 2px;
      text-align: center;
      color: var(--color-medium-2);
      background-color: var(--color-medium-1);
   }

   /* Emphasise the base color name */
   .color__gradation--base::after {
         font-weight: 900;
   }

   /* Element containing color information,
      displayed on hover */
   .color__info {
      position: absolute;
      bottom: 0;
      transform: translateY(90%);
      padding: 0.2rem 0.3rem;
      border-radius: 0.25rem;
      color: var(--color-light);
      background-color: var(--color-medium-1);
      opacity: 0;
      white-space: nowrap;
      z-index: -1;
      /* Allows hovering over an item below,
         when the upper item's .color__info is open,
         but prevents copying data from the open item. */
      pointer-events: none;
      outline: 1px solid var(--color-dark);
      transition: all 0.4s ease;
   }

   /* Move all shades info to right, to prevent it
      going out of the screen on the first few items */
   .color__gradation--shade .color__info {
      left: 0;
   }

   /* Move all tints info to left, to prevent it
      going out of the screen on the last few items */
   .color__gradation--tint .color__info {
      right: 0;
   }

   .color__gradation:hover .color__info {
         opacity: 1;
         z-index: 1;
         transform: translateY(100%);
         pointer-events: all;
   }

   /* Capitalise the color name */
   .color__info-item:first-child::first-letter {
      text-transform: uppercase;
   }
   </style>
</head>
<body>

<div class="container">
`;

   // Iterate over each color category (e.g. primary, secondary)
   for (const [colorName, colorData] of Object.entries(colorObject)) {
      // Color container start
      htmlString += `<div class="color color--${colorName}">`;

      // Create shades, in reverse order.
      const shades = Object.entries(colorData.shades.gradations).reverse();
      for (const [level, shade] of shades) {
         const shadeColor = shade.hex;

         // Gradation item start
         htmlString += `
   <div data-text="-${level}"
      class="color__gradation color__gradation--shade"
      style="color: ${shadeColor}; background-color: ${shadeColor};">`;

         // Color Info start (visible on hover)
         htmlString += `
      <div class="color__info">`;

         // Add color gradation info, e.g. Shade 1.
         htmlString += `
         <div class="color__info-item"><b>${colorName}</b>: Shade ${level} (${shade.mixAmount})</div>`;

         htmlString += colorInfo(shade);

         // Color Info end
         htmlString += `
      </div>`;

         // Gradation item end
         htmlString += `
   </div>`;
      }

      // Create the base color.
      // Gradation item start
      const baseColor = colorData.info.hex;

      htmlString += `
   <div  data-text="${colorName}"
      class="color__gradation color__gradation--base"
      style="color: ${baseColor}; background-color: ${baseColor};">`;

      // Color Info start (visible on hover)
      htmlString += `
      <div class="color__info">`;

      // Add color gradation info, e.g. Shade 1.
      htmlString += `
         <div class="color__info-item"><b>${colorName}</b>: Base Color</div>`;

      htmlString += colorInfo(colorData.info);

      // Color Info end
      htmlString += `
      </div>`;

      // Gradation item end
      htmlString += `
   </div>`;

      for (const [level, tint] of Object.entries(colorData.tints.gradations)) {
         const tintColor = tint.hex;

         // Gradation item start
         htmlString += `
   <div data-text="${level}"
      class="color__gradation color__gradation--tint"
      style="color: ${tintColor}; background-color: ${tintColor};">`;

         // Color Info start (visible on hover)
         htmlString += `
      <div class="color__info">`;

         // Add color gradation info, e.g. Shade 1.
         htmlString += `
         <div class="color__info-item"><b>${colorName}</b>: Tint ${level} (${tint.mixAmount})</div>`;

         htmlString += colorInfo(tint);

         // Color Info end
         htmlString += `
      </div>`;

         // Gradation item end
         htmlString += `
   </div>`;
      }

      // Color container end
      htmlString += `</div>`;
   }

   htmlString += `

</body>
</html>`;

   return htmlString;
};
