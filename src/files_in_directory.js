/**
 * STEP 1 - Read File Contents
 * Get number of files to read
 * Params - Directory Path
 * Returns Number of Files
 */

const fs = require('fs');

module.exports = function (directory_path){
    return fs.readdirSync(directory_path).length-1; 
}