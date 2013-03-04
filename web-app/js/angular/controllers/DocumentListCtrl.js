/**
 * The documents lists controller.
 * Assumes scope inheritance from DBListCtrl
 *
 * @param $scope The controller scope, assumed to be inherited from DBListCtrl
 * @param $routeParams The $routeParams service allowing to get the params from the $route service and watch for changes
 * @param mongodb The mongodb service, used to send mongodb commands to the server
 * @param mongoContextHolder The mongo context holder, containing many shared value with other controllers
 * @param $http
 * @param grails
 * @param $location
 *
 * @constructor
 */
function DocumentListCtrl($scope, $routeParams, mongodb, mongoContextHolder, $http, grails, $location) {
    $scope.currentAction= "find";

    $scope.totalCount = 0;
    $scope.editors = {};
    $scope.latestQuery = null;
    $scope.selectedDocuments = {};
    $scope.countDocumentsSelected = 0;


    $scope.resultTypes = {
        json:{editable:false, removable:false, elementName:'result', elementNameMulti:'results'},
        document:{editable:true, removable:true, elementName:'document', elementNameMulti:'documents', remove:function(document){
            $scope.deleteDocument(document._id);
        }},
        index:{editable:false, removable:true, elementName:'index', elementNameMulti:'indexes', remove:function(index){
            $scope.dropIndex(index);
        }}
    };

    $scope.$on("DatabaseLoadedEvent", function() {
        $scope.selectCollection($routeParams.collection);
    });

    /**
     * Watch for any collection changes so that the current collection is updated accordingly
     */
    $scope.$watch(function(){return $routeParams.collection;}, function(value){
        if(mongoContextHolder.collectionSelectable()){
            $scope.selectCollection(value);
        }
    });

    /**
     * Display the new doc insertion UI
     */
    $scope.createDoc = function() {
        $scope.cancel();
        $scope.creatingDoc = true;
        $("#createDoc").modal({show: true});
        $scope.setEditable("new-doc", true);
        $scope.focus("new-doc");
    };

    /**
     * Inserts a new document
     */
    $scope.validateCreateDocument = function() {
        var editor = $scope.editors["new-doc"];
        var newDocument = MongoJSON.parseTengen(editor.getValue());
        $scope.setEditable("new-doc", false);
        mongodb[mongoContextHolder.currentCollection].insert(newDocument).success(function() {
            $scope.selectCollection(mongoContextHolder.currentCollection);
            $().toastmessage('showSuccessToast', 'Document created');
        }).error(function(){
            $().toastmessage('showErrorToast', 'Create document failed');
        });
    };

    /**
     * Submit a update (from the UI)
     *
     * @param editorId
     * @param documentId
     * @param originalDocument
     */
    $scope.submitChange = function(editorId, documentId, originalDocument) {
        var editor = $scope.editors[editorId];
        var newDocument = MongoJSON.parseTengen(editor.getValue());
        var docId;
        if(typeof originalDocument._id === 'object' && typeof originalDocument._id.toStrictJSON === 'function') {
            docId = originalDocument._id.toStrictJSON();
        } else {
            docId = originalDocument._id;
        }
        if(newDocument._id != undefined) {
            delete newDocument._id;
        }
        var encapsulatedDocument = newDocument;

        // Encapsulate the document in a "$set" if a projection is applied to the current resultset
        var latestQuery = mongoContextHolder.resultSet.query;
        if(latestQuery.type == "find" || latestQuery.type == "findOne") {
            if(latestQuery.object){
                var nbFields = 0;
                if(latestQuery.object._fields) {
                    for(var f in latestQuery.object._fields) {
                        if (latestQuery.object._fields.hasOwnProperty(f)) {
                            nbFields++;
                            break;// getting one is enough to consider the object not empty
                        }
                    }
                    if(nbFields > 0) {
                        encapsulatedDocument = {"$set":newDocument};
                    }
                }
            }
        }
        mongodb[mongoContextHolder.currentCollection].update({_id:docId}, encapsulatedDocument).success(function(data) {
            $scope.selectCollection(mongoContextHolder.currentCollection);
            $scope.$broadcast('PaginationResetRequestEvent');
        });
    };

    /**
     * Deletes a document identified by its id
     * @param id
     */
    $scope.deleteDocument = function(id) {
        bootbox.confirm("This action cannot be undone. Delete document of id "+MongoJSON.stringify(id, null, null, {tengen:true})+"?", function(confirm){
            if (confirm) {
                // Delete document
                mongodb[mongoContextHolder.currentCollection].remove({"_id":id}).success(function(data){
                    $scope.selectCollection(mongoContextHolder.currentCollection);
                    $().toastmessage('showSuccessToast', 'Document \'' + id + '\' dropped');
                }).error(function(){
                    $().toastmessage('showSuccessToast', 'Drop document \'' + id + '\' failed');
                });
            }
        });
    };

    /**
     * Drops an index based on its keys
     * @param index
     */
    $scope.dropIndex = function(index) {
        bootbox.confirm("This action cannot be undone. Drop index of key "+MongoJSON.stringify(index.key)+"?", function(confirm){
            if (confirm) {
                // Retrieve the targetted collection from the namespace field
                // the namespace include the database name, and we don't need it
                var targetCollection = index.ns.substring(mongoContextHolder.currentDB.length+1);
                mongodb[targetCollection].dropIndex(index.key).success(function(){
                    if(mongoContextHolder.resultSet.query.type == "find") {
                        $scope.redoLastFindQuery();
                    } else {
                        $scope.selectCollection(mongoContextHolder.currentCollection);
                    }
                }).error(function(data){ alert(data.error);});
            }
        });
    };

    /**
     * Transform a regular JSON-box into a ACE editor to allow update
     * @param id
     * @param enable
     */
    // TODO : this should be done elsewhere
    $scope.setEditable = function(id, enable) {
        /*if(!$scope.editors[id]) {*/
        var originalPre = $("#" + id);
        if(enable) {
            var existing = $('#'+id + '-editor');
            if(existing.length > 0) {
                existing.remove();
            }
            var duplicatedPre = $("<"+ originalPre.prop('tagName') +"></"+ originalPre.prop('tagName') +">");
            originalPre.css("height", originalPre.height());
            duplicatedPre.css("height", originalPre.height());

            duplicatedPre.html(originalPre.html());
            duplicatedPre.attr('id', id + '-editor');
            duplicatedPre.attr('class', originalPre.attr('class'));
            duplicatedPre.attr('style', originalPre.attr('style'));
            originalPre.hide();
            originalPre.after(duplicatedPre);

            var editor = ace.edit(id + '-editor');
            editor.setTheme("ace/theme/merbivore_soft");
            editor.setShowInvisibles(false);
            editor.setShowPrintMargin(false);
            editor.getSession().setMode("ace/mode/json");
            $scope.editors[id] = editor;
        } else {
            var existingEditor= $("#" + id + '-editor');
            originalPre.show();
            $scope.editors[id].destroy();
            existingEditor.remove();
        }
        /*}*/
    };

    /**
     * The user may have issued a find query with custom skip() value. This value will be considered as a "min" offset
     * for the paginator.
     *
     * @return {number} The number of documents to ignore completely (deduced from the total too for the paginator point of view)
     */
    $scope.contextOffset = function(){
        var previousQuery = mongoContextHolder.resultSet.query;
        var minSkip = 0;
        if(previousQuery.type == 'find' && previousQuery.object) {
            if(previousQuery.object._skip && previousQuery.object._skip > 0) {
                minSkip = previousQuery.object._skip;
            }
        }
        return minSkip;
    };

    /**
     * The default max elements per page for pagination is 30, but the user may alter this when issuing a find query
     * with custom limit() value, this method take that in account.
     *
     * @return {number} The max number of elements allowed to be displayed per page. Whether return the default value or
     * the contextual one (meaning that a find query was perform with custom limit() value)
     */
    $scope.contextMax = function() {
        var previousQuery = mongoContextHolder.resultSet.query;
        var limit = 30;
        if(previousQuery.type == 'find' && previousQuery.object) {
            if(previousQuery.object._limit && previousQuery.object._limit > 0) {
                limit = previousQuery.object._limit;
            }
        }
        return limit;
    };

    /**
     * Perform again the last find query if it exists
     */
    $scope.redoLastFindQuery = function(params) {
        var previousQuery = mongoContextHolder.resultSet.query;
        if(previousQuery.type == 'find') {
            if(previousQuery.object) {
                // we assume that the object is a MongoQuery instance
                // The query is done with a duplicated one, so that we keep the original
                var duplicatedQuery = mongodb[mongoContextHolder.currentCollection].find();
                angular.extend(duplicatedQuery, previousQuery.object);

                if(params && params.offset) {
                    duplicatedQuery.skip(params.offset);
                }

                duplicatedQuery.exec(function(data){
                    var query = { type:"find", object:previousQuery.object};
                    mongoContextHolder.populateDocuments(data, query);
                });
            }
        }
    };

    /**
     * Handle paginator events
     */
    $scope.$on('PaginationChangeEvent', function(event, params){
        // Check if the latest documents were the result of a find query
        var previousQuery = mongoContextHolder.resultSet.query;
        if(previousQuery.type == 'find') {
            $scope.redoLastFindQuery(params);
        } else if(previousQuery.type == 'aggregate'){
            if(previousQuery.object) {
                // Ask the server-side session cache for the results
                var url = grails.createLink({controller:'mviewer', action:'mongodbConsoleCache'});
                $http.post(url, {offset:params.offset, max: params.max}, {transformResponse:parseMongoJson}).success(function(data){
                    var query = { type:"aggregate", object:previousQuery.object };
                    mongoContextHolder.populateDocuments(data.results, query, "json");
                    mongoContextHolder.resultSet.totalCount = data.totalCount;
                });
            }
        } else {
            $scope.selectCollection(mongoContextHolder.currentCollection, params);
        }
    });

    /**
     * Handles the quick queries helper submition
     */
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

                cur = mongodb[mongoContextHolder.currentCollection].find(MongoJSON.parseTengen('{'+params.query+'}'), MongoJSON.parse('{' + fields + '}'));

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
                    var query = { type:"find", object:cur };
                    mongoContextHolder.populateDocuments(data, query);
                    $scope.$broadcast('PaginationResetRequestEvent');
                });
                break;
            case 'findOne':
                cur = mongodb[mongoContextHolder.currentCollection].findOne(MongoJSON.parseTengen('{'+params.query+'}'));
                cur.exec(function(data){
                    var query = { type:"findOne", object:cur };
                    mongoContextHolder.populateDocuments(data, query);
                    mongoContextHolder.resultSet.totalCount = 1;
                    $scope.$broadcast('PaginationResetRequestEvent');
                });
                break;
            case 'update':
                if(params.query != null) {
                    if(params.hasDocument && params.document) {
                        var upsert = params.upsert;
                        var multi = params.multi;
                        mongodb[mongoContextHolder.currentCollection].update(
                                MongoJSON.parseTengen('{'+params.query+'}'),
                                MongoJSON.parseTengen('{'+params.document+'}'),
                                upsert,
                                multi
                            ).success(function(data) {
                                $scope.selectCollection(mongoContextHolder.currentCollection);
                                $scope.$broadcast('PaginationResetRequestEvent');
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

                    cur = mongodb[mongoContextHolder.currentCollection].aggregate(pipeline);
                    cur.success(function(data){
                        var query = { type:"aggregate", object:pipeline };
                        mongoContextHolder.populateDocuments(data.results, query, "json");
                        mongoContextHolder.resultSet.totalCount = data.totalCount;
                        $scope.$broadcast('PaginationResetRequestEvent');
                    });
                }
                break;
            case "remove":
                if(params.query != null) {
                    bootbox.confirm("This action will remove all document matching the criteria, this cannot be undone. <br />Perform remove operation with the following query ? <br />" +
                        "<pre>db."+mongoContextHolder.currentDB+"."+mongoContextHolder.currentCollection+".remove({"+params.query+"})</pre>",
                        function(confirm){
                            if(confirm) {
                                mongodb[mongoContextHolder.currentCollection].remove(MongoJSON.parseTengen('{'+params.query+'}')).success(function(data){
                                    $scope.selectCollection(mongoContextHolder.currentCollection);
                                    $scope.$broadcast('PaginationResetRequestEvent');
                                });
                            }
                        }
                    );
                }
                break;
            case "insert":
                if(params.hasDocument && params.document != null) {
                    mongodb[mongoContextHolder.currentCollection].insert(MongoJSON.parseTengen('{'+params.document+'}')).success(function() {
                        $scope.selectCollection(mongoContextHolder.currentCollection);
                        $scope.$broadcast('PaginationResetRequestEvent');
                    });
                }
                break;
            case "mapReduce":
                break;
            case "ensureIndex":
                if(params.query != null) {
                    var options = null;
                    if(params.hasOptions && params.options != null) {
                        options = MongoJSON.parseTengen('{'+params.options+'}');
                    }
                    var indexKey = MongoJSON.parseTengen('{'+params.query+'}');
                    mongodb[mongoContextHolder.currentCollection].ensureIndex(indexKey, options).success(function(){
                        //$location.path('/mongo/default_db/system.indexes');
                        var indexQuery = mongodb['system.indexes'].find({"ns":mongoContextHolder.currentDB+"."+mongoContextHolder.currentCollection});
                        indexQuery.exec(function(data){
                            var query = { type:"find", object:indexQuery };
                            mongoContextHolder.populateDocuments(data, query, "index");
                            $scope.$broadcast('PaginationResetRequestEvent');
                        }, function(data){ alert(data);});
                    }).error(function(data){
                            alert(data.error);
                    });
                }
                break;
        }
    });

    $scope.$watch('selectedDocuments', function () {
        var count = 0;
        angular.forEach($scope.selectedDocuments, function (value, field) {
            if (value) count++;
        });
        $scope.countDocumentsSelected = count;
    }, true);

    $scope.dropDocuments = function() {
        if ($scope.countDocumentsSelected > 0) {
            bootbox.confirm("Drop " + $scope.countDocumentsSelected + " document(s) ?", function(confirm){
                if (confirm) {
                    alert("TODO");
                }
            });
        }
    }

}