function CollectionListCtrl($scope, $routeParams, mongoContextHolder) {
    $scope.$watch(function() {return $routeParams.collection;}, function(value){
        mongoContextHolder.currentCollection = value;
    });
}