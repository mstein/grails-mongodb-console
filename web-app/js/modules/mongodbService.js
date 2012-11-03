MongoDBViewerModule.factory('mongodb', ['$http', function($http) {
    MongoDBService.$http = $http;
    MongoDBService.fn.$http = $http;
    return MongoDBService;
}]);

function MongoDBService(dbname) {
    return MongoDBService.fn.use(dbname);
}

MongoDBService.fn = MongoDBService.prototype = {
    constructor:MongoDBService,
    use:function(dbname) {
        this.db = dbname;
        var promise = this.$http.get('mviewer/listCollections?dbname='+dbname);
        var $self = this;

        promise.success(function(data) {
            $.each(data, function(entry) {
                $self[entry] = new MongoCollection(entry);
            });
        });

        return promise;
    },
    listDatabases:function() {
        return this.$http.get('mviewer/listDb');
    },
    cloneDatabase:function (newName) {

    },
    dropDatabase:function() {

    },
    serverStatus:function() {

    },
    stats:function() {

    }
};
MongoDBService.fn.use.prototype = MongoDBService.fn;

$.extend (MongoDBService, MongoDBService.fn);

function MongoCollection(name, sizeOnDisk) {
    this._size = sizeOnDisk;
    this._name = name;

    MongoCollection.prototype.find = function(query, fields) {
        return new MongoDBQuery(this._name, query, fields);
    };
    MongoCollection.prototype.findOne = function(query, fields) {
        return this.find(query, fields).limit(1);
    };
    MongoCollection.prototype.remove = function(query) {

    };
    MongoCollection.prototype.update = function(criteria, query, upsert, multi) {

    };
    MongoCollection.prototype.dropCollection = function() {

    };
}

function MongoDBQuery(db, collection, query, fields) {
    this._db = db;
    this._collection = collection;
    this._query = query;
    this._fields = fields;
    this._sort = {};
    this._skip = 0;
    this._limit = 0; // 0 = no limit

    MongoDBQuery.prototype.sort = function(fields) {
        this._sort = fields;
        return this;
    };

    MongoDBQuery.prototype.skip = function(n) {
        this._skip = n;
        return this;
    };

    MongoDBQuery.prototype.limit = function(n) {
        this._limit = n;
        return this;
    };

    MongoDBQuery.prototype.exec = function(successCallback, errorCallback) {
        var args = {
            dbname:this._db,
            colname:this._collection
        };
        $http.get('mviewer/listDocuments?'+$.param(args), {transformResponse:parseMongoJson}).success(function(data) {
            successCallback(data);
            //$scope.populateDocuments(data);
        }).error(function(data){ errorCallback(data); });
    };
}