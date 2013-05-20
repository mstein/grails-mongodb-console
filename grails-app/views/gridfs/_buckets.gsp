<div class="title-buttons">

  <div class="title">
    <span>{{currentDB()}}</span>
  </div>

  <div class="nav-buttons" ng-show="currentDB() && !currentCollection()">
    <a class="btn btn-icon" ng-click="dropDB()"><i class="icon-trash"></i> Drop DB</a>
    <a class="btn btn-icon" ng-click="copyDB()"><i class="icon-repeat"></i> Copy DB</a>
    <a class="btn btn-icon" ng-click="createCol('create-new-col')"><i class="icon-plus"></i> Create File Bucket</a>
    <a class="btn btn-icon" ng-click="importData('import-data-col')"><i class="icon-download-alt"></i> Import</a>
    <span class="divider"></span>
    <a class="btn btn-icon" ng-class="{disabled: (!countColSelected)}" ng-click="dropCols()"><i class="icon-trash"></i> Drop File Bucket</a>
    <a class="btn btn-icon" ng-class="{disabled: (!countColSelected)}" ng-click=""><i class="icon-share"></i> Export</a>
  </div>
</div>

<p ng-show="buckets().length==0">This database is empty. <a ng-click="createCol('create-new-col')">Create a File Bucket</a>.</p>
<div class="main" ng-show="buckets().length>0">
  <table class="table table-striped table-clickable">
    <thead>
    <tr>
      <th width="10px">&nbsp;</th>
      <th>Name</th>
      <th width="40px">&nbsp;</th>
    </tr>
    </thead>
    <tbody>
    <tr ng-repeat="bucket in buckets()">
      <td width="10px">
        <input type="checkbox" />
      </td>
      <td ng-click="changePath('/gridfs/'+currentDB()+'/'+bucket)">
        <a href="#/gridfs/{{currentDB()}}/{{bucket}}">{{bucket}}</a>
      </td>
      <td width="10px" nowrap="nowrap">
        <a ng-click="renameACol(bucket)"><i class="icon-edit"></i></a>
        <a ng-click="dropCol(bucket)"><i class="icon-trash"></i></a>
      </td>
    </tr>
    </tbody>
  </table>
</div>