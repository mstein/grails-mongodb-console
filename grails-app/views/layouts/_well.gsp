<ul class="well" ng-show="currentDB">
    <li class="well-db" ng-class="{active:currentDB && !currentCollection}">
        <a ng-click="selectdb(currentDB)">
            {{currentDB}} ({{ currentDBSize | fileSize }})<br/>
            <span>Collections ({{collections.length}})</span>
        </a>
    </li>
    <li ng-repeat="collection in collections" class="item-collection" ng-class="{active:collection == currentCollection}">
        <a ng-click="selectCollection(collection)">{{collection}}</a>
    </li>
</ul>
<ul class="well" ng-show="!currentDB">
    <li><a href="#" ng-click="createDB()"><i class="icon-plus icon-white"></i> Create DB</a></li>
    <li><a href="#" ng-click="createDB()"><i class="icon-download-alt icon-white"></i> Import DB</a></li>
    <li class="well-db" ng-repeat="db in databases" class="item" ng-class="{active: db.name == currentDB}">
        <a href="#" ng-click="selectdb(db.name)">
            <strong>{{db.name}}</strong> <em>({{db.sizeOnDisk | fileSize}})</em><br/>
            <span>Collections ({{collections.length}})</span>
        </a>
    </li>
</ul>