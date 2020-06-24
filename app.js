//Import Functions
var files_in_directory  = require('./src/files_in_directory');
var extract_save_fields = require('./src/extract_save_fields');
var insert_extracted_data = require('./src/insert_extracted_data');
var create_db_index = require('./src/create_db_index');

//Run functions with default file folders
function extract_meta_data(){
    //Step 1 -> Extract data and save objects to .txt.files
    //Get number of rdf files in default folder
    var no_of_files = files_in_directory('./files_to_read/');

    for (let index = 1; index < (no_of_files+1); index++) {
        extract_save_fields('./files_to_read/'+index,'pg'+index);
        console.log(`Extracted from ${index} files...`);
    }

    //Step 2 -> Insert data into database
    for (let index = 1; index < (no_of_files+1); index++) {
        insert_extracted_data('./parsed_js', 'pg'+index);
        console.log(`Inserted ${index} files into database...`);
    }

    create_db_index();

}

extract_meta_data();
