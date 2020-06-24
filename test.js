const MongoClient = require('mongodb').MongoClient;
const mocha  = require('mocha');
const assert = require('assert');

//File with functions to have tests run on
var create_index = require('./src/create_db_index');
var extract_data = require('./src/extract_save_fields'); 
var count_files  = require('./src/files_in_directory');
var insert_data  = require('./src/insert_extracted_data');

var url = 'mongodb://localhost:27017/'; //My MongoDb URL

describe('Meta Data Extractor Test', function(){
    /**
     * These Two inital functions are run before and after running the test to start and
     * stop the MongoDb Respectively
     * -Ensure to have the MongoDb service up running before the start
     */
    before(function(){
        //Open Database connection
        MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, db) {
            var dbObject = db.db('gutenberg_titles');
        });
    });

    after(function(){
        MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, db) {
            //Close Database connection
            db.close();
        });
    });

    /**
     * Group Unit Test to Save Files with extracted objects containing relevant fields.
     */
    describe('Extract Save Fields', function(){
        //Tests here
        it('Should return true', (done) => {
            //Fields successfully extracted and object saved in .txt file
            assert.ifError(extract_data.extract_save_fields('./files_to_read/2', 'pg2'));
            done();
        });
        it('Should throw an error and return false', (done) => {
            //Error in file paths/file name
            assert.strictEqual(false, extract_data.extract_save_fields('./files_to_read/2', 'pg5'));
            done();
        });
    });

    /**
     * Group Unit Test for Db insertion into Mongo Database
     */
    describe('Insert into Mongo Database', function(){
        //Tests here
        it('Should return true', (done) => {
            //Data successfully inserted into database
            assert.ok(insert_data.insert_extracted_data('./parsed_js', 'pg2'));
            done();
        });
        it('Should throw an error and return false', (done) => {
            //Error in file paths/file name
            assert.ifError(insert_data.insert_extracted_data('./parsed_s', 'pg2'));
            done();
        });
    });

    /**
     * Return number of files/folders in directory in case of running script through a loop
     */
    describe('Count number of files/folders to set as loop condition', function(){
        //Tests here
        it('Should return false', (done) => {
            //Number of files successfully returned
            assert.ok(count_files.files_in_directory('./parsed_js'));
            done();
        });
        it('Should throw an error and return false', (done) => {
            //Error in directory path
            assert.strictEqual(false, count_files.files_in_directory('./prds'));
            done();
        });
    });

    /**
     * Create indexes on Database fields to improve optimization and speed while retrieving
     * data
     */
    describe('Create indexes on database fields to improve optimization', function(){
        //Tests here
        var test_db_details = ['localhost', '27017', 'gutenberg_titles', 'books'];
        var test_db_fields  = ['title', 'author', 'publication_date'];

        it('Should return true', (done) => {
            //Indexes successfully created
            assert.ok(create_index.create_db_index(test_db_details, test_db_fields));
            done();
        });
        it('Should return ok if indexes already exist', (done) => {
            //Return ok if indexes currently exist
            assert.ok(create_index.create_db_index(test_db_details, test_db_fields));
            done();
        });
        it('Should throw an error and return false', (done) => {
            //Throw an error and return false if parameters are off
            assert.strictEqual(false, create_index.create_db_index(''));
            done();
        });
    });

});
