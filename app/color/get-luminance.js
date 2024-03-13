/**
 * https://gist.github.com/mnpenner/70ab4f0836bbee548c71947021f93607
 * @param hex RGB hex string like "#CCCFDB"
 * @returns RGB array in [0-255]
 */
exports.hexToRgb = hex => {
   const h = String(hex).replace(/^#/, '');
   if (h.length === 3) {
      return [
         parseInt(h[0] + h[0], 16),
         parseInt(h[1] + h[1], 16),
         parseInt(h[2] + h[2], 16),
      ];
   } else if (h.length === 6) {
      return [
         parseInt(h.slice(0, 2), 16),
         parseInt(h.slice(2, 4), 16),
         parseInt(h.slice(4, 6), 16),
      ];
   }

   // Fallback
   return [127.5, 127.5, 127.5];
};

/**
 * An excellent article at: https://stackoverflow.com/a/56678483
 * Calculates the luminance of a color given its hexadecimal representation.
 *
 * @param {string} colorHex - The color in hexadecimal format (e.g., "#FFFFFF").
 * @returns {Object} An object containing the luminance value and its percentage representation.
 */
exports.getLuminance = colorHex => {
   // Converts a hex color string to an RGB array.
   const rgbArr = this.hexToRgb(colorHex);

   const [r, g, b] = rgbArr.map(color => {
      // Convert all sRGB 8 bit integer values to decimal 0.0-1.0
      color /= 255;

      // Convert a gamma encoded RGB to a linear value.
      // sRGB (computer standard) for instance requires a
      // power curve of approximately ^2.2
      return color <= 0.04045
         ? color / 12.92
         : Math.pow((color + 0.055) / 1.055, 2.4);
   });

   // To find Luminance (Y) apply the standard coefficients for sRGB.
   const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
   // const luminance = 0.212655 * r + 0.715158 * g + 0.072187 * b;

   // Return both the luminance and its percentage format.
   return { luminance, luminancePerc: (luminance * 100).toFixed(3) };
};
