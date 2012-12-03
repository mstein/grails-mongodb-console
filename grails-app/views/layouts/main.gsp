<%@ page contentType="text/html;charset=UTF-8" %>
<html ng-app="MongoDBConsoleModule">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title>MongoDB Viewer Plugin</title>

    <link rel="shortcut icon" href="${resource(dir: 'img', file: 'favicon.ico')}" type="image/x-icon" >
    <link rel="apple-touch-icon" href="${resource(dir: 'img', file: 'apple-touch-icon.png')}">
    <link rel="apple-touch-icon" sizes="114x114" href="${resource(dir: 'img', file: 'apple-touch-icon-retina.png')}">

    <link rel="stylesheet" href="${resource(plugin: 'mongo-viewer', dir: "css", file: "bootstrap.css")}"/>
    <link rel="stylesheet" href="${resource(plugin: 'mongo-viewer', dir: "css", file: "bootstrap-responsive.min.css")}"/>

    <style type="text/css">
    body {
        padding-top: 40px;
        padding-bottom: 40px;
    }
    </style>

    <script src="${resource(plugin: 'mongo-viewer', dir: "js", file: "jquery-1.8.2.min.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/ace", file: "ace.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js", file: "angular.min.js")}"></script>

    <g:render template="/template/grailsService"/>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/bootstrap/", file: "bootstrap-transition.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/bootstrap/", file: "bootstrap-alert.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/bootstrap/", file: "bootstrap-modal.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/bootstrap/", file: "bootstrap-dropdown.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/bootstrap/", file: "bootstrap-scrollspy.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/bootstrap/", file: "bootstrap-tab.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/bootstrap/", file: "bootstrap-tooltip.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/bootstrap/", file: "bootstrap-popover.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/bootstrap/", file: "bootstrap-button.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/bootstrap/", file: "bootstrap-collapse.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/bootstrap/", file: "bootstrap-carousel.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/bootstrap/", file: "bootstrap-typeahead.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/bootstrap/", file: "bootstrap-affix.js")}"></script>

    <script src="${resource(plugin: 'mongo-viewer', dir: "js/plugins/", file: "bootbox.js")}"></script>

    <script src="${resource(plugin: 'mongo-viewer', dir: "js/modules", file: "MongoDBConsoleModule.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/lib", file: "mongoLib.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/lib", file:"mongoJson.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/modules", file: "databases.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/filters", file: "commonFilters.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/modules", file: "mongoQueries.js")}"></script>

    <script src="${resource(plugin: 'mongo-viewer', dir: "js/modules", file: "mongodbService.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/modules", file: "paginator.js")}"></script>
    <g:layoutHead/>
</head>

<body class="body-application" ng-controller="DBListCtrl" ng-init="init(${
    session.mviewer?.with {
        (currentDB ? '\'' + currentDB + '\'' : '') + (currentCol ? ',\'' + currentCol + '\'' : '')
    }
})">

<g:render template="/layouts/navigation"/>

<div class="container-application">

    <div class="row-application">
        <div class="col1">
            <g:render template="/layouts/well"/>
        </div>
        <div class="col2">
            <g:layoutBody/>
        </div>

    </div>
</div>

%{-- Modals --}%
<g:render template="/database/create"/>
<g:render template="/database/copy"/>
<g:render template="/collection/create"/>
<g:render template="/document/create"/>
</body>
</html>