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