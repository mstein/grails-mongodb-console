<g:render template="/mviewer/head"/>

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