<div ng-show="documents">
    <g:render template="/document/list" />
</div>

<div ng-show="!currentDB && !currentCollection">
    <g:render template="/database/table" />
</div>

<div ng-show="currentDB && !currentCollection">
    <g:render template="/collection/table" />
</div>