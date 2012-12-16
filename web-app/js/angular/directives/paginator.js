function PaginatorCtrl($scope) {
    $scope.currentPage = 1;
    $scope.maxPerPage = 30;
    $scope.maxPageNumbers = 20;
    $scope.truncated = false;
    $scope.uri = null;
    $scope.additionalParams = {};

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

    $scope.totalPage = function() {
        var total = 0;
        if($scope.maxPerPage > 0) {
            total = Math.ceil($scope.total / $scope.maxPerPage);
            if(total > $scope.maxPageNumbers) {
                $scope.truncated = true;
            } else {
                $scope.truncated = false;
            }
        }
        return total;
    };

    $scope.pages = function() {
        var pagesInterval = [];
        if($scope.truncated) {

            if($scope.currentPage < 5) {
                // first 5
                pagesInterval.push(1, 2, 3, 4, 5, '...');
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
            pagesInterval = $scope.range(1, $scope.totalPage());
        }
        return pagesInterval;
    };

    $scope.onSelect = function() {
        $scope.$emit('PaginationChangeEvent', {offset: ($scope.currentPage - 1) * $scope.maxPerPage, max:$scope.maxPerPage});
    };
}



MongoDBConsoleModule.directive('paginator', function factory(grails, $interpolate) {
    var paginators={};
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
            }

            // The paginator is synchronized to another one, pull its scope and
            // make sure the total & current page update are synchronized
            if(attrs.synchronizedWith != undefined) {
                if(paginators[attrs.synchronizedWith] != undefined) {
                    scope.total = paginators[attrs.synchronizedWith].total;
                    scope.currentPage = paginators[attrs.synchronizedWith].currentPage;
                    scope.$watch('currentPage', function(newVal){
                        paginators[attrs.synchronizedWith].currentPage = newVal;
                    });
                    paginators[attrs.synchronizedWith].$watch('currentPage', function(newVal){
                        scope.currentPage = newVal;
                    });
                    paginators[attrs.synchronizedWith].$watch('total', function(newVal){
                        scope.total = newVal;
                    });
                }
            }
        }
    };

    return directiveDefinitionObject;
});