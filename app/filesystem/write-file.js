const fs = require('fs');
const path = require('path');

const writeFile = (filePath, data) => {
   fs.writeFile(filePath, data, err => {
      if (err) {
         console.error('Error writing file:', err);
      }
   });
};

/**
 * Asynchronously ensures a directory exists and writes data to a file.
 *
 * The function checks if the directory for the given filePath exists.
 * If not, it creates the directory recursively. Then, it writes the
 * provided data to the specified filePath. Uses callback-based fs
 * methods for directory existence check, directory creation, and file
 * writing.
 *
 * @param {string} filePath - Full path to the target file.
 * @param {string} data - Data to be written to the file.
 */
module.exports = (filePath, data) => {
   const dirPath = path.dirname(filePath);

   // Check if the directory exists
   fs.stat(dirPath, err => {
      if (err) {
         // If the directory does not exist, create it
         fs.mkdir(dirPath, { recursive: true }, err => {
            if (err) {
               return console.error('Error creating directory:', err);
            }

            // Directory is ensured, now write the file
            writeFile(filePath, data);
         });
      } else {
         // Directory already exists, write the file
         writeFile(filePath, data);
      }
   });
};
