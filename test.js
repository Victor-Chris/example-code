const MongoClient = require('mongodb').MongoClient;
const mocha  = require('mocha');
const assert = require('assert');

//File with functions to have tests run on
var app = require('./app');
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
            assert.ifError(app.extract_save_fields('./files_to_read/2', 'pg2'));
            done();
        });
        it('Should return false', (done) => {
            assert.strictEqual(false, app.extract_save_fields('./files_to_read/2', 'pg5'));
            done();
        });
    });

    /**
     * Group Unit Test for Db insertion into Mongo Database
     */
    describe('Insert into Mongo Database', function(){
        //Tests here
        it('Should return true', (done) => {
            assert.ok(app.insert_extracted_data('./parsed_js', 'pg2'));
            done();
        });
        it('Should return false', (done) => {
            assert.ifError(app.insert_extracted_data('./parsed_s', 'pg2'));
            done();
        });
    });

});
