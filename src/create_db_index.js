/**
 * Function Creates indexes on MongoDatabase - Optimization
 * Returns true for success and false otherwise
 * Params - Array[db_url, port, database, collection], Array[fields]
 */

const MongoClient = require('mongodb').MongoClient;

module.exports = function(db_args = [], db_fields = []){
    db_url  = db_args[0];
    db_port = db_args[1];
    db_name = db_args[2];
    db_collection = db_args[3];
    field_1 = db_fields[0];
    field_2 = db_fields[1];
    field_3 = db_fields[2];

    if(db_args.length == 0){
        //Use local values
        url = 'mongodb://localhost:27017';
        db_name = 'gutenberg_titles';
        db_collection = 'books';
        field_1 = 'new_file_data.title';
        field_2 = 'new_file_data.publisher';
        field_3 = 'new_file_data.publication_date';
    }else{
        let url = 'mongodb://'+db_url+':'+db_port+'/';
    }

    try{
        MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, db) {
            if (err){
                //console.log(err);
                return false;
            }
            var dbObject = db.db(db_name);
            
            await dbObject.createIndex(db_collection, {field_1: 1, field_2: 1, field_3: 1});
            
            console.log('Indexing Database complete');
            db.close();
            return true;
            
        });
    }catch(err){
        return false;
    }

}