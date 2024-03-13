// General config
exports.config = {
   // Output path for the SCSS file
   scssFile: './src/scss/_palette-lab.scss',

   // Function that you'll use in scss
   scssFn: 'color',

   // URL for preview server.
   // Use 'localhost' or direct other domains to localhost in hosts file.
   previewUrl: 'localhost:3330',
};

// Define your colors here
exports.palette = {
   'primary': {
      base: 'hsl(240, 80%, 60%)',
      gradations: 10,
   },

   'secondary': {
      base: '#FF5500',
      gradations: [12],
      max: [100, 96],
      mix: ['primary', 80],
   },

   // 'tertiary': {
   //    base: 'hsl(300, 70%, 35%)',
   //    gradations: 5,
   //    max: [100],
   //    mix: ['secondary', 30],
   // },

   'accent': {
      base: '#BB8822',
      gradations: [3, 2],
      max: [75, 50],
   },

   'tinted-gray': {
      base: '#808080',
      gradations: 5,
      max: [100, 96],
      // mix: ['primary', 10],
   },

   // Add more colors as needed.
};
