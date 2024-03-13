const Color = require('colorjs.io/dist/color.legacy.cjs').default;

// Configure ΔΕ2000 as the default algorithm.
// https://colorjs.io/docs/color-difference#setting-the-default-deltae-algorithm
Color.defaults.deltaE = '2000';

module.exports = labArr => {
   return (
      new Color('lab', labArr)
         // To srgb, just to convert later to rgb
         // https://colorjs.io/docs/output
         // When using sRGB or HSL, you can just use the output of
         // color.toString() directly in CSS.
         .to('srgb')
         // To rgb for CSS and ensure it's in gamut.
         .toString(/* { precision: 3 } */)
   );
};
