MongoDBConsoleModule.directive('mongoQueries', function factory($compile) {
    var directiveDefinitionObject = {
        transclude:'element',
        restrict:'E',
        replace:true,
        scope:false,
        controller:function($scope){
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
        },
        template:"<span></span>",
        compile: function compile(tElement, tAttrs, linker) {

            return function(scope, iterStartElement, tAttrs) {
                if(!scope[tAttrs.mgIn]) {
                    throw Error("Expecting inputs value in mg-in attribute, no valid inputs found in scope");
                }
                var inputs = scope[tAttrs.mgIn];
                var filters = scope[tAttrs.mgFilters];
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
        //replace:true,
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
            })
            scope.$watch('hasModel', function(newVal) {
                scope.$emit('MgQueryChangeEvent', {input:attrs.name, value:'', active:scope.hasModel});
            })
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
        //replace:true,
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
        //replace:true,
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
        replace:false,
        restrict:'E',
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