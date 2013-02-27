package mongo.viewer

import grails.converters.JSON

import com.gmongo.GMongo
import com.mongodb.BasicDBList
import com.mongodb.BasicDBObject
import com.mongodb.DBCursor
import com.mongodb.DBObject
import com.mongodb.MongoException

class MviewerController {

    GMongo mongo

    private mviewerSession(dbname = null, colname = null) {
        if(!session.mviewer) {
            session.mviewer = [:]
        }
        session.mviewer.currentDB = dbname
        session.mviewer.currentCol = colname
    }

    def dispatchLink() {
        redirect url: "/$controllerName#/mongo${params.dbname? '/'+params.dbname : ''}${params.colname ? '/'+params.colname : ''}"
    }

    def tplDatabase() {
        render template: '/database/table', model: [databases:mongo.mongo.getDatabaseNames()]
    }

    def tplCollections() {
        render template: '/collection/table', model: [databases:mongo.mongo.getDatabaseNames()]
    }

    def tplDocuments(){
        render template: '/document/list', model: [databases:mongo.mongo.getDatabaseNames()]
    }

    def index() {
        [databases:mongo.mongo.getDatabaseNames(), currentDB: params.dbname, currentCol: params.colname]
    }

    def listDb() {
        def resp = mongo.getDB("admin").command("listDatabases")
        render ([totalSize: resp.totalSize,
                databases: resp?.databases?.inject([:]) { map, entry ->
                    map[entry.name] = entry
                    map
                }] as JSON)
    }

    def listCollections() {
        mviewerSession(params.dbname)
        render mongo.getDB(params.dbname).getCollectionNames() as JSON
    }

    def createDb() {
        mviewerSession(request.JSON.dbname)
        mongo.getDB(request.JSON.dbname).createCollection('default', [:])
        forward action: "listDb"
    }

    def copyDb() {
        def db = mongo.getDB(params.dbname)

        try {
            //db.command("copyDb")
        }catch(e) {
            log.error e.message, e
        }
    }

    def dropDb() {
        mviewerSession()
        mongo.getDB(request.JSON.dbname).dropDatabase()
        forward action: "listDb"
    }

    def createCollection() {
        String dbname = request.JSON.dbname
        String colname = request.JSON.newColname
        def db = mongo.getDB(dbname)
        try {
            db.createCollection(colname, [:])
            mviewerSession(request.JSON.dbname, request.JSON.newColname)
        }catch(MongoException mongoException) {
            render status: 500, text:mongoException.message
            return
        }
        render status: 200
    }

    def renameCollection() {
        def db = mongo.getDB(request.JSON.dbname)
        def col = db.getCollection(request.JSON.colname)

        try {
            col.rename(request.JSON.newColname)
            mviewerSession(request.JSON.dbname, request.JSON.newColname)
            render status: 200
        } catch(e) {
            log.error e.message, e
            render status: 500
        }
    }

    def dropCollection() {
        def db = mongo.getDB(request.JSON.dbname)
        def col = db.getCollection(request.JSON.colname)

        try {
            col.drop()
            mviewerSession(request.JSON.dbname)
            render status: 200
        } catch(e) {
            log.error e.message, e
            render status: 500
        }
    }

    /**
     * Query the database for one document matching the query.
     *
     * Equivalent to a call to the mongo shell entry below :
     *      db.collection.findOne(<query>, <fields>)
     *
     * Consumes a JSON document containing the keys listed for this action.
     * @param dbname (Required) The name of the database on which this find query should be ran
     * @param colname (Required) The name of the collection on which this find query should be ran
     * @param query (Optional) A JSON portion representing the criterias of the query, if none is provided, just return everything (up to the limit)
     * @param fields (Optional) A JSON portion determining the field(s) to return in the results. If none provided, will return the complete document.
     * Note that the _id field is always return unless explicitly excluded.
     *
     */
    def findOne() {
        def rawJSON = request.reader.text
        def mongoJson = com.mongodb.util.JSON.parse(rawJSON)

        def db = mongo.getDB(mongoJson.dbname)
        def col = db.getCollection(mongoJson.colname)
        mviewerSession(db, col)

        def result = col.findOne(mongoJson.query ?: new BasicDBObject(), mongoJson.fields ?: new BasicDBObject())
        def args = [:]
        for(key in result.keySet()) {
            args[key] = marshallDocument(result[key])
        }
        def res = [results:[args], totalCount:args ? 1 : 0]
        render res as JSON
    }

    /**
     * Query the database for a set of documents that may be sorted and paginated.
     *
     * Equivalent to a call to the mongo shell entry below :
     *      db.collection.find(<query>, <fields>).sort(<fields>).limit(<max>).skip(<offset>)
     *
     * Consumes a JSON document containing the keys listed for this action.
     *
     * @param dbname (Required) The name of the database on which this find query should be ran
     * @param colname (Required) The name of the collection on which this find query should be ran
     * @param query (Optional) A JSON portion representing the criterias of the query, if none is provided, just return everything (up to the limit)
     * @param fields (Optional) A JSON portion determining the field(s) to return in the results. If none provided, will return the complete document.
     * Note that the _id field is always return unless explicitly excluded.
     * @param sort (Optional) A JSON portion representing the field on which the results should be sorted and the order direction
     * @param max (Optional) The maximum number of results to return, default is 30
     * @param offset (Optional) The number of results to skip, default is 0
     *
     * @return
     */
    def find() {
        def rawJSON = request.reader.text
        def mongoJson = com.mongodb.util.JSON.parse(rawJSON)

        def db = mongo.getDB(mongoJson.dbname)
        def col = db.getCollection(mongoJson.colname)
        mviewerSession(db, col)

        // For some reason, the sort() method cannot use a BasicDBObject, cannot discern it from a Map...
        def sortFields
        if(mongoJson.sort) {
            sortFields = mongoJson.sort.inject([:]) { map, entry->
                map[entry.key] = entry.value
                map
            }
        }

        DBCursor cursor = col.find(mongoJson.query ?: new BasicDBObject(), mongoJson.fields ?: new BasicDBObject()).
                limit(mongoJson?.max?.toInteger() ?: 30).
                skip(mongoJson?.offset?.toInteger() ?: 0).
                sort(sortFields) as DBCursor
        def results = cursor.inject([]) { coll, BasicDBObject entry ->
            def args = [:]
            for(key in entry.keySet()) {
                args[key] = marshallDocument(entry[key])
            }
            coll << args
            coll
        }

        def res = [results:results, totalCount:cursor.count()]
        render res as JSON
    }

    /**
     * Count the number of documents matching the query specified.
     *
     * Equivalent to a call to the mongo shell entry below :
     *      db.collection.count(<query>)
     *
     * Consumes a JSON document containing the keys listed for this action.
     *
     * @param dbname (Required) The name of the database on which this query should be ran
     * @param colname (Required) The name of the collection on which this query should be ran
     * @param query (Optional) A JSON portion representing the criterias of the query, if none is provided, return the total number of documents in the collection.
     *
     * @return
     */
    def count() {
        def rawJSON = request.reader.text
        def mongoJson = com.mongodb.util.JSON.parse(rawJSON)

        def db = mongo.getDB(mongoJson.dbname)
        def col = db.getCollection(mongoJson.colname)

        def res = [count:col.count(mongoJson.query ?: new BasicDBObject())]
        render res as JSON
    }

    // TODO
    def findAndModifiy() {

    }

    /**
     * Updates one or multiple existing document(s) matching specified criterias.
     *
     * Equivalent to a call to the mongo shell entry below :
     *      db.collection.update(<criteria>, <document>, <upsert>, <multi>)
     *
     * Consumes a JSON document containing the keys listed for this action.
     *
     * @param dbname (Required) The name of the database on which this query should be ran
     * @param colname (Required) The name of the collection on which this query should be ran
     * @param document (Required) A document that will replace / update the original(s) or queries for partial updates ("$set", "$addToSet", ...)
     * @param criteria (Optional) A JSON portion representing the criterias of the query which will determine the document to update.
     * If nothing is specified, will update ALL documents of the collection
     * @param upsert (Optional) If TRUE, the document will be created if it does not exist. Default to TRUE.
     * @param multi (Optional) If FALSE, the update query will only modify the first match of the query, even if there were multiple results.
     * Default to FALSE.
     *
     * @return
     */
    def update() {
        def rawJSON = request.reader.text
        def mongoJson = com.mongodb.util.JSON.parse(rawJSON)

        def db = mongo.getDB(mongoJson.dbname)
        def col = db.getCollection(mongoJson.colname)
        if(!mongoJson.document) {
            render status:404, text:[message:'Missing document'] as JSON
            return
        }

        col.update(mongoJson.criteria ?: new BasicDBObject(), mongoJson.document, mongoJson.upsert ?: false, mongoJson.multi ?: false)
        render status:200, text:[message:'Document updated'] as JSON
    }

    /**
     * Inserts a new document in the specified collection.
     *
     * Equivalent to a call to the mongo shell entry below :
     *      db.collection.insert(<document>)
     *
     * Consumes a JSON document containing the keys listed for this action.
     *
     * @param dbname (Required) The name of the database on which this query should be ran
     * @param colname (Required) The name of the collection on which this query should be ran
     * @param document (Required) The JSON document to insert
     *
     * @return
     */
    def insert() {
        def rawJSON = request.reader.text
        def mongoJson = com.mongodb.util.JSON.parse(rawJSON)

        def db = mongo.getDB(mongoJson.dbname)
        def col = db.getCollection(mongoJson.colname)

        if(!mongoJson.document) {
            render status:404, text:[message:'Missing document'] as JSON
            return
        }

        // Convert $numberLong
        mongoJson.document = convertTypeDocument(mongoJson.document)
        println mongoJson.document
        col.insert(mongoJson.document as BasicDBObject)
        render status:200, text:[message:'Document inserted'] as JSON
    }

