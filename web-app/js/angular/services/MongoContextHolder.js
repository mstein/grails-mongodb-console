MongoDBConsoleModule.factory('mongoContextHolder', ['grails', function(grails) {
    var mongoContextHolderDefinition = {
        currentDB:null,
        currentDBSize:0,
        currentCollection:0,
        databases:{},
        totalSize:0,
        collections:[],
        resultSet:{
            type:'document', // The type of the returned document : document, json
            elements:[],     // The elements (actual query results)
            totalCount: 0,   // The total number of elements, without the limit (so totalCount may be > than the elements.length
            query:{type:"unknown"}         // The query that was performed
        },

        buckets:function() {
            // TODO : cache or something
            var filesMatches = [];
            var chunksMatches = [];
            var buckets = [];
            var patternFile = /(.+)\.files$/i;
            var patternChunk = /(.+)\.chunks$/i;

            $.each(this.collections, function(index, col){
                if(col.match(patternFile)) {
                    filesMatches.push(patternFile.exec(col)[1]);
                }
                if(col.match(patternChunk)) {
                    chunksMatches.push(patternChunk.exec(col)[1]);
                }
            });

            // intersect filesMatches & chuncksMatches
            $.each(chunksMatches, function(index, truncatedName) {
                if($.inArray(truncatedName, filesMatches) != -1) {
                    buckets.push(truncatedName);
                }
            });
            return buckets;
        },
        dbSelectable:function() {
            var size = 0;
            for(var key in this.databases) {
                if (this.databases.hasOwnProperty(key)) {
                    size++;
                    break;// getting one is enough to consider the object not empty
                }
            }
            return size > 0;
        },

        collectionSelectable:function() {
            return this.collections.length > 0;
        },

        populateDocuments:function(data, query, type) {
            type = type != undefined && type != null ? type : "document";
            query = query != undefined && query != null ? query : {"type":"unknown"};

            // Special case for indexes
            if((query.type == "find" || query.type == "findOne") && query.object._collection == "system.indexes") {
                type = "index";
            }

            this.resultSet.type = type;
            this.resultSet.query = query;
            if(data.results != null) {
                this.resultSet.elements = data.results;
            } else {
                if(data != null) {
                    this.resultSet.elements = data;
                } else {
                    this.resultSet.elements = [];
                }
            }

            if(data.totalCount != null) {
                this.resultSet.totalCount = data.totalCount;
            } else {
                this.resultSet.totalCount = this.resultSet.elements.length;
            }
        }
    };
    return mongoContextHolderDefinition;
}]);