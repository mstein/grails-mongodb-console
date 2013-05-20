function GridFSCtrl($scope, $routeParams, mongodb, gridfs, mongoContextHolder, $http, grails, $location) {
    $scope.init = function(selectedDB, selectedCol) {
        mongodb.listDatabases().success(function(data) {
            mongoContextHolder.databases = data.databases;
            mongoContextHolder.totalSize = data.totalSize;
            if(selectedDB && selectedCol) {
                $location.path('/gridfs/'+selectedDB+'/'+selectedCol);
            } else if(selectedDB){
                $location.path('/gridfs/'+selectedDB);
            }
            $scope.$broadcast("DatabasesListLoadedEvent");
        });
    };

    $scope.buckets = function() {
        return mongoContextHolder.buckets();
    };

    $scope.collections = function() {
        return mongoContextHolder.collections;
    };

    $scope.files = function() {
        return gridfs.listFile(mongoContextHolder.currentDB, mongoContextHolder);
    };

    $scope.currentBucket = function() {
        return mongoContextHolder.currentCollection;
    };
}
