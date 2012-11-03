import com.gmongo.GMongo

class MongoViewerService {
    GMongo mongo

    Collection<String> listDB() {
        mongo.mongo.getDatabaseNames()
    }

    Collection<String> listCollections(String dbname) {
        mongo.mongo.getDB(dbname)?.collectionNames
    }
}
