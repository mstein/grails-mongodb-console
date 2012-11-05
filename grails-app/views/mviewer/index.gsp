<html>
<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <meta content="main" name="layout"/>
</head>
<body>
    <g:render template="collections"/>

    <div class="col2">

        <div ng-show="documents">
            <g:render template="/document/list" />
        </div>

        <div ng-show="!currentDB && !currentCollection">
            <g:render template="/database/table" />
        </div>

        <div ng-show="currentDB && !currentCollection">
            <g:render template="/collection/table" />
        </div>

    </div>

</body>
</html>