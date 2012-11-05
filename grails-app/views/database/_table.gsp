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
    <tr ng-repeat="db in databases" class="item {{activeDB(db)}}">
        <td>{{db.name}}</td>
        <td>{{fileSize}}</td>
        <td>{{db.sizeOnDisk | fileSize}}</td>
        <td>{{fileSize}}</td>
    </tr>
    </tbody>
</table>