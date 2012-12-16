function DBListCtrl($scope, $timeout, mongodb, $routeParams, $location, mongoContextHolder) {
    $scope.creatingDB = false;
    $scope.copyingDB = false;
    $scope.renamingCol = false;
    $scope.creatingCol = false;
    $scope.creatingDoc = false;
    $scope.newDbname = null;
    $scope.newColname = null;
    $scope.renColName = null;

    $scope.currentDB = function() {
        return mongoContextHolder.currentDB;
    };
    $scope.currentDBSize = function() {
        return mongoContextHolder.currentDBSize;
    };
    $scope.currentCollection = function() {
        return mongoContextHolder.currentCollection;
    };
    $scope.databases = function() {
        return mongoContextHolder.databases;
    };
    $scope.collections = function() {
        return mongoContextHolder.collections;
    };
    $scope.totalSize = function() {
        return mongoContextHolder.totalSize;
    };
    $scope.resultSet = function() {
        return mongoContextHolder.resultSet;
    };
    $scope.totalCount = function() {
        return mongoContextHolder.resultSet.totalCount;
    };

    $scope.init = function(selectedDB, selectedCol) {
        mongodb.listDatabases().success(function(data) {
            mongoContextHolder.databases = data.databases;
            mongoContextHolder.totalSize = data.totalSize;
            console.log(mongoContextHolder.databases);
            if(selectedDB && selectedCol) {
                $location.path('/mongo/'+selectedDB+'/'+selectedCol);
            } else if(selectedDB){
                $location.path('/mongo/'+selectedDB);
            }
            $scope.$broadcast("DatabasesListLoadedEvent");
        });
    };

    $scope.$watch(function() { return $routeParams.db; }, function(value) {
        if(mongoContextHolder.dbSelectable()) {
            $scope.selectdb(value);
        }
    });

    $scope.changePath = function (path) {
        $location.path(path);
    };

    $scope.homepage = function() {
        $scope.cancel();
        mongoContextHolder.currentDB = null;
        mongoContextHolder.currentCollection = null;
        mongoContextHolder.collections = [];
        mongoContextHolder.resultSet.elements = [];
    };

    $scope.focus = function(inputId) {
        $timeout(function() {
            $('input#'+inputId).attr('tabindex', -1).focus();
        }, 10);
    };

    $scope.selectdb = function(dbname) {
        $scope.cancel();
        mongoContextHolder.currentDB = dbname;
        mongoContextHolder.currentDBSize = mongoContextHolder.databases[dbname].sizeOnDisk;
        mongoContextHolder.currentCollection = null;
        mongoContextHolder.resultSet.elements = [];
        mongoContextHolder.populateDocuments([]);

        return mongodb.use(dbname).success(function(data) {
            mongoContextHolder.collections = data;
            $scope.$broadcast('DatabaseLoadedEvent');
        });
    };

    $scope.createDB = function() {
        $scope.cancel();
        $scope.creatingDB = true;
        $("#createDB").modal({show: true});
        $scope.focus("inputName");
    };

    $scope.copyDB = function() {
        $scope.cancel();
        $("#copyDB").modal({show: true});
        $scope.copyingDB = true;
        $scope.focus("inputCopy");
    };

    $scope.renameCol = function(inputId) {
        $scope.cancel();
        $scope.renamingCol = true;
        $scope.focus(inputId);
    };

    $scope.createCol = function(inputId) {
        $scope.cancel();
        $scope.creatingCol = true;
        $("#createCol").modal({
            show: true
        });
        $timeout(function() {
            $scope.focus(inputId);
        }, 500);
    };

    $scope.createDoc = function() {
        $scope.cancel();
        $scope.creatingDoc = true;
        $("#createDoc").modal({show: true});
        $scope.setEditable("new-doc", true);
        $scope.focus("#new-doc");
    };

    $scope.validateDBCreation = function() {
        var newDbname = $scope.newDbname;

        mongodb.createDatabase(newDbname)
            .success(function(data) {
                mongoContextHolder.currentDB = newDbname;
                mongoContextHolder.currentCollection = null;
                $scope.cancel();
                mongoContextHolder.databases = data.databases;
                mongoContextHolder.populateDocuments([]);
                mongodb($scope.currentDB).success(function(data) {
                    mongoContextHolder.collections = data;
                });
            });
    };

    $scope.validateColnameChange = function() {
        var newColname = $scope.renColName;
        mongodb[$scope.currentCollection].renameCollection(newColname)
            .success(function() {
                mongoContextHolder.currentCollection = newColname;
                $scope.cancel();

                mongodb($scope.currentDB).success(function(data) {
                    mongoContextHolder.collections = data;
                });
            });
    };

    $scope.validateCreateCollection = function() {
        var newColname = $scope.newColname;
        mongodb.createCollection(newColname)
            .success(function() {
                mongoContextHolder.currentCollection = newColname;
                $scope.cancel();
                mongodb($scope.currentDB).success(function(data) {
                    mongoContextHolder.collections = data;
                });
            }).error(function(data){
                alert(data);
            });
    };

    $scope.dropCol = function() {
        bootbox.confirm("This action cannot be undone. Drop the collection '" + $scope.currentCollection + "' from the db '"+$scope.currentDB + "'?", function(confirm){
            if (confirm) {
                mongodb[$scope.currentCollection].dropCollection()
                    .success(function() {
                        mongoContextHolder.currentCollection = null;
                        $scope.cancel();
                        mongodb($scope.currentDB).success(function(data) {
                            mongoContextHolder.collections = data;
                    });
                });
            }

        });
    };

    $scope.dropDB = function() {
        bootbox.confirm("This action cannot be undone. Drop the database '"+$scope.currentDB + "'?", function(confirm){
            if (confirm) {
                mongodb.dropDatabase()
                    .success(function(data) {
                        mongoContextHolder.currentDB = null;
                        mongoContextHolder.currentCollection = null;
                        mongoContextHolder.currentDBSize = 0;
                        $scope.cancel();
                        mongoContextHolder.databases = data.databases;
                        mongoContextHolder.collections = [];
                        mongoContextHolder.populateDocuments([]);
                    });
            }

        });
    };

    $scope.cancel = function() {
        $scope.creatingDB = false;
        $scope.copyingDB = false;
        $scope.creatingDoc = false;
        $scope.renamingCol = false;
        $scope.creatingCol = false;
        $scope.renColName = $scope.currentCollection;
        $scope.newColname = null;
        $scope.newDbname = null;
        $('.modal').modal('hide');
    };
}
