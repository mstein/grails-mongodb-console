MongoDBConsoleModule.factory('mongoContextHolder', ['grails', function(grails) {
    var mongoContextHolderDefinition = {
        currentDB:null,
        currentDBSize:0,
        currentCollection:0,
        databases:{},
        totalSize:0,
        collections:[],
        resultSet:{type:'document', elements:[], totalCount: 0},

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

        populateDocuments:function(data) {
            this.resultSet.type = "document";
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