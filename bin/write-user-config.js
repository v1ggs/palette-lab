#!/usr/bin/env node

// This writes a user config in the root, if it does not exist.

const fs = require('fs');
const path = require('path');
const { configFilename } = require('../app/config/paths.js');
const writeFile = require('../app/filesystem/write-file.js');

// This file is run with `postinstall` script. When `postinstall` is run,
// cwd() is still this package, not the user's root dir. Therefore:
const userProjectRoot = process.env.INIT_CWD;

const configFile = path.join(userProjectRoot, configFilename);

const configContent = `// General config
exports.config = {
   // Output path for the SCSS file
   scssFile: './src/scss/_palette-lab.scss',

   // Function that you'll use in scss
   scssFn: 'color',

   // URL for preview server.
   // Use 'localhost' or direct other domains to localhost in hosts file.
   previewUrl: 'localhost:3330',
};

// Define colors here
exports.palette = {
  primary: {
      // Base color
      base: '#808080',

      // Number of gradations to black and white
      gradations: [5],

      // Max lightness percentage for black and white
      max: [100],

      // Mix with another color [<color>, <percentage>]
      // Can be useful for creating tinted neutrals,
      // e.g. mix gray with primary 5%.
      mix: [],
  },

  // Add more colors as here.
};
`;

module.exports = (() => {
   fs.access(configFile, fs.constants.F_OK, err => {
      if (err) {
         writeFile(configFile, configContent, err => {
            if (err) throw err;
            console.log(`User config file has been created: "${configFile}".`);
         });
      } else {
         console.log(`"${configFile}" already exists.`);
      }
   });
})();
