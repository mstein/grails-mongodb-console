<%@ page contentType="text/html;charset=UTF-8" %>
<html ng-app="MongoDBViewerModule">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

  <title>MongoDB Viewer Plugin</title>

  <link rel="stylesheet" href="${resource(plugin: 'mongo-viewer', dir: "css", file:"bootstrap.min.css")}" />
  <link rel="stylesheet" href="${resource(plugin: 'mongo-viewer', dir: "css", file:"bootstrap-responsive.min.css")}" />
  <link rel="stylesheet" href="${resource(plugin: 'mongo-viewer', dir: "css", file:"mviewer.css")}" />
  <style type="text/css">
  body {
    padding-top: 60px;
    padding-bottom: 40px;
  }

  .sidebar-nav {
    padding: 9px 0;
  }
  </style>
  <script src="${resource(plugin: 'mongo-viewer', dir: "js", file:"jquery-1.7.2.min.js")}"></script>
  <script src="${resource(plugin: 'mongo-viewer', dir: "js/ace", file:"ace.js")}"></script>
  <script src="${resource(plugin: 'mongo-viewer', dir: "js", file:"angular.min.js")}"></script>
  <script src="${resource(plugin: 'mongo-viewer', dir: "js", file:"bootstrap.min.js")}"></script>
  <script src="${resource(plugin: 'mongo-viewer', dir: "js/lib", file:"mongoLib.js")}"></script>
  <script src="${resource(plugin: 'mongo-viewer', dir: "js", file:"mongoJson.js")}"></script>
  <script src="${resource(plugin: 'mongo-viewer', dir: "js/modules", file:"databases.js")}"></script>
  <script src="${resource(plugin: 'mongo-viewer', dir: "js/filters", file:"commonFilters.js")}"></script>
  <script src="${resource(plugin: 'mongo-viewer', dir: "js/modules", file:"paginator.js")}"></script>
  <script src="${resource(plugin: 'mongo-viewer', dir: "js/modules", file:"mongodbService.js")}"></script>
</head>
<body>

</body>
</html>