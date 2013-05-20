function DBListCtrl($scope, $timeout, mongodb, $routeParams, $location, mongoContextHolder) {
    $scope.creatingDB = false;
    $scope.copyingDB = false;
    $scope.renamingCol = false;
    $scope.renamingACol = false;
    $scope.creatingCol = false;
    $scope.creatingDoc = false;
    $scope.newDbname = null;
    $scope.newColname = null;
    $scope.renColName = null;
    $scope.serverInfo = null;

    $scope.selectedCol = {};
    $scope.countColSelected = 0;

    $scope.selectedDB = {};
    $scope.countDBSelected = 0;

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
            if(selectedDB && selectedCol) {
                $location.path('/mongo/'+selectedDB+'/'+selectedCol);
            } else if(selectedDB){
                $location.path('/mongo/'+selectedDB);
            }
            $scope.$broadcast("DatabasesListLoadedEvent");
        });
    };

    /**
     * Ask for serverStatus and buildInfo
     */
    $scope.serverInfo = function() {
        $scope.serverInfo = {};

        mongodb.buildInfo().success(function(data){
            $.extend ($scope.serverInfo, data);
        });
        mongodb.serverStatus().success(function(data){
            $.extend ($scope.serverInfo, data);
        });
        mongodb.isMaster().success(function(data){
            $.extend ($scope.serverInfo, data);
        });
    };

    $scope.$watch('selectedCol', function () {
        var count = 0;
        angular.forEach($scope.selectedCol, function (value, field) {
            if (value) count++;
        });
        $scope.countColSelected = count;
    }, true);

    $scope.dropCols = function() {
        if ($scope.countColSelected > 0) {
            bootbox.confirm("This action cannot be undone. Are you sure you want to drop the " + $scope.countColSelected + " selected collection(s) from the db '"+mongoContextHolder.currentDB + "'?", function(confirm){
                if (confirm) {
                    var allCol = [];
                    for(var col in $scope.selectedCol) {
                        allCol.push(col);
                    }
                    //mongodb.use(mongoContextHolder.currentDB);
                    mongodb.dropCollections(allCol).success(function() {
                        mongoContextHolder.currentCollection = null;
                        mongoContextHolder.resultSet.elements = [];

                        $location.path('/mongo/' + mongoContextHolder.currentDB);
                        $scope.cancel();
                        $scope.selectedCol = {};
                        mongodb(mongoContextHolder.currentDB).success(function(data) {
                            mongoContextHolder.collections = data;
                            $().toastmessage('showSuccessToast', 'Collections \'' + allCol + '\' dropped');
                        }).error(function(){
                            $().toastmessage('showErrorToast', 'Drop collections \'' + allCol + '\' failed');
                        });
                    }).error(function(){
                        $().toastmessage('showErrorToast', 'Drop collections \'' + allCol + '\' failed');
                    });
                }
            });
        }
    };

    $scope.$watch('selectedDB', function () {
        var count = 0;
        angular.forEach($scope.selectedDB, function (value, field) {
            if (value) count++;
        });
        $scope.countDBSelected = count;
    }, true);

    $scope.dropDatabases = function() {
        if ($scope.countDBSelected > 0) {
            bootbox.confirm("Drop " + $scope.countDBSelected + " database(s) ?", function(confirm){
                if (confirm) {
                    alert("TODO");
                }
            });
        }
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
        mongoContextHolder.currentCollection = null;
        mongoContextHolder.resultSet.elements = [];
        mongoContextHolder.populateDocuments([]);
        if(dbname != undefined && dbname != null && dbname != '') {
            mongoContextHolder.currentDBSize = mongoContextHolder.databases[dbname].sizeOnDisk;
        } else {
            mongoContextHolder.currentDBSize = 0;
            return;
        }

        return mongodb.use(dbname).success(function(data) {
            mongoContextHolder.collections = data;
            $scope.$broadcast('DatabaseLoadedEvent');
        });
    };

    /**
     * Select a collection as tag it as "current"
     * Also perform a find (without criteria) but with limited number of results.
     *
     * @param colname
     * @param params
     */
    $scope.selectCollection = function(colname, params) {
        $scope.cancel();
        mongoContextHolder.currentCollection = colname;
        $scope.renColName = colname;
        var args = {};
        var offset = params != undefined ?params.offset : null;
        var max = params != undefined ? params.max : null;
        var query = mongodb[colname].find().skip(offset).limit(max);
        query.exec(function(data) {
            mongoContextHolder.populateDocuments(data, {type:"find", object:query});
        }, function(data){alert(data);});
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

    $scope.renameACol = function(col) {
        $scope.cancel();
        $scope.renamingACol = col;
        $("#renameACol").modal({ show: true });
        $timeout(function() { $scope.focus("rename-a-col"); }, 500);
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

    $scope.importData = function(inputId) {
        $scope.cancel();
        $("#importData").modal({
            show: true
        });
        $timeout(function() {
            $scope.focus(inputId);
        }, 500);
    };

    $scope.$on('fileuploaddone', function(e, data){
        data.scope.cancel();
        $scope.selectdb(mongoContextHolder.currentDB);
    });

    $scope.validateDBCreation = function() {
        var newDbname = $scope.newDbname;

        mongodb.createDatabase(newDbname)
            .success(function(data) {
                mongoContextHolder.currentDB = newDbname;
                mongoContextHolder.currentCollection = null;
                $scope.cancel();
                $location.path('/mongo/' + newDbname);
                mongoContextHolder.databases = data.databases;
                mongoContextHolder.populateDocuments([]);
                $().toastmessage('showSuccessToast', 'Database \'' + newDbname + '\' created');
            }).error(function(){
                $().toastmessage('showErrorToast', 'Create database \'' + newDbname + '\' failed');
            });
    };

    function renameCollection(collection, renColName) {
        var newColname = renColName;
        var oldColname = mongodb[collection]._name;
        var current = false;
        if (mongoContextHolder.currentCollection)
            current = true;
        mongodb[collection].renameCollection(newColname)
            .success(function() {
                if (current)
                    mongoContextHolder.currentCollection = newColname;
                $scope.cancel();
                $scope.selectdb(mongoContextHolder.currentDB);
                if (current)
                    $location.path('/mongo/'+ mongoContextHolder.currentDB + '/'+ newColname);
                $().toastmessage('showSuccessToast', 'Collection \'' +  oldColname + '\' rename to \'' + newColname + '\'');
            }).error(function() {
                $().toastmessage('showErrorToast', 'Collection \'' + oldColname + '\' rename to \'' + newColname + '\' failed');
            });
    }

    $scope.validateColnameChange = function(renColName) {
        renameCollection(mongoContextHolder.currentCollection, renColName);
    };

    $scope.validateAColnameChange = function(newColname) {
        renameCollection($scope.renamingACol, newColname);
    };

    $scope.validateCreateCollection = function() {
        var newColname = $scope.newColname;
        mongodb.createCollection(newColname)
            .success(function() {
                mongoContextHolder.currentCollection = newColname;
                $scope.cancel();
                $scope.selectdb(mongoContextHolder.currentDB);
                $().toastmessage('showSuccessToast', 'Collection \'' + newColname + '\' created ');
            }).error(function(data){
                alert(data);
                $().toastmessage('showErrorToast', 'Create collection \'' + newColname + '\' failed');
            });
    };

    $scope.dropCol = function(col) {
        var colname = mongoContextHolder.currentCollection;
        if(col != undefined && col != null){
            colname = col;
        }
        bootbox.confirm("This action cannot be undone. Drop the collection '" + colname + "' from the db '"+mongoContextHolder.currentDB + "'?", function(confirm){
            if (confirm) {
                mongodb[colname].dropCollection().success(function() {
                    mongoContextHolder.currentCollection = null;
                    mongoContextHolder.resultSet.elements = [];
                    $location.path('/mongo/' + mongoContextHolder.currentDB);
                    $scope.cancel();
                    mongodb(mongoContextHolder.currentDB).success(function(data) {
                        mongoContextHolder.collections = data;
                        $().toastmessage('showSuccessToast', 'Database \'' + colname + '\' dropped');
                    }).error(function(){
                        $().toastmessage('showErrorToast', 'Drop database \'' + colname + '\' failed');
                    });
                }).error(function(){
                    $().toastmessage('showErrorToast', 'Drop database \'' + colname + '\' failed');
                });
            }
        });
    };

    $scope.dropDB = function(db) {
        var dbname = mongoContextHolder.currentDB;
        if(db != undefined && db != null) {
            dbname = db;
        }
        bootbox.confirm("This action cannot be undone. Drop the database '"+ dbname + "'?", function(confirm){
            if (confirm) {
                mongodb.use(dbname, true);
                mongodb.dropDatabase()
                    .success(function(data) {
                        mongoContextHolder.currentDB = null;
                        mongoContextHolder.currentCollection = null;
                        mongoContextHolder.currentDBSize = 0;
                        $scope.cancel();
                        $location.path('/mongo');
                        mongoContextHolder.databases = data.databases;
                        mongoContextHolder.collections = [];
                        mongoContextHolder.populateDocuments([]);
                        $().toastmessage('showSuccessToast', 'Database \'' + dbname + '\' dropped');
                    }).error(function(){
                        $().toastmessage('showErrorToast', 'Drop database \'' + dbname + '\' failed');
                    });
            }

        });
    };

    $scope.onKeypressRename = function($event, value) {
        console.log($event);
        if ($event.keyCode == 13)
            $scope.validateColnameChange(value);
    };

    $scope.cancel = function() {
        $scope.creatingDB = false;
        $scope.copyingDB = false;
        $scope.creatingDoc = false;
        $scope.renamingCol = false;
        $scope.renamingACol = false;
        $scope.creatingCol = false;
        $scope.renColName = mongoContextHolder.currentCollection;
        $scope.newColname = null;
        $scope.newDbname = null;
        $('.modal').modal('hide');
    };
}
