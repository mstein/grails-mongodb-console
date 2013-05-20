function PaginatorCtrl($scope) {
    $scope.currentPage = 1;
    $scope.maxPerPage = 30;
    $scope.maxPageNumbers = 20;
    $scope.truncated = false;
    $scope.uri = null;
    $scope.additionalParams = {};
    $scope.minOffset = 0;
    $scope.elementName = "document";
    $scope.elementNameMulti = "documents";
    $scope.previousLabel = "« Previous";
    $scope.nextLabel = "Next »";
    $scope.pageLabel = "Page <strong>{{currentPage}}</strong> of <strong>{{totalPage()}}</strong> - <strong>{{ajustedTotal()}}</strong> total {{eName()}}";
    $scope.explicitReset = false;

    $scope.pageInfos = function(){
        return $scope.pageLabelFcn($scope);
    };

    $scope.eName = function() {
        if($scope.ajustedTotal() > 1) {
            return $scope.elementNameMulti;
        } else {
            return $scope.elementName;
        }
    };

    $scope.range = function (start, end) {
        var ret = [];
        if (!end) {
            end = start;
            start = 0;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.next = function(n) {
        if($scope.currentPage < $scope.totalPage()) {
            $scope.currentPage++;
            $scope.onSelect();
        }
    };

    $scope.previous = function() {
        if($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.onSelect();
        }
    };

    $scope.select = function(page) {
        if(page <= $scope.totalPage() && page > 0) {
            $scope.currentPage = page;
            $scope.onSelect();
        }
    };

    $scope.ajustedTotal = function() {
        var ajustedTotal = $scope.total - $scope.minOffset;
        return ajustedTotal >= 0 ? ajustedTotal : 0;
    };

    $scope.totalPage = function() {
        var total = 0;
        if($scope.maxPerPage > 0) {
            total = Math.ceil($scope.ajustedTotal() / $scope.maxPerPage);
            $scope.truncated = total > $scope.maxPageNumbers;
        }
        return total;
    };

    $scope.pages = function() {
        var pagesInterval = [];
        if($scope.truncated) {
            if($scope.currentPage < 5) {
                // first 5
                pagesInterval.push(1, 2, 3, 4, 5);
                pagesInterval.push('...', $scope.totalPage());
            } else if($scope.currentPage >= 5) {
                // first page and a gap
                pagesInterval.push(1, '...');
                if($scope.currentPage <= $scope.totalPage() - 4) {
                    $.merge(pagesInterval, $scope.range($scope.currentPage-2,$scope.currentPage+3));
                    pagesInterval.push('...', $scope.totalPage());
                } else {
                    $.merge(pagesInterval, $scope.range($scope.totalPage() - 4, $scope.totalPage()+1));
                }
            }
        } else {
            pagesInterval = $scope.range(1, $scope.totalPage()+1);
        }
        return pagesInterval;
    };

    $scope.onSelect = function() {
        $scope.$emit('PaginationChangeEvent', {offset: ($scope.currentPage - 1) * $scope.maxPerPage + $scope.minOffset, max:$scope.maxPerPage, page:$scope.currentPage-1});
    };

    /**
     * Reset the paginator current page to the first one.
     * If explicitReset is true, then the paginator can only be reset by a event that explicitely target this paginator
     * with the "id" parameter
     */
    $scope.$on('PaginationResetRequestEvent', function(event, params) {
        // If params.id is defined, we only reset the paginator if the $scope.id match
        if(params != undefined && params.id != undefined && $scope.id != undefined && params.id == $scope.id) {
            $scope.currentPage = 1;
        } else if(!$scope.explicitReset && (params == undefined || params.id == undefined)) {
            // No params.id defined, and we don't have $scope.id
            $scope.currentPage = 1;
        }
    });
}

MongoDBConsoleModule.directive('paginator', function factory(grails, $interpolate, $parse) {
    var paginators={};
    var synchronizedPaginatorCopiedFields = ['currentPage', 'maxPerPage', 'minOffset', 'total', 'elementName', 'elementNameMulti', 'explicitReset', 'previousLabel', 'nextLabel', 'pageLabel'];
    var attrsWatches = {maxPerPage:'int', minOffset:'int', elementName:'', elementNameMulti:'', explicitReset:'', previousLabel:'', nextLabel:''};
    var directiveDefinitionObject = {
        transclude:'element',
        restrict:'E',
        replace:true,
        scope:{
            total:'@',
            ngShow:'&'
        },
        controller:PaginatorCtrl,
        templateUrl:grails.resource('angular-templates', 'paginator.html'),
        link:function(scope, element, attrs) {
            if(attrs.id != undefined) {
                paginators[attrs.id] = scope;
                scope.id = attrs.id;
            }

            if(angular.isDefined(attrs.pageLabel)) {
                scope.pageLabel = attrs.pageLabel;
            }

            angular.forEach(attrsWatches, function(type, key) {
                if(angular.isDefined(attrs[key])) {
                    scope[key] = scope.$parent.$eval(attrs[key]);
                    scope.$watch(function() {
                        return scope.$parent.$eval(attrs[key]);
                    }, function(value){
                        if(type == 'int') {
                            scope[key] = parseInt(value);
                        } else {
                            scope[key] = value;
                        }
                    });
                }
            });

            // The paginator is synchronized to another one, pull its scope and
            // make sure the total & current page update are synchronized
            if(angular.isDefined(attrs.synchronizedWith)) {
                if(angular.isDefined(paginators[attrs.synchronizedWith])) {
                    // Initialize at the same values
                    scope.id = paginators[attrs.synchronizedWith].id;
                    scope.total = paginators[attrs.synchronizedWith].total;
                    scope.currentPage = paginators[attrs.synchronizedWith].currentPage;
                    scope.pageLabel = paginators[attrs.synchronizedWith].pageLabel;

                    // Changing the page on a synchronised will also change the page on the original
                    scope.$watch('currentPage', function(newVal){
                        paginators[attrs.synchronizedWith].currentPage = newVal;
                    });

                    // Watch the original attributes and update the synchronized one accordingly
                    angular.forEach(synchronizedPaginatorCopiedFields, function(value){
                        paginators[attrs.synchronizedWith].$watch(value, function(newVal){
                            scope[value] = newVal;
                        });
                    });
                }
            }
            scope.pageLabelFcn = $interpolate(scope.pageLabel);
        }
    };

    return directiveDefinitionObject;
});