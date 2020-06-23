//Require necessary modules
const MongoClient = require('mongodb').MongoClient;
const et = require('elementtree');
const fs = require('fs');

var url = 'mongodb://localhost:27017/';


/**
 * STEP 1 - Read File Contents
 * Get number of files to read
 * Params - Directory Path
 * Returns Number of Files
 */
exports.files_in_directory = function (directory_path){
    return fs.readdirSync(directory_path).length-1; 
}


/**
 * Function Extracts data from rdf files and creates new files with objects
 * Returns object file name on successful extraction otherwise returns error
 * Params - file_path (minus trailing '/'), file_name (no extension) all String data type
 * Requires 'elementtree' package as et, 'fs' package as fs 
 */
exports.extract_save_fields = function(file_path, file_name){
    var objtoInsert = {};
    var new_subj_val = '';
    try{
        var data  = fs.readFileSync(file_path+'/'+file_name+'.rdf').toString();
        var etree = et.parse(data);

        var id_text = etree.findall('./pgterms:ebook')[0].get('rdf:about');
        var id_arr  = id_text.split('/');

        //Extract and add XML Fields to Object to be inserted into Database
        objtoInsert.book_id   = parseInt(id_arr[1]);
        objtoInsert.title     = etree.findtext('./pgterms:ebook/dcterms:title');
        objtoInsert.author    = etree.findtext('./pgterms:ebook/dcterms:creator/pgterms:agent/pgterms:name');
        objtoInsert.publisher = etree.findtext('./pgterms:ebook/dcterms:publisher');
        objtoInsert.publication_date = new Date(etree.findtext('./pgterms:ebook/dcterms:issued'));
        objtoInsert.language  = etree.findtext('./pgterms:ebook/dcterms:language/rdf:Description/rdf:value');
        objtoInsert.subjects  = {};
        var arr = etree.findall('./pgterms:ebook/dcterms:subject/rdf:Description/rdf:value');
        for (let index = 0; index < arr.length; index++) {
            new_subj_val = 'subject_'+(index+1);
            var element = arr[index].text;
            objtoInsert.subjects[new_subj_val] = element;
        }
        objtoInsert.rights = etree.findtext('./pgterms:ebook/dcterms:rights');

        fs.writeFile('./parsed_js/'+file_name+'.txt', JSON.stringify(objtoInsert), (err) => {
            if (err){
                console.log(error);
                return false;
            }else{
                return true;
            }
        });
        
    }catch(file_not_present_err){
        //Show errors if any
        console.log(file_not_present_err);
        return false;
    }
}


/**
 * STEP 2 - Function Insert Parsed Data into Mongo DB
 * Returns true if data is inserted otherwise returns false
 * Params - file_path (minus trailing '/'), file_name of Stringified file (no extension) 
 * all String data type
 */
exports.insert_extracted_data = function (file_path, file_name){
    MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, db) {
        if(err){
            return false;
        }
        var dbObject = db.db('gutenberg_titles');
    
        try{
            file_content = fs.readFileSync(file_path+'/'+file_name+'.txt');
            new_file_data = JSON.parse(file_content);

            //Check if document is present in db -> replace if present otherwise insert
            book_id = new_file_data.book_id;
            console.log(book_id);
            var check = await dbObject.collection('books').find({'book_id': book_id}).count();
            if(check > 0){
                dbObject.collection('books').replaceOne({'book_id': book_id}, new_file_data);
            }else{
                dbObject.collection('books').insertOne(new_file_data, (err, results) => {
                    if(err){
                        return false;
                    }
                }); 
            }

            return true;

        }catch(file_read_err){
            return false;
        }
    });
}


/**
 * Function Creates indexes on MongoDatabase - Optimization
 * Returns true for success and false otherwise
 * Params - Array[db_url, port, database, collection], Array[fields]
 */
exports.create_db_index = function(db_args = [], db_fields = []){
    db_url  = db_args['url'];
    db_port = db_args['port'];
    db_name = db_args['name'];
    db_collection = db_args['collection'];
    field_1 = db_fields[0];
    field_2 = db_fields[1];
    field_3 = db_fields[2];

    let url = 'mongodb://'+db_url+':'+db_port+'/';
    MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, db) {
        if (err){
            console.log(err);
            return false;
        }
        var dbObject = db.db(db_name);
        try{
            await dbObject.createIndex(db_collection, {field_1: 1, field_2: 1, field_3: 1});
            return true;
        }catch(error){
            return false;
        }
    });
}


