<html>
<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <meta content="main" name="layout"/>
</head>
<body>

%{-- List of a database --}%
<div id="page-db" ng-show="!currentDB && !currentCollection">
    <g:render template="/database/table" />
</div>

%{-- List collections of a database --}%
<div id="page-collection" ng-show="currentDB && !currentCollection">
    <g:render template="/collection/table" />
</div>

%{-- Documents of a collection --}%
<div id="page-document" ng-show="currentDB && currentCollection">
    <g:render template="/document/list" />
</div>

</body>
</html>