MongoDBConsoleModule.factory('mongodb', ['$http', 'grails', function($http, grails) {
    MongoDBService.$http = $http;
    MongoDBService.grails = grails;
    MongoDBService.fn.$http = $http;
    MongoDBService.fn.grails = grails;
    MongoCollection.prototype.$http = $http;
    MongoCollection.prototype.grails = grails;
    MongoDBQuery.prototype.$http = $http;
    MongoDBQuery.prototype.grails = grails;
    return MongoDBService;
}]);

function MongoDBService(dbname, noData) {
    return MongoDBService.fn.use(dbname, noData);
}

MongoDBService.fn = MongoDBService.prototype = {
    constructor:MongoDBService,
    /**
     * Set the current DB context and get the list of the collection of the db, unless noData is defined to TRUE.
     *
     * @param dbname The name of the database to use
     * @param noData If set to TRUE, then the function will not send a listCollection command to the server. It will also return NULL.
     * This is useful if you don't want to pull some data, for operation like a drop database
     * @return {*}
     */
    use:function(dbname, noData) {
        noData = noData != undefined && noData != null ? noData : false;
        MongoDBService.$db = dbname;
        if(!noData) {
            var promise = this.$http.get(this.grails.createLink({controller:'mviewer', action:'listCollections', params:{dbname:dbname}}));
            var $self = this;
            var db = dbname;
            promise.success(function(data) {
                $.each(data, function(index, value) {
                    $self[value] = new MongoCollection($self, db, value);
                });
            });

            return promise;
        }
        return null;
    },
    listDatabases:function() {
        return this.$http.get(this.grails.createLink({controller:'mviewer', action:'listDb'}));
    },
    dropDatabase:function() {
        if(MongoDBService.$db != undefined && MongoDBService.$db != null) {
            var url = this.grails.createLink({controller:'mviewer', action:'dropDb'});
            return this.$http.post(url, {dbname:MongoDBService.$db}).success(function(data) {
                MongoDBService.$db = null;
            })
        } else {
            alert('No database selected');
        }
    },
    createDatabase:function(dbname) {
        var url = this.grails.createLink({controller:'mviewer', action:'createDb'});
        return this.$http.post(url, {dbname:dbname}).success(function() {
            MongoDBService.$db = dbname;
        });
    },
    createCollection:function(colname) {
        // TODO Capped collection == support config
        if(MongoDBService.$db != undefined && MongoDBService.$db != null) {
            var $self=this;
            var url = this.grails.createLink({controller:'mviewer', action:'createCollection'});
            return this.$http.post(url, {dbname:MongoDBService.$db, newColname:colname}).success(function(data) {
                $self[colname] = new MongoCollection($self, MongoDBService.$db, colname);
            });
        } else {
            alert('No database selected');
        }
    },

    copyDatabase:function (newName) {

    },
    serverStatus:function() {

    },
    stats:function() {

    }
};
MongoDBService.fn.use.prototype = MongoDBService.fn;

$.extend (MongoDBService, MongoDBService.fn);

