<table class="table table-clickable">
    <thead>
    <tr>
        <th>Name</th>
        <th>Collection</th>
        <th>Size</th>
        <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <tr ng-repeat="db in databases" class="item {{activeDB(db)}}">
        <td ng-click="selectdb(db.name)"><a ng-click="selectdb(db.name)">{{db.name}}</a></td>
        <td ng-click="selectdb(db.name)">{{fileSize}}</td>
        <td ng-click="selectdb(db.name)">{{fileSize}}</td>
        <td>{{fileSize}}</td>
    </tr>
    </tbody>
</table>