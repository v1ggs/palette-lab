const path = require('path');
const { configFilename } = require('./paths.js');

// Function to safely delete module from require.cache
const purgeCache = modulePath => {
   try {
      delete require.cache[require.resolve(modulePath)];
   } catch (e) {
      console.error('Error purging module cache:', e);
   }
};

// Function to load and merge configurations.
module.exports = () => {
   const defaultConfigPath = path.join(__dirname, '../../', configFilename);
   const userConfigPath = path.join(process.cwd(), configFilename);
   let defaultConfig = {};
   let defaultPalette = {};
   let userConfig = {};
   let userPalette = {};

   const isSameFile = defaultConfigPath === userConfigPath;

   // Purge cache for both config files if they've been required before
   purgeCache(defaultConfigPath);
   if (!isSameFile) purgeCache(userConfigPath);

   // Load default config
   const defaultModule = require(defaultConfigPath);
   defaultConfig = defaultModule.config ? defaultModule.config : {};
   defaultPalette = defaultModule.palette ? defaultModule.palette : {};

   if (!isSameFile) {
      // Attempt to load the user's config file
      try {
         const userModule = require(userConfigPath);
         userConfig = userModule.config ? userModule.config : {};
         userPalette = userModule.palette ? userModule.palette : {};
      } catch (err) {
         console.log('No user config or error loading it:', err.message);
         // Reset userConfig to an empty object as fallback
         userConfig = {};
      }
   }

   return {
      // Merge configurations with user's config taking precedence
      config: { ...defaultConfig, ...userConfig },
      // Use `defaultPalette` just to avoid errors when the user's palette is empty.
      palette: Object.keys(userPalette).length ? userPalette : defaultPalette,
   };
};