function MongoCollection(mongodbService, db, name, sizeOnDisk) {
    this._mongodbService = mongodbService;
    this._size = sizeOnDisk;
    this._name = name;
    this._db = db;

    MongoCollection.prototype.find = function(query, fields) {
        return new MongoDBQuery(this._db, this._name, query, fields);
    };
    MongoCollection.prototype.findOne = function(query, fields) {
        return this.find(query, fields).limit(1);
    };
    MongoCollection.prototype.remove = function(criteria) {
        var data = {dbname:this._db, colname:this._name, criteria:criteria};
        var url = this.grails.createLink({controller:'mviewer', action:'remove'});
        return this.$http.post(url, MongoJSON.stringify(data));
    };
    MongoCollection.prototype.insert = function(document) {
        var data = {dbname:this._db, colname:this._name, document:document};
        var url = this.grails.createLink({controller:'mviewer', action:'insert'});
        return this.$http.post(url, MongoJSON.stringify(data));
    };

    MongoCollection.prototype.update = function(criteria, document, upsert, multi) {
        var data = {dbname:this._db, colname:this._name};
        if(document != undefined && document != null) {
            data.document = document;
        } else {
            // No document ? return null
            return null;
        }
        if(criteria != undefined && criteria != null) {
            data.criteria = criteria;
        }
        if(upsert != undefined && upsert != null) {
            data.upsert = upsert;
        }
        if(multi != undefined && multi != null) {
            data.multi = multi;
        }
        // cannot edit a id field
        if(document._id != null && document != undefined) {
            delete document._id;
        }
        var url = this.grails.createLink({controller:'mviewer', action:'update'});
        return this.$http.post(url, MongoJSON.stringify(data));
    };
    MongoCollection.prototype.renameCollection=function(newColname) {
        var $self = this;
        var url = this.grails.createLink({controller:'mviewer', action:'renameCollection'});
        return this.$http.post(url, {dbname:this._db, colname:this._name, newColname:newColname}).success(function(){
            $self._mongodbService[$self._name] = undefined;
            $self._name = newColname;
            $self._mongodbService[newColname] = $self;
        });
    };
    MongoCollection.prototype.dropCollection = function() {
        var $self = this;
        var url = this.grails.createLink({controller:'mviewer', action:'dropCollection'});
        return this.$http.post(url, {dbname:this._db, colname:this._name}).success(function(){
            $self._mongodbService[$self._name] = undefined;
            delete this;
        });
    };

    MongoCollection.prototype.aggregate = function(pipeline) {
        var url = this.grails.createLink({controller:'mviewer', action:'aggregate'});
        return this.$http.post(url, MongoJSON.stringify({dbname:this._db, colname:this._name, pipeline:pipeline}), {transformResponse:parseMongoJson});
    };
}

function MongoDBQuery(db, collection, query, fields) {
    this._db = db;
    this._collection = collection;
    this._query = query;
    this._fields = fields;
    this._sort = null;
    this._skip = 0;
    this._limit = 0; // 0 = no limit

    MongoDBQuery.prototype.sort = function(fields) {
        this._sort = fields;
        return this;
    };

    MongoDBQuery.prototype.skip = function(n) {
        if(n != null && n != undefined) {
            this._skip = n;
        }
        return this;
    };

    MongoDBQuery.prototype.limit = function(n) {
        if(n != null && n != undefined) {
            this._limit = n;
        }
        return this;
    };

    MongoDBQuery.prototype.exec = function(successCallback, errorCallback) {
        var args = {
            dbname:this._db,
            colname:this._collection
        };
        if(this._query != null) {
            args['query'] = this._query;
        }
        if(this._skip > 0) {
            args['offset'] = this._skip;
        }
        if(this._limit > 0) {
            args['max'] = this._limit;
        }
        if(this._sort != null) {
            args['sort'] = this._sort;
        }
        if(this._fields != null) {
            args['fields'] = this._fields;
        }
        var url = this.grails.createLink({controller:'mviewer', action:'find'});
        this.$http.post(url, MongoJSON.stringify(args), {transformResponse:parseMongoJson}).success(function(data) {
            successCallback(data);
        }).error(function(data){ errorCallback(data); });
    };

    MongoDBQuery.prototype.count = function(successCallback, errorCallback) {
        var args = {
            dbname:this._db,
            colname:this._collection
        };
        if(this._query != null) {
            args['query'] = this._query;
        }
        var url = this.grails.createLink({controller:'mviewer', action:'count'});
        this.$http.post(url, MongoJSON.stringify(args)).success(function(data) {
            successCallback(data);
        }).error(function(data){ errorCallback(data); });
    };
}

function parseMongoJson(data, headerGetter) {
    return MongoJSON.parseTengen(data);
}