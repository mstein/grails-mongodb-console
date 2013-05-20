MongoDBConsoleModule.factory('gridfs', ['$http', 'grails', 'mongodb', function($http, grails, mongodb) {

    MongodbGridFs.$http = $http;
    MongodbGridFs.grails = grails;
    return MongodbGridFs;
}]);

/*MongodbGridFs.prototype = {

};*/

function MongodbGridFs(db, bucket) {
    this.$db = db;
    this.$bucket = bucket;

    MongodbGridFs.prototype.listFiles = function(db, bucket) {
        var url = this.grails.createLink({controller:'mongodbGridFs', action:'listFiles'});
        return this.$http.post(url, MongoJSON.stringify({dbname:db, bucket:bucket}));
    }
}