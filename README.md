# example-code
Meta-Data Extraction

file_to_read directory contains individual subdirectories containing .rdf files
parsed_js contains text files with stringified objects which are later on inserted in mongodb

-Scalability
  ->Due to the limited time, I was not able to try sharding but it's something that comes in handy especially with quite
    large data and reduces on the database strain. This coupled with the availabale indexes should prove quite effective
-Reliability
  ->MonogDb is tried and tested and thus it should be quite reliable particularly with such format of data that can easily
    converted into JSON format
-Querying the dataset
    ->Implemented index function for fields (title, author, publication_date) to make querying database faster
    ->Due to some missing data for some books and limited need for relations (with other tables/collections) 
      mongodb opted for, also adds to flexibility especially in the case of varying sections field.
