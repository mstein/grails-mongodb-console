function CollectionListCtrl($scope, $routeParams, mongoContextHolder, mongodb, $location) {
    $scope.selectedCol = {};
    $scope.countColSelected = 0;

    $scope.$watch(function() {return $routeParams.collection;}, function(value){
        mongoContextHolder.currentCollection = value;
    });

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

    $scope.exportCols = function() {
        if ($scope.countColSelected > 0) {
            bootbox.confirm("Confirm the export generation for the "+$scope.countColSelected+" selected collection(s)? This action can be slow depending on the collection size.", function(confirm){
                if(confirm) {
                    var allCol = [];
                    for(var col in $scope.selectedCol) {
                        allCol.push(col);
                    }
                    mongodb.exportCollections(allCol);
                }
            });
        }
    };
}