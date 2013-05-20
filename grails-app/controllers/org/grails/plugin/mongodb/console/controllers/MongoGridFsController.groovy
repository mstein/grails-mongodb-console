package org.grails.plugin.mongodb.console.controllers

import com.gmongo.GMongo
import com.mongodb.BasicDBObject
import grails.converters.JSON

class MongoGridFsController {
    GMongo mongo
    def mongoFileStoreService

    def tplDatabase() {
        render template: '/gridfs/databases', model: [databases:mongo.mongo.getDatabaseNames()]
    }

    def tplBuckets() {
        render template: '/gridfs/buckets', model: [databases:mongo.mongo.getDatabaseNames()]
    }

    def tplFiles() {
        render template: '/gridfs/listFiles', model: [databases:mongo.mongo.getDatabaseNames()]
    }

    def list() {
        String dbname = request.JSON.dbname
        String colname = request.JSON.colname

        def cursor = mongoFileStoreService.fileList(dbname, colname)
        if(request.JSON.offset) {
            cursor.skip(request.JSON.offset)
        }
        if(request.JSON.max) {
            cursor.limit(request.JSON.max)
        }
        if(request.JSON.sort) {
            cursor.sort(new BasicDBObject(request.JSON.sort))
        }
        cursor.toArray() as JSON
    }
}
