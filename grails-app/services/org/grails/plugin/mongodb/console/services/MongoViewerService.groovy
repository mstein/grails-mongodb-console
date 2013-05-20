package org.grails.plugin.mongodb.console.services

import com.gmongo.GMongo
import com.mongodb.BasicDBObject
import com.mongodb.DBCursor
import com.mongodb.DBObject
import com.mongodb.MongoException
import com.mongodb.WriteConcern
import grails.converters.JSON

class MongoViewerService {
    GMongo mongo

    Collection<String> listDB() {
        mongo.mongo.getDatabaseNames()
    }

    Collection<String> listCollections(String dbname) {
        mongo.mongo.getDB(dbname)?.collectionNames
    }

    def "import"(String db, String collection, InputStream input, String type = "json", Boolean drop = false, Boolean upsert = false, Boolean stopOnError = false) {
        if (!db || !collection) {
            throw new MongoException("Cannot import data, database or Collection name is not specified.")
        }
        switch (type.toLowerCase()) {
            case "json":
                importFromJSON(db, collection, input, drop, upsert, stopOnError)
                break
            case "csv":
                importFromCSV(db, collection, input, drop, upsert, stopOnError)
                break
            default:
                throw new MongoException("Cannot import data, unsupported input data format ${type}.")
                break
        }
    }

    private importFromCSV(String db, String collection, InputStream input, Boolean drop = false, Boolean upsert = false, Boolean stopOnError = false){
        // TODO
    }

    /**
     * Import documents from a JSON file content.
     * Each documents must be separated by a new line.
     *
     * @param db The database name in which you want to import the data
     * @param collection The collection name in which you want to import the data
     * @param input The InputStream of the file containing the documents
     * @param drop (Optional) If set to TRUE, will first completely drop the collection before inserting the documents. Default to FALSE.
     * @param upsert (Optional) If set to TRUE, will insert or update documents if they exists in the database. Default to FALSE.
     * @param stopOnError (Optional) If set to TRUE, will stop the import process on the first error encountered (throws an exception), Default to FALSE.
     */
    private importFromJSON(String db, String collection, InputStream input, Boolean drop = false, Boolean upsert = false, Boolean stopOnError = false) {
        def isMaster = runCommand('ismaster')?.'ismaster'
        if (!isMaster) {
            log.error "Cannot import data to the specified server : The mongodb instance is not a master or a primary."
            throw new MongoException("Cannot import data to the specified server : The mongodb instance is not a master or a primary.")
        }

        def content = input.text
        def lines = content.tokenize('\n')
        def jsonDocuments = []
        def lastOpenBracketsCount = 0
        def lastCloseBracketsCount = 0
        StringBuilder buffer = new StringBuilder()

        // Building the jsonDocuments collection. The doccuments are splitted per newline (\n),
        // but the new line may appears inside a JSON document before the actual end of it (ex: in a text, or just for
        // visual purpose. So we are doing a simple check : if the last character of the line is not the character "}" (end of a document)
        // then the line is not a complete document, and the next line should be considered as part of the document.
        for(line in lines) {
            def openBracketsCount = (line =~ /\{/).count + lastOpenBracketsCount
            def closeBracketsCount = (line =~ /\}/).count + lastCloseBracketsCount
            if (!line.trim().endsWith('}') || openBracketsCount != closeBracketsCount) {
                buffer.append(line)
                lastOpenBracketsCount = openBracketsCount
                lastCloseBracketsCount = closeBracketsCount
            } else {
                if (buffer.size() > 0) {
                    buffer.append(line)
                    jsonDocuments << buffer.toString()
                    buffer = new StringBuilder()
                    lastOpenBracketsCount = lastCloseBracketsCount = 0
                } else {
                    jsonDocuments << line
                }
            }
        }

        // Pre-parse all the json document, this allow to detect any JSON syntax error, so that we won't trigger a drop (if the drop option is set to TRUE)
        // if there are syntaxes errors in the json documents and if we set stopOnError to TRUE
        def bsonDocuments = jsonDocuments.inject([]) { Collection col, String entry ->
            try {
                col << com.mongodb.util.JSON.parse(entry)
            } catch(Throwable t) {
                if (stopOnError) {
                    throw t
                } else {
                    log.error "Invalid JSON entry detected, will be ignored.", t
                }
            }
            col
        }

        // Only proceed if we have at least 1 document to import
        if (bsonDocuments) {
            def mongoCollection = mongo.getDB(db).getCollection(collection)
            // If the drop option is true, then drop the collection
            if (drop) {
                mongoCollection.drop()
            }

            // Inserting the documents
            for(DBObject bsonDocument in (bsonDocuments as List<DBObject>)) {
                try {
                    mongoCollection.insert(bsonDocument, WriteConcern.SAFE)
                } catch(com.mongodb.MongoException.DuplicateKey me) {
                    if (upsert) {
                        // Being here means that the _id is defined in the document, so we call an update
                        mongoCollection.update(new BasicDBObject("_id":bsonDocument._id), bsonDocument, true, false, WriteConcern.SAFE)
                    } else {
                        if (stopOnError) {
                            throw me
                        } else {
                            log.debug "Duplicate in the import, ignored since upsert is set to FALSE."
                        }
                    }
                }
            }
        }

    }

    /**
     * Export the documents of the specified collection in a json file.
     * Can be used to export a full collection or a subset (filtered by a query).
     *
     * TODO Handle a full query (including skip, limit, field, etc.), currently only take the query itself
     *
     * @param db The database name where the collection is stored
     * @param collection The collection name
     * @param query (Optional) A query to filter the result to export
     * @return ByteArrayOutputStream A outputstream representing the export file
     */
    ByteArrayOutputStream export(String db, String collection, Map mapQuery = null) {
        def mongoCollection = mongo.getDB(db).getCollection(collection)
        if(mongoCollection) {
            DBCursor results
            if(mapQuery) {
                BasicDBObject query = new BasicDBObject(mapQuery)
                results = mongoCollection.find(query)
            } else {
                results = mongoCollection.find()
            }

            // TODO : write in a file? The export may be too big for the main memory.
            // TODO : We need to add some watchdog to prevent out of memory exception.
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream()
            for(res in results) {
                outputStream.write(res.toString().bytes)
                outputStream.write('\n'.bytes)
            }

            return outputStream
        } else {
            throw new MongoException("Cannot export data: database name or collection not specified or does not exist.")
        }
        return null
    }

    /**
     * Runs a command on the mongodb server
     *
     * @param command
     * @return
     */
    def runCommand(command) {
        if (command instanceof Map) {
            return mongo.getDB("admin").command(new BasicDBObject(command))
        } else {
            return mongo.getDB("admin").command(command?.toString())
        }
    }
}