    /**
     * Removes one or multiple document(s) matching a specified criteria.
     *
     * Equivalent to a call to the mongo shell entry below :
     *      db.collection.remove(<criteria>)
     *
     * Consumes a JSON document containing the keys listed for this action.
     * @param dbname (Required) The name of the database on which this query should be ran
     * @param colname (Required) The name of the collection on which this query should be ran
     * @param criteria (Optional) A criteria (as a JSON document) detemining which document(s) are to be removed. If none provided, will delete everything.
     *
     * TODO : add a watchdog : ask for an explicit confirmation if no criteria was provided
     *
     * @return
     */
    def remove() {
        def rawJSON = request.reader.text
        def mongoJson = com.mongodb.util.JSON.parse(rawJSON)

        def db = mongo.getDB(mongoJson.dbname)
        def col = db.getCollection(mongoJson.colname)

        col.remove(mongoJson.criteria ?: new BasicDBObject())
        render status:200, text:[message:'Document removed'] as JSON
    }

    /**
     * Performs an aggregation operation.
     *
     * Equivalent to a call to the mongo shell entry below :
     *      db.collection.aggregate(<operations>*)
     *
     * Consumes a JSON document containing the keys listed for this action.
     * @param dbname (Required) The name of the database on which this query should be ran
     * @param colname (Required) The name of the collection on which this query should be ran
     * @param pipeline (Required) An array of aggregate operations
     *
     * @return The command results
     */
    def aggregate() {
        def rawJSON = request.reader.text
        def mongoJson = com.mongodb.util.JSON.parse(rawJSON)

        def db = mongo.getDB(mongoJson.dbname)
        def col = db.getCollection(mongoJson.colname)

        // $limit & $skip must be integer
        for(instruction in mongoJson.pipeline) {
            def key = instruction.keySet().asList().first()
            if(key in ['$limit', '$skip']) {
                if(instruction[key] instanceof String) {
                    instruction[key] = instruction[key].toInteger()
                }
            }
        }

        def first = mongoJson.pipeline[0]
        def additionals = mongoJson.pipeline.size() > 1 ? mongoJson.pipeline[1..mongoJson.pipeline.size()-1] as Collection<BasicDBObject> : [] as Collection<BasicDBObject>

        def output = col.aggregate(first, additionals.toArray() as DBObject[])

        Collection results = output.commandResult?.result?.inject([]) { coll, BasicDBObject entry ->
            def args = [:]
            for(key in entry.keySet()) {
                args[key] = marshallDocument(entry[key])
            }
            coll << args
            coll
        }

        def totalCount = results.size()

        // The results may be very big
        // To prevent the client to hang out because of a big amount of documents, we arbritrary limit the number of results.
        if(results.size() > 30) {
            // Cache the result in the session if the number of documents is > than 30, this will allow the user to navigate in the results
            // in a paginated mode without having to re-execute the aggregate command and preventing his browser to hang because of a mass of
            // results to display
            log.info "Cached aggregate results in session"
            session.cachedQuery = [
                    type:"aggregate",
                    results:results,
                    totalCount: totalCount
            ]
            results = results[0..30]
        }

        render status:200, text:[results:results, totalCount: totalCount] as JSON
    }

    /**
     * Allows to query the session cache
     * TODO : add a consistent cache cleaning strategy
     *
     * Consumes a JSON document containing the keys listed for this action.
     * @param offset
     * @param max
     * @return
     */
    def mongodbConsoleCache() {
        if (session.cachedQuery && session.cachedQuery.results) {
            def cachedResults = session.cachedQuery.results
            def offset = request.JSON?.offset?.toInteger() ?: 0
            def max = request.JSON?.max?.toInteger() ?: 30
            def upperOffset = [(offset + max), cachedResults.size()-1].min()
            def totalCount = session.cachedQuery.totalCount ?: 0

            if (offset < cachedResults.size()){
                render([type: session.cachedQuery.type, results:session.cachedQuery.results[offset..upperOffset-1], totalCount: totalCount] as JSON)
            } else {
                // The offset and/or max value(s) are incorrects
                render ([type: session.cachedQuery.type, results:[], error:'Invalid offset', totalCount: totalCount] as JSON)
            }
        } else {
            render ([type: session.cachedQuery.type, results:[], empty:true] as JSON)
        }
    }

    /**
     * Run a command on the mongo instance.
     *
     * Equivalent to a call to the mongo shell entry below :
     *      db.runCommand(<command>)
     *
     * @param command (Required) The command to run. May be a JSON document or a String
     *
     * @return The result of the command
     */
    def runCommand() {
        def command = request.JSON.command

        if (command instanceof Map) {
            render mongo.getDB("admin").command(new BasicDBObject(command)) as JSON
        } else {
            render mongo.getDB("admin").command(command?.toString()) as JSON
        }
    }

    /**
     * Creates an index on a collection
     *
     * Equivalent to a call to the mongo shell entry below :
     *      db.collection.ensureIndex(<keys>, <options>)
     *
     * Consumes a JSON document containing the keys listed for this action.
     * @param dbname (Required) The name of the database on which this query should be ran
     * @param colname (Required) The name of the collection on which this query should be ran
     * @param keys (Required) A json document describing the keys on which the index will be built on
     * @param options (Optional) Additional options for this index (sparse, unique, ...)
     */
    def ensureIndex() {
        def rawJSON = request.reader.text
        def mongoJson = com.mongodb.util.JSON.parse(rawJSON)

        def db = mongo.getDB(mongoJson.dbname)
        def col = db.getCollection(mongoJson.colname)

        try {
            if (mongoJson.options && mongoJson.options instanceof DBObject) {
                col.ensureIndex(mongoJson.keys as DBObject, mongoJson.options as DBObject)
            } else {
                col.ensureIndex(mongoJson.keys as DBObject)
            }
        } catch(Throwable e) {
            render status: 500, text: ([error:e.message] as JSON)
            return
        }

        render status: 200
    }

    /**
     * Drops an index on a collection
     *
     * Equivalent to a call to the mongo shell entry below :
     *      db.collection.dropIndex(<keys>)
     *
     * Consumes a JSON document containing the keys listed for this action.
     * @param dbname (Required) The name of the database on which this query should be ran
     * @param colname (Required) The name of the collection on which this query should be ran
     * @param keys (Required) A json document describing the keys which identify the index
     */
    def dropIndex() {
        def rawJSON = request.reader.text
        def mongoJson = com.mongodb.util.JSON.parse(rawJSON)

        def db = mongo.getDB(mongoJson.dbname)
        def col = db.getCollection(mongoJson.colname)

        try {
            col.dropIndex(mongoJson.keys as DBObject)
        } catch(Throwable e) {
            render status: 500, text: ([error:e.message] as JSON)
            return
        }

        render status: 200
    }

    // TODO
    def reIndex() {

    }

    def dropIndexes() {

    }

    def getIndexes() {

    }


    /**
     * Marshall the document received from the Mongo driver into the JSON (almost)strict format.
     * Binary data are excluded from the result to prevent memory overload, only their filesize are returned
     * @param element
     * @return
     */
    private marshallDocument(element){
        def res
        switch(element) {
            // Bytes are too much for display, the actual data is not sent to the client, we just send the
            // total size of the blob
            case byte[]:
                res = [$data:[size:element.size()]]
                break
            // ObjectId are composed of multiple field, which are then serialized into a uuid
            // The client only need the uuid
            case org.bson.types.ObjectId:
                res = [$oid:element.toString()]
                break
            // Marshall any element of a Collection
            case com.mongodb.BasicDBList:
                def list = []
                for(e in element) {
                    list << marshallDocument(e)
                }
                res = list
                break
            case Long:
            case BigDecimal:
                // Warning : this is not a mongo syntax, just a workaround for the JS MongoJSON parser
                // which is not able to handle big number
                res = [$numberLong:element.toString()]
                break
            case Date:
                res = [$date:element.format("yyyy-MM-dd'T'HH:mm:ss'Z'")]
                break
            // DBRef are not resolve, we just show the collection name and the id of the entry
            // The client may ask for the specified entry afterward
            case com.mongodb.DBRef:
                com.mongodb.DBRef dbref = element
                res = [$ref:dbref.ref, $id:marshallDocument(dbref.id)]
                break
            // Embedded documents have their field marshalled individually
            case DBObject:
                def elem = [:]
                for (key in ((DBObject)element).keySet()) {
                    elem[key] = marshallDocument(element[key])
                }
                res = elem
                break
            default:
                res = element
                break
        }
        res
    }

    /**
     *
     * @param document
     */
    private convertTypeDocument(DBObject document) {
        def res = document
        for (key in document.keySet()) {
            switch (key) {
                case '$numberLong':
                    res = document[key].toLong()
                    break
            }
            if (document[key] instanceof DBObject) {
                document[key] = convertTypeDocument(document[key])
                res = document
            } else if(document[key] instanceof BasicDBList) {
                def elems = []
                for(doc in document[key]) {
                    elems << convertTypeDocument(doc)
                }
                document[key] = elems
                res = document
            }
        }
        res
    }
}
