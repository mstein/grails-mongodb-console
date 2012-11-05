MongoDBViewerModule.factory('mongodb', ['$http', function($http) {
    MongoDBService.$http = $http;
    MongoDBService.fn.$http = $http;
    MongoCollection.prototype.$http = $http;
    MongoDBQuery.prototype.$http = $http;
    return MongoDBService;
}]);

function MongoDBService(dbname) {
    return MongoDBService.fn.use(dbname);
}

MongoDBService.fn = MongoDBService.prototype = {
    constructor:MongoDBService,
    use:function(dbname) {
        MongoDBService.$db = dbname;
        var promise = this.$http.get('mviewer/listCollections?dbname='+dbname);
        var $self = this;
        var db = dbname;
        promise.success(function(data) {
            $.each(data, function(index, value) {
                $self[value] = new MongoCollection($self, db, value);
            });
        });

        return promise;
    },
    listDatabases:function() {
        return this.$http.get('mviewer/listDb');
    },
    dropDatabase:function() {
        if(MongoDBService.$db != undefined && MongoDBService.$db != null) {
            return this.$http.post('mviewer/dropDb', {dbname:MongoDBService.$db}).success(function(data) {
                MongoDBService.$db = null;
            })
        } else {
            alert('No database selected');
        }
    },
    createDatabase:function(dbname) {
        return this.$http.post('mviewer/createDb', {dbname:dbname}).success(function() {
            MongoDBService.$db = dbname;
        });
    },
    createCollection:function(colname) {
        if(MongoDBService.$db != undefined && MongoDBService.$db != null) {
            var $self=this;
            return this.$http.post('mviewer/createCollection', {dbname:MongoDBService.$db, newColname:colname}).success(function(data) {
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
    MongoCollection.prototype.remove = function(query) {

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
        return this.$http.post('mviewer/updateDocument', MongoJSON.stringify(data));
    };
    MongoCollection.prototype.renameCollection=function(newColname) {
        var $self = this;
        return this.$http.post('mviewer/renameCollection', {dbname:this._db, colname:this._name, newColname:newColname}).success(function(){
            $self._mongodbService[$self._name] = undefined;
            $self._name = newColname;
            $self._mongodbService[newColname] = $self;
        });
    };
    MongoCollection.prototype.dropCollection = function() {
        var $self = this;
        return this.$http.post('mviewer/dropCollection', {dbname:this._db, colname:this._name}).success(function(){
            $self._mongodbService[$self._name] = undefined;
            delete this;
        });
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
        if(this._skip > 0) {
            args['offset'] = this._skip;
        }
        if(this._limit > 0) {
            args['max'] = this._limit;
        }
        if(this._sort != null) {
            args['sort'] = this._sort;
        }
        this.$http.get('mviewer/listDocuments?'+$.param(args), {transformResponse:parseMongoJson}).success(function(data) {
            successCallback(data);
        }).error(function(data){ errorCallback(data); });
    };
}