#!/usr/bin/env node

// Serves just to make sure the built SCSS works in development.

// const fs = require('fs');
const sass = require('sass');
const { devfile } = require('../app/config/paths.js');
const watcher = require('../app/filesystem/watcher.js');
const writeFile = require('../app/filesystem/write-file.js');

// Function to compile SCSS to CSS
const compileSass = () => {
   console.log(`Compiling...`);

   try {
      const result = sass.compile(devfile.scss, {
         //   style: "compressed",
      });

      writeFile(devfile.css, result.css);

      console.log('SCSS was successfully compiled.');
   } catch (error) {
      console.error('Failed to compile SCSS:', error);
   }
};

compileSass();

// Watch for changes
// eslint-disable-next-line
watcher(`./src/**/*.scss`, path => {
   compileSass();
});

console.log('Watching for SCSS file changes...');
console.log('Stop with CTRL+C.');
