MongoDBConsoleModule.directive('mongoQueries', function factory($compile) {
    var directiveDefinitionObject = {
        transclude:'element',
        restrict:'E',
        replace:true,
        scope:false,
        controller:MongoQueriesCtrl,
        template:"<span></span>",
        compile: function compile(tElement, tAttrs, linker) {

            return function(scope, iterStartElement, tAttrs) {
                if(!scope[tAttrs.mgCurrent]) {
                    throw Error("Expecting inputs value in mg-in attribute, no valid inputs found in scope");
                }
                var inputs = scope.queriesInputs;
                var filters = scope.queriesActionsFilters;
                var current = scope[tAttrs.mgCurrent];
                var input;

                var elem = '';

                for(input in inputs) {
                    var curInput = inputs[input];
                    var size = '';
                    var isEditor = false;
                    switch(curInput.size) {
                        case 'small': size = 'small'; break;
                        case 'medium': size = 'medium'; break;
                        case 'large': size = 'large'; break;
                    }

                    switch(curInput.type){
                        case 'text':
                            elem = '<mg-query-textfield id="'+input+'" name="'+input+'" model="{{'+input+'}}" placeholder="'+curInput.placeholder+'" sizeclass="'+size+'" buttonshow="'+(curInput.show == undefined || !curInput.show)+'"/>';
                            break;
                        case 'boolean':
                            elem = '<mg-query-boolean id="'+input+'" name="'+input+'" model="{{'+input+'}}" />';
                            break;
                        case 'editor':
                            elem = '<mg-query-editor id="'+input+'" name="'+input+'" style="height:200px; width:250px; position:relative; display:inline-block; vertical-align:top;" model="{{'+input+'}}" lang="javascript"/>';
                            isEditor = true;
                            break;
                        case 'select':
                            scope.selectOptions = curInput.options;
                            elem = '<mg-query-aggregate id="'+input+'" name="'+input+'" in="selectOptions" />';
                            break;
                    }
                    // Compile and link to the scope
                    elem = angular.element(elem);
                    // Create the dom
                    $(tElement).append(elem);
                    elem.hide();
                    var lnk = $compile(elem);
                    lnk(scope);
                }
                function updateInputs(newVal, oldVal){
                    if(oldVal != newVal) {
                        $(tElement).children(":not(.submit-query)").hide();
                        var f = filters[newVal];
                        for(var i = 0; i < f.inputs.length; i++) {
                            $(tElement).find('#'+ f.inputs[i]).show();
                        }
                    }
                }
                scope.$watch(tAttrs.mgCurrent, updateInputs);

                var submitButton = angular.element('<button class="btn btn-primary submit-query" ng-click="submitQuery()">Query</button>');
                submitButton.on('click', function(){
                    scope.submitQuery();
                });
                $(tElement).append(submitButton);

                updateInputs(current, '');
            };
        }
    };
    return directiveDefinitionObject;
});

/**
 * MongoDB query textfield component
 */
MongoDBConsoleModule.directive('mgQueryTextfield', function factory(grails) {
    var directiveDefinitionObject = {
        scope:{
            model:'@',
            placeholder:'@',
            buttonshow:'@',
            sizeclass:'@'
        },
        transclude:true,
        restrict:'E',
        templateUrl:grails.resource('angular-templates', 'textfield.html'),
        link:function(scope, element, attrs) {
            if(attrs.buttonshow == undefined || attrs.buttonshow == 'false') {
                scope.hasModel = true;
            } else {
                scope.hasModel = false;
            }
            scope.name = attrs.name;
            scope.$watch('model', function(newVal) {
                scope.$emit('MgQueryChangeEvent', {input:attrs.name, value:newVal, active:scope.hasModel});
            });
            scope.$watch('hasModel', function(newVal) {
                scope.$emit('MgQueryChangeEvent', {input:attrs.name, value:'', active:scope.hasModel});
            });
        }
    };
    return directiveDefinitionObject;
});

MongoDBConsoleModule.directive('mgQueryBoolean', function factory(grails) {
    var directiveDefinitionObject = {
        scope:{
            model:'@'
        },
        transclude:true,
        restrict:'E',
        templateUrl:grails.resource('angular-templates', 'booleanfield.html'),
        link:function(scope, element, attrs) {
            scope.name = attrs.name;
            scope.model = false;
            scope.$watch('model', function(newVal) {
                scope.$emit('MgQueryChangeEvent', {input:attrs.name, value:newVal});
            })
        }
    };
    return directiveDefinitionObject;
});

MongoDBConsoleModule.directive('mgQueryEditor', function factory(grails) {
    var directiveDefinitionObject = {
        scope:{
            model:'@'
        },
        transclude:true,
        restrict:'E',
        templateUrl:grails.resource('angular-templates', 'ace-editor.html'),
        link:function(scope, element, attrs) {
            var type = attrs.lang != undefined ? attrs.lang : 'json';

            element.css("height", element.height());
            var editor = ace.edit(attrs.id);
            editor.setTheme("ace/theme/merbivore_soft");
            editor.setShowInvisibles(false);
            editor.setShowPrintMargin(false);
            editor.getSession().setMode("ace/mode/"+type);
            //editor.getSession().setMode("ace/mode/json");
            /*if(scope.editors == undefined) {
                newScope.editors = {};
            }
            scope.editors[attrs.id] = editor;*/
            scope.$watch('model', function(newVal) {
                scope.$emit('MgQueryChangeEvent', {input:attrs.name, value:newVal});
            })
        }
    };
    return directiveDefinitionObject;
});

MongoDBConsoleModule.directive('mgQueryAggregate', function factory(grails) {
    var directiveDefinitionObject = {
        scope:false,
        transclude:true,
        restrict:'E',
        replace:false,
        templateUrl:grails.resource('angular-templates', 'dropdown.html'),
        link:function(scope, element, attrs) {
            scope.$parent.$watch('in', function(value){
                for(scope.firstOption in scope.selectOptions) break;
                scope.pipeline = [{selected:scope.firstOption, value:''}];
            });

            scope.$watch('pipeline', function(newVal) {
                scope.$emit('MgQueryChangeEvent', {input:attrs.name, value:newVal});
            })
        }
    };
    return directiveDefinitionObject;
});

function MongoQueriesCtrl($scope) {
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

    $scope.watchedValues = {};
    $scope.delete = function(array, key) {
        array.splice(key, 1);
    };
    $scope.$on('MgQueryChangeEvent', function(event, params) {
        $scope.watchedValues[params.input] = params.value;
        if(params.active != undefined) {
            $scope.watchedValues["has"+params.input.charAt(0).toUpperCase() + params.input.slice(1)] = params.active;
        }
    });
    $scope.submitQuery = function() {
        $scope.$emit('MongoDBQuerySubmitEvent', $scope.watchedValues);
    };
}