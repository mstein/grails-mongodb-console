<div class="title">
    <span>Databases</span>
</div>

<div ng-show="!currentDB && !currentCollection" class="page-actions">
    <a class="btn" ng-click="createDB()"><i class="icon-plus"></i> Create DB</a>
    <a class="btn" ng-click="createDB()"><i class="icon-download-alt"></i> Import DB</a>
</div>

<div class="main">
    <table class="table table-clickable">
        <thead>
        <tr>
            <th>Name</th>
            <th>Collections</th>
            <th>Size</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr ng-repeat="db in databases" class="item" ng-class="{active: db.name == currentDB}">
            <td ng-click="selectdb(db.name)"><a ng-click="selectdb(db.name)">{{db.name}}</a></td>
            <td ng-click="selectdb(db.name)">&nbsp;</td>
            <td ng-click="selectdb(db.name)">{{db.sizeOnDisk | fileSize}}</td>
            <td>&nbsp;</td>
        </tr>
        </tbody>
    </table>
</div>