<div class="col1">
    <ul class="well" ng-show="currentDB">
        <li class="well-header" ng-class="{active:currentDB && !currentCollection}">
            <a ng-click="selectdb(currentDB)">
                {{currentDB}} ({{ currentDBSize | fileSize }})<br/>
                <span>Collections ({{collections.length}})</span>
            </a>
        </li>
        <li ng-repeat="collection in collections" class="item-collection" ng-class="{active:collection == currentCollection}">
            <a ng-click="selectCollection(collection)">{{collection}}</a>
        </li>
    </ul>
</div>