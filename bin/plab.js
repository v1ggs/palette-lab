#!/usr/bin/env node

const path = require('path');
const color = require('../app/color/color.js');
const server = require('../app/server/server.js');
const watcher = require('../app/filesystem/watcher.js');
const loadConfig = require('../app/config/load-config.js');
const writeFile = require('../app/filesystem/write-file.js');
const makeHtml = require('../app/code-build/generate-html.js');
const makeScss = require('../app/code-build/generate-scss.js');
const { devfile, configFilename } = require('../app/config/paths.js');

const buildHtml = () => {
   try {
      const config = loadConfig();
      const palette = color(config.palette);
      const html = makeHtml(palette);
      const scss = makeScss('$palette-lab', config.config.scssFn, palette);

      writeFile(devfile.html, html);
      writeFile(config.config.scssFile, scss);
   } catch (error) {
      console.error('Error building HTML:', error);
   }
};

(() => {
   buildHtml();

   // Watch the user config change
   watcher(path.join(process.cwd(), configFilename), () => {
      console.log(`Rebuilding the palette...`);
      buildHtml();
   });

   // Start the server
   server();
})();
