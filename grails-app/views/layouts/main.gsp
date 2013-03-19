<%@ page contentType="text/html;charset=UTF-8" %>
<html ng-app="MongoDBConsoleModule">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <meta name="fragment" content="!" />

    <title>MongoDB Viewer Plugin</title>

    <link rel="shortcut icon" href="${resource(dir: 'img', file: 'favicon.ico')}" type="image/x-icon" >
    <link rel="apple-touch-icon" href="${resource(dir: 'img', file: 'apple-touch-icon.png')}">
    <link rel="apple-touch-icon" sizes="114x114" href="${resource(dir: 'img', file: 'apple-touch-icon-retina.png')}">

    <link rel="stylesheet" href="${resource(plugin: 'mongo-viewer', dir: "css", file: "bootstrap.css")}"/>

    <style type="text/css">
    body {
        padding-top: 40px;
        padding-bottom: 40px;
    }
    </style>

    <script src="${resource(plugin: 'mongo-viewer', dir: "js", file: "jquery-1.8.2.min.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/lib", file: "jquery-ui-1.10.1.widget.min.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/lib", file: "jquery.iframe-transport.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/lib", file: "jquery.fileupload.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/ace", file: "ace.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js", file: "angular.min.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/lib", file: "angular-ui.js")}"></script>

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

    <script src="${resource(plugin: 'mongo-viewer', dir: "js/lib/", file: "bootbox.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/lib/", file: "toastmessage.js")}"></script>

    <script src="${resource(plugin: 'mongo-viewer', dir: "js/angular", file: "MongoDBConsoleModule.js")}"></script>

    <script src="${resource(plugin: 'mongo-viewer', dir: "js/lib", file: "mongoLib.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/lib", file:"mongoJson.js")}"></script>

    <script src="${resource(plugin: 'mongo-viewer', dir: "js/angular/filters", file: "commonFilters.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/angular", file: "routing.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/angular/directives", file: "mongoQueries.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/angular/directives", file: "paginator.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/angular/services", file: "mongodbService.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/angular/services", file: "MongoContextHolder.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/angular/controllers", file: "DBListCtrl.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/angular/controllers", file: "CollectionListCtrl.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/angular/controllers", file: "DocumentListCtrl.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/angular/controllers", file: "GridFSCtrl.js")}"></script>
    <script src="${resource(plugin: 'mongo-viewer', dir: "js/angular/controllers", file: "MonitoringCtrl.js")}"></script>

    <g:layoutHead/>
</head>

<body class="body-application" ng-controller="DBListCtrl" ng-init="init(${(currentDB ? '\'' + currentDB + '\'' : '') + (currentCol ? ',\'' + currentCol + '\'' : '')}); serverInfo();">

<g:render template="/layouts/navigation"/>

<div class="container-application">

    <div class="row-application">
        <div class="col1">
            <g:render template="/layouts/well"/>
        </div>
        <div class="col2">
            <span class="extra-radius"></span>
            <g:layoutBody/>
        </div>

    </div>
</div>

%{-- Modals --}%
<g:render template="/database/create"/>
<g:render template="/database/copy"/>
<g:render template="/collection/create"/>
<g:render template="/collection/import"/>
<g:render template="/collection/rename"/>
<g:javascript>
    $(function(){
        $(".modal").on("hidden", function(){
            $(this).find(".close").click();
        });
    });
</g:javascript>
</body>
</html>