<ul class="well" ng-show="currentDB">
    <li class="well-mongo dropdown">
        <a class="dropdown-toggle" data-toggle="dropdown">
            Databases
            <i class="icon-white icon-chevron-right"></i>
        </a>
        <ul class="dropdown-menu">
            <li><a ng-click="createDB()"><i class="icon-plus"></i> Create DB</a></li>
            <li><a ng-click="createDB()"><i class="icon-download-alt"></i> Import DB</a></li>
            <li class="divider"></li>
            <li ng-repeat="db in databases" ng-class="{active: db.name == currentDB}">
                <a ng-click="selectdb(db.name)">
                    <strong>{{db.name}}</strong> <em>({{db.sizeOnDisk | fileSize}})</em><br/>
                </a>
            </li>

        </ul>
    </li>
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
    <li>
        <span>
            Mongo v2.2.0<br>
            Master shard<br>
            Uptime : 120 days<br>
            192.168.34.1:27017<br>
        </span>
    </li>
</ul>