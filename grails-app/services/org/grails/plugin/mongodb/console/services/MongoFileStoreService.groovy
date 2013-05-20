package org.grails.plugin.mongodb.console.services

import com.gmongo.GMongo
import com.mongodb.DB
import com.mongodb.DBCollection
import com.mongodb.DBCursor
import com.mongodb.WriteConcern
import com.mongodb.gridfs.GridFS

import java.util.concurrent.ConcurrentHashMap

class MongoFileStoreService {
    static transactional = false
    def grailsApplication
    GMongo mongo

    private _gridfs = new ConcurrentHashMap<String, GridFS>()

    /**
     * Returns the DBCollection instances corresponding to the GridFS bucket specified.
     *
     * @param bucket The name of the bucket
     * @return A Map containing 2 entries :
     * - files : the DBCollection corresponding to the file metadata collection of the bucket
     * - chunks : the DBCollection corresponding to the file binary chunks collection of the bucket
     */
    Map<String, DBCollection> getCollections(String dbname, String bucket) {
        def gfs = getGridfs(dbname, bucket)
        [files:gfs.getDB().getCollection("${bucket}.files"), chunks:gfs.getDB().getCollection("${bucket}.chunks")]
    }

    private getGridfs(String dbname, String bucket) {
        if(!mongo) {
            if(grailsApplication.config.mongodb?.host) {
                String host = grailsApplication.config.mongodb?.host
                Integer port = 27017
                if (grailsApplication.config.mongodb?.port) {
                    try {
                        port = grailsApplication.config.mongodb?.port?.toInteger() ?: 27017
                    } catch (Throwable e) {
                        log.error "Mongodb port provided was not valid, fallback to default port 27017 will be used."
                        port = 27017
                    }
                }

                mongo = new GMongo(host, port)
            } else {
                mongo = new GMongo()
            }
        }

        def gridfs = _gridfs[bucket]
        if (!gridfs) {
            //def dbname = grailsApplication.config.mongodb?.database ?: grailsApplication.metadata['app.name']
            //dbname = dbname ? dbname + 'files' : 'files' // use db '<DBNAME>files' for files
            DB db = mongo.mongo.getDB(dbname)

            db.writeConcern = WriteConcern.SAFE
            gridfs = new GridFS(db, bucket)
            _gridfs[bucket] = gridfs

        }

        gridfs
    }

    /**
     *
     * @param dbname
     * @param bucket
     * @return
     */
    DBCursor fileList(String dbname, String bucket) {
        GridFS gridFs = getGridfs(dbname, bucket)
        return gridFs.fileList
    }
}
