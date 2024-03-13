const chokidar = require('chokidar');

/**
 * Watches a file for changes and triggers a callback when the file is modified.
 *
 * @param {string} filePath - The path to the file to watch.
 * @param {Function} callback - The callback function to execute on file change.
 */
module.exports = (filePath, callback) => {
   // Initialize watcher
   const watcher = chokidar.watch(filePath, {
      // ignored: /(^|[/\\])\../, // ignore dotfiles
      persistent: true,

      awaitWriteFinish: {
         // Amount of time in milliseconds for a file size to
         // remain constant before emitting its event.
         stabilityThreshold: 500,

         // File size polling interval.
         pollInterval: 300,
      },
   });

   // Event listener for file changes
   watcher.on('change', changedPath => {
      // console.log(`File ${changedPath} has been changed`);
      callback(changedPath);
   });

   // console.log(`Watching for file changes on ${filePath}`);
};
