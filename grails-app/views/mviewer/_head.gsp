<div class="navbar" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html">
    <div class="title outernav">
        <ul class="labels" ng-show="currentDB">
            <li class="dropdown">
                <a ng-click="selectdb(currentDB)"class="dropdown-toggle" data-toggle="dropdown">{{currentDB}}</a>
            </li>
            <li class="separator" ng-show="currentCollection">&nbsp;</li>
            <li ng-show="currentCollection">{{currentCollection}}</li>
        </ul>
        <ul class="labels"  ng-show="!currentDB">
            <li>Databases</li>
        </ul>
        <g:render template="/collection/actions" />
        <g:render template="/database/actions" />
        <g:render template="/database/actionsGlobal" />
        <g:render template="paginator" model="[varTotal: 'totalCount']"/>
    </div>
</div>