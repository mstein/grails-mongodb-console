function MonitoringCtrl($scope, $routeParams, mongodb, mongoContextHolder, $http, grails, $location) {

    $scope.log = false;

    $scope.showLog = function(){
        $scope.cancel();
        $scope.log = true;
    }

    $scope.cancel = function(){
        $scope.log = false;
    }
}
