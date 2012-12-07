function DBListCtrl($scope, $timeout, mongodb) {
    $scope.creatingDB = false;
    $scope.copyingDB = false;
    $scope.renamingCol = false;
    $scope.creatingCol = false;
    $scope.creatingDoc = false;
    $scope.newDbname = null;
    $scope.newColname = null;
    $scope.renColName = null;

    $scope.currentDB = null;
    $scope.currentDBSize = 0;
    $scope.totalSize = 0;
    $scope.currentCollection = null;

    $scope.databases = {};
    $scope.collections = [];
    $scope.documents = [];
    $scope.resultSet = {type:'document', elements:[]};
    $scope.totalCount = 0;
    $scope.editors = {};
    $scope.resultTypes = {
        json:{editable:false, removable:false},
        document:{editable:true, removable:true}
    };

    $scope.currentAction= "find";
    $scope.queriesActions = ["find", "findOne", "aggregate", "mapReduce", "update", "insert", "remove"];

    $scope.queriesInputs = {
        query:      {type:"text", size:"large", placeholder:"example : 'field':'value', '$gt':{'age' : 18}", label:false, show:true},
        fields:     {type:"text", size:"medium", placeholder:"'name':1, '_id':0"},
        sort:       {type:"text", size:"medium", placeholder:"n:1, a:-1"},
        skip:       {type:"text", size:"small", placeholder:"offset"},
        limit:      {type:"text", size:"small", placeholder:"max"},
        document:   {type:"text", size:"large", placeholder:"'name':'bob', 'age':24"},
        upsert:     {type:"boolean"},
        multi:      {type:"boolean"},
        map:        {type:"editor", language:'javascript'},
        reduce:     {type:"editor", language:'javascript'},
        finalize:   {type:"editor", language:'javascript'},
        options:    {type:"text", size:"medium"},
        aggregation:{type:"select", duplication:true, options:{
            " $group":   {type:"text", size:"large", placeholder:"'_id':'$name', 'nb_tweets':{'$sum':1}", isObject:true},
            " $limit":   {type:"text", size:"small", placeholder:"max", isObject:false},
            " $match":   {type:"text", size:"large", placeholder:"'database':/^mongo/", isObject:true},
            " $project": {type:"text", size:"large", placeholder:"'city':'$_id'", isObject:true},
            " $sort":    {type:"text", size:"medium", placeholder:"'name':1, 'age':-1", isObject:true},
            " $unwind":  {type:"text", size:"medium", placeholder:"'tags'", isObject:false},
            " $skip":    {type:"text", size:"small", placeholder:"offset", isObject:false}
        }}
    };

    $scope.queriesActionsFilters = {
        "find": {
            inputs: ["query", "fields", "sort", "skip", "limit"]
        },
        "findOne": {
            inputs: ["query"]
        },
        "aggregate" : {
            inputs: ["aggregation"]
        },
        "mapReduce": {
            inputs: ["map", "reduce", "finalize", "options"]
        },
        "update": {
            inputs: ["query", "document", "upsert", "multi"]
        },
        "insert": {
            inputs: ["document"]
        },
        "remove": {
            inputs: ["query"]
        },
        "ensureIndex": {
            inputs: ["query", "options"]
        }
    };

    $scope.init = function(selectedDB, selectedCol) {
        mongodb.listDatabases().success(function(data) {
            $scope.databases = data.databases;
            $scope.totalSize = data.totalSize;
            if(selectedDB != null) {
                $scope.selectdb(selectedDB);
            }
            if(selectedCol != null) {
                $scope.selectCollection(selectedCol);
            }
        });
    };

    $scope.homepage = function() {
        $scope.cancel();
        $scope.currentDB = null;
        $scope.currentCollection = null;
        $scope.collections = [];
        //$scope.documents = [];
        $scope.resultSet.elements = [];
    };

    $scope.focus = function(inputId) {
        $timeout(function() {
            $('input#'+inputId).attr('tabindex', -1).focus();
        }, 10);
    };

    $scope.populateDocuments = function(data) {
        $scope.resultSet.type="document";
        if(data.results != null) {
            $scope.resultSet.elements = data.results;
        } else {
            if(data != null) {
                $scope.resultSet.elements = data;
            } else {
                $scope.resultSet.elements = [];
            }
        }

        if(data.totalCount != null) {
            $scope.totalCount = data.totalCount;
        } else {
            $scope.totalCount = $scope.resultSet.elements.length;
        }
    };

    $scope.selectdb = function(dbname) {
        $scope.cancel();
        $scope.currentDB = dbname;
        $scope.currentDBSize = $scope.databases[dbname].sizeOnDisk;
        $scope.currentCollection = null;
        $scope.resultSet.elements = [];
        $scope.populateDocuments([]);

        mongodb.use(dbname).success(function(data) {
            $scope.collections = data;
        });
    };
    $scope.selectCollection = function(colname, params) {
        $scope.cancel();
        $scope.currentCollection = colname;
        $scope.renColName = colname;
        var args = {};
        var offset = params != undefined ?params.offset : null;
        var max = params != undefined ? params.max : null;

        mongodb[colname].find().skip(offset).limit(max).exec(function(data) {
            $scope.populateDocuments(data);
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

    $scope.createCol = function(inputId) {
        $scope.cancel();
        //$scope.documents = [];
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
                $scope.currentDB = newDbname;
                $scope.currentCollection = null;
                $scope.cancel();
                $scope.databases = data.databases;
                $scope.populateDocuments([]);
                mongodb($scope.currentDB).success(function(data) {
                    $scope.collections = data;
                });
            });
    };

    $scope.validateColnameChange = function() {
        var newColname = $scope.renColName;
        mongodb[$scope.currentCollection].renameCollection(newColname)
            .success(function(data) {
                $scope.currentCollection = newColname;
                $scope.cancel();
                mongodb($scope.currentDB).success(function(data) {
                    $scope.collections = data;
                });
            });
    };

    $scope.validateCreateCollection = function() {
        var newColname = $scope.newColname;
        mongodb.createCollection(newColname)
            .success(function(data) {
                $scope.currentCollection = newColname;
                $scope.cancel();
                mongodb($scope.currentDB).success(function(data) {
                    $scope.collections = data;
                });
            }).error(function(data){
                alert(data);
            });
    };

    $scope.validateCreateDocument = function() {
        var editor = $scope.editors["new-doc"];
        var newDocument = MongoJSON.parse(editor.getValue());
        mongodb[$scope.currentCollection].insert(newDocument).success(function() {
            $scope.selectCollection($scope.currentCollection);
        });
    };

    $scope.dropCol = function() {
        bootbox.confirm("This action cannot be undone. Drop the collection '" + $scope.currentCollection + "' from the db '"+$scope.currentDB + "'?", function(confirm){
        //if(confirm("This action cannot be undone. Drop the collection '" + $scope.currentCollection + "' from the db '"+$scope.currentDB + "'?")) {
            if (confirm) {
                mongodb[$scope.currentCollection].dropCollection()
                    .success(function(data) {
                        $scope.currentCollection = null;
                        $scope.cancel();
                        mongodb($scope.currentDB).success(function(data) {
                            $scope.collections = data;
                    });
                });
            }

        });
    };

    $scope.dropDB = function() {
        bootbox.confirm("This action cannot be undone. Drop the database '"+$scope.currentDB + "'?", function(confirm){
            //if(confirm("This action cannot be undone. Drop the database '"+$scope.currentDB + "'?")) {
            if (confirm) {
                mongodb.dropDatabase()
                    .success(function(data) {
                        $scope.currentDB = null;
                        $scope.currentCollection = null;
                        $scope.currentDBSize = 0;
                        $scope.cancel();
                        $scope.databases = data.databases;
                        $scope.collections = [];
                        $scope.populateDocuments([]);
                    });
            }

        });
    };

    $scope.deleteDocument = function(id) {
        bootbox.confirm("This action cannot be undone. Delete this document ?", function(confirm){
            if (confirm) {
                // Delete document
                mongodb[$scope.currentCollection].remove({"_id":id});
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

    $scope.$on('PaginationChangeEvent', function(event, params){
        $scope.selectCollection($scope.currentCollection, params);
    });

    $scope.$on('MongoDBQuerySubmitEvent', function(event, params){
        //alert("Submitted query : " + angular.toJson(params));
        var fields = "";
        var cur;

        switch($scope.currentAction) {
            case 'find':
                if(params.hasFields) {
                    fields = params.fields != undefined ? params.fields : "";
                } else {
                    fields = "";
                }

                cur = mongodb[$scope.currentCollection].find(MongoJSON.parse('{'+params.query+'}'), JSON.parse('{' + fields + '}'));

                if(params.hasSort) {
                    cur.sort(MongoJSON.parse('{'+params.sort+'}'));
                }
                if(params.hasLimit) {
                    cur.limit(params.limit)
                }
                if(params.hasSkip) {
                    cur.skip(params.skip)
                }
                cur.exec(function(data){
                    $scope.populateDocuments(data);
                });
                break;
            case 'findOne':
                cur = mongodb[$scope.currentCollection].findOne(MongoJSON.parse('{'+params.query+'}'));
                cur.exec(function(data){
                    $scope.populateDocuments(data);
                });
                break;
            case 'update':
                if(params.query != null) {
                    if(params.hasDocument && params.document) {
                        var upsert = params.upsert;
                        var multi = params.multi;
                        mongodb[$scope.currentCollection].update(
                            MongoJSON.parse('{'+params.query+'}'),
                            MongoJSON.parse('{'+params.document+'}'),
                            upsert,
                            multi
                        ).success(function(data) {
                            $scope.selectCollection($scope.currentCollection);
                        });
                    }
                }
                break;
            case "aggregate":
                if(params.aggregation != undefined) {
                    var pipeline = [];
                    angular.forEach(params.aggregation, function(entry){
                        var elem = {};
                        if($scope.queriesInputs.aggregation.options[entry.selected].isObject) {
                            elem[entry.selected.trim()] = MongoJSON.parse('{'+entry.value+'}');
                        } else {
                            elem[entry.selected.trim()] = entry.value;
                        }

                        pipeline.push(elem);
                    });

                    cur = mongodb[$scope.currentCollection].aggregate(pipeline);
                    cur.success(function(data){
                        $scope.resultSet.elements = data;
                        $scope.resultSet.type = 'json';
                    });
                }
                break;
            case "remove":
                break;
            case "insert":
                break;
            case "mapReduce":
                break;
            case "ensureIndex":
                break;
        }
    });

    $scope.submitChange = function(editorId, documentId, originalDocument) {
        var editor = $scope.editors[editorId];
        var newDocument = MongoJSON.parse(editor.getValue());
        var docId;
        if(typeof originalDocument._id === 'object' && typeof originalDocument._id.toStrictJSON === 'function') {
            docId = originalDocument._id.toStrictJSON();
        } else {
            docId = originalDocument._id;
        }
        if(newDocument._id != undefined) {
            delete newDocument._id;
        }
        mongodb[$scope.currentCollection].update({_id:docId}, {"$set":newDocument}).success(function(data) {
            $scope.selectCollection($scope.currentCollection);
        });
    };

    // TODO : this should be done elsewhere
    $scope.setEditable = function(id, enable) {
        if(enable) {
            $("#" + id).css("height", $("#" + id).height());
            var editor = ace.edit(id);
            editor.setTheme("ace/theme/merbivore_soft");
            editor.setShowInvisibles(false);
            editor.setShowPrintMargin(false);
            editor.getSession().setMode("ace/mode/json");
            $scope.editors[id] = editor;
        } else {
            $scope.editors[id].destroy();
        }

    };
}

function parseMongoJson(data, headerGetter) {
    return MongoJSON.parse(data, mongoJsonReviver);
}