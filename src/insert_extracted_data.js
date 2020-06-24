/**
 * STEP 2 - Function Insert Parsed Data into Mongo DB
 * Returns true if data is inserted otherwise returns false
 * Params - file_path (minus trailing '/'), file_name of Stringified file (no extension) 
 * all String data type
 */

const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

var url = 'mongodb://localhost:27017';

module.exports = function (file_path, file_name){
    MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, db) {
        if(err){
            return false;
        }
        var dbObject = db.db('gutenberg_titles');
    
        try{
            data  = fs.readFileSync(file_path+'/'+file_name+'.txt');
            new_file_data = JSON.parse(data);

            //Check if document is present in db -> replace if present otherwise insert
            book_id = new_file_data.book_id;

            await dbObject.collection('books').updateOne({'book_id': book_id}, {$set: {new_file_data}}, {upsert: true}); 

            db.close();
            return true;

        }catch(file_read_err){
            db.close();
            return false;
        }

    });
}

