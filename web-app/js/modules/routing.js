MongoDBConsoleModule.config(['$routeProvider','$locationProvider', 'grailsProvider', function($routeProvider, $locationProvider, grailsProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when(grailsProvider.contextPath+'/mongo/',{templateUrl: grailsProvider.createLink({controller:'mviewer', action:'tplDatabase'}) })
        .when(grailsProvider.contextPath+'/mongo/:db/:collection', {templateUrl: grailsProvider.createLink({controller:'mviewer', action:'tplDocuments'}) })
        .when(grailsProvider.contextPath+'/mongo/:db', {templateUrl: grailsProvider.createLink({controller:'mviewer', action:'tplCollections'}) })
        .otherwise({redirectTo: grailsProvider.contextPath+'/mongo/'})
}]);