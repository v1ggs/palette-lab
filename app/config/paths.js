/**
 * Provides __dirname and __filename for ES Modules.
 *
 * Since ES Modules don't have __dirname and __filename globals like CommonJS,
 * this module uses import.meta.url along with fileURLToPath from the 'url' module
 * to simulate these values. Useful for file and directory operations where
 * absolute paths are needed.
 *
 * Usage:
 * Import __dirname and __filename from this module to get the current file's
 * and directory's absolute paths.
 *
 * Example:
 * import { __dirname, __filename } from './paths.js';
 *
 * Exports:
 * - __filename: Absolute path of the current module file.
 * - __dirname: Absolute path of the current module directory.
 */
// import { fileURLToPath } from 'url';
// export const __filename = fileURLToPath(import.meta.url);
// export const __dirname = path.dirname(__filename);

exports.configFilename = '.palette-lab.js';

exports.devfile = {
   scss: './src/_index.scss',
   // Keep them always here, dont write them in the user's project.
   css: __dirname + '/../../dist/index.css',
   html: __dirname + '/../../dist/index.html',
};
