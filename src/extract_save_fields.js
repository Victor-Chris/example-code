/**
 * Function Extracts data from rdf files and creates new files with objects
 * Returns object file name on successful extraction otherwise returns error
 * Params - file_path (minus trailing '/'), file_name (no extension) all String data type
 * Requires 'elementtree' package as et, 'fs' package as fs 
 */

const et = require('elementtree');
const fs = require('fs');

module.exports = function(file_path, file_name){
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

