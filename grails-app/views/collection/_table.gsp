<div class="title">
    <span>{{currentDB}}</span>
</div>

<div ng-show="currentDB && !currentCollection" class="page-actions">
    <a class="btn" ng-click="copyDB()"><i class="icon-repeat"></i> Copy DB</a>
    <a class="btn" ng-click="dropDB()"><i class="icon-trash"></i> Drop DB</a>
    <a class="btn" ng-click="createCol('create-new-col')"><i class="icon-plus"></i> Create Collection</a>
    <a class="btn" ng-click=""><i class="icon-download-alt"></i> Import</a>
    <a class="btn" ng-click=""><i class="icon-share"></i> Export</a>
</div>

<div class="main">
    <table class="table table-striped table-clickable">
        <thead>
        <tr>
            <th>Name</th>
            <th width="40px">&nbsp;</th>
        </tr>
        </thead>
        <tbody>

        <tr ng-repeat="collection in collections">
            <td ng-click="selectCollection(collection)"><a ng-click="selectCollection(collection)">{{collection}}</</td>
            <td width="10px" nowrap="nowrap">
                <a><i class="icon-pencil"></i></a>
                <a><i class="icon-trash"></i></a>
            </td>
        </tr>
        </tbody>
    </table>
</div>