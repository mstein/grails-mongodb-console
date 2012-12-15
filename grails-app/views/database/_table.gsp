<div class="title-buttons">
    <div class="title">
        <span>Databases</span>
    </div>

    <div ng-show="!currentDB && !currentCollection" class="nav-buttons">
        <a class="btn btn-icon" ng-click="createDB()"><i class="icon-plus"></i> Create DB</a>
        <a class="btn btn-icon"><i class="icon-download-alt"></i> Import DB</a>
    </div>
</div>

<div class="main">
    <table class="table table-clickable database">
        <thead>
        <tr>
            <th width="10px">&nbsp;</th>
            <th>Name</th>
            <th>Collections</th>
            <th>Size</th>
            <th width="40px">&nbsp;</th>
        </tr>
        </thead>
        <tbody>
        <tr ng-repeat="db in databases" class="item" ng-class="{active: db.name == currentDB}">
            <td width="10px">
                <input type="checkbox" />
            </td>
            <td ng-click="selectdb(db.name)"><a ng-click="selectdb(db.name)" href="${createLink(controller:'mongo')}/{{db.name}}">{{db.name}}</a></td>
            <td ng-click="selectdb(db.name)">&nbsp;</td>
            <td ng-click="selectdb(db.name)">{{db.sizeOnDisk | fileSize}}</td>
            <td width="40px">
                <a href="#"><i class="icon-edit"></i></a>
                <a href="#"><i class="icon-trash"></i></a>
            </td>
        </tr>
        </tbody>
    </table>
</div>