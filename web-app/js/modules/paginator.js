function PaginatorCtrl($scope) {
    $scope.currentPage = 1;
    $scope.totalEntries = 0;
    $scope.maxPerPage = 30;
    $scope.maxPageNumbers = 20;
    $scope.truncated = false;
    $scope.uri = null;
    $scope.additionalParams = {};

    $scope.init = function(totalEntries, uri, additionalParams) {
        $scope.totalEntries = totalEntries;
        $scope.uri = uri;
        $scope.additionalParams = additionalParams;
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

    $scope.totalPage = function() {
        var total = 0;
        if($scope.maxPerPage > 0) {
            total = Math.ceil($scope.totalEntries / $scope.maxPerPage);
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

            /*// first 5
            pagesInterval.push(1, 2, 3, 4, 5, '...');
            // middle 5
            var mid = Math.ceil($scope.totalPage() / 2);
            pagesInterval.push(mid-2, mid-1, mid, mid+1, mid+2);
            // last
            pagesInterval.push('...', $scope.totalPage());*/
        } else {
            pagesInterval = $scope.range(1, $scope.totalPage());
        }
        return pagesInterval;
    };

    $scope.onSelect = function() {
        $scope.$emit('PaginationChangeEvent', {offset: ($scope.currentPage - 1) * $scope.maxPerPage, max:$scope.maxPerPage});
    };
}