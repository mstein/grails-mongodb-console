MongoDBConsoleModule.config(['$routeProvider','$locationProvider', 'grailsProvider', function($routeProvider, $locationProvider, grailsProvider) {
    /*$routeProvider
        .when(grailsProvider.contextPath+'/mongo/',{templateUrl: grailsProvider.createLink({controller:'mviewer', action:'tplDatabase'}) })
        .when(grailsProvider.contextPath+'/mongo/:db/:collection', {templateUrl: grailsProvider.createLink({controller:'mviewer', action:'tplDocuments'}) })
        .when(grailsProvider.contextPath+'/mongo/:db', {templateUrl: grailsProvider.createLink({controller:'mviewer', action:'tplCollections'}) })
        .otherwise({redirectTo: grailsProvider.contextPath+'/mongo/'});*/
    $routeProvider
        .when('/mongo/',{templateUrl: grailsProvider.createLink({controller:'mviewer', action:'tplDatabase'})})
        .when('/mongo/:db/:collection', {templateUrl: grailsProvider.createLink({controller:'mviewer', action:'tplDocuments'}), controller: DocumentListCtrl})
        .when('/mongo/:db', {templateUrl: grailsProvider.createLink({controller:'mviewer', action:'tplCollections'}), controller: CollectionListCtrl})
        .when('/gridfs/:db/:collection', {templateUrl: grailsProvider.createLink({controller:'mviewer', action:'tplCollections'})})
        .when('/gridfs/:db', {templateUrl: grailsProvider.createLink({controller:'mviewer', action:'tplCollections'})})
        .when('/gridfs/', {templateUrl: grailsProvider.createLink({controller:'mviewer', action:'tplDatabase'}), controller: GridFSCtrl})
        .otherwise({redirectTo: '/mongo/'});
}]);