<div class="title-buttons">
  <div class="title">
    <div class="dropdown">
      <a class="dropdown-toggle" data-toggle="dropdown">
        {{currentDB()}}
        <b class="caret"></b>
      </a>
      <ul class="dropdown-menu" role="menu">
        <li><a ng-click="changePath('/mongo/' + currentDB())"> File Buckets</a></li>
        <li class="divider"></li>
        <li><a ng-click="copyDB()"><i class="icon-repeat"></i> Copy DB</a></li>
        <li><a ng-click="dropDB()"><i class="icon-trash"></i> Drop DB</a></li>
        <li class="divider"></li>
        <li><a ng-click="createCol('create-new-col')"><i class="icon-plus"></i> Create File Bucket</a></li>
        <li class="divider"></li>
        <li><a ng-click=""><i class="icon-download-alt"></i> Import</a></li>
        <li><a ng-click=""><i class="icon-share"></i> Export</a></li>
      </ul>
    </div>
    <span class="divider"></span>
    <span ng-show="!renamingCol">{{currentBucket()}}</span>

    <div class="rename input-append" ng-show="renamingCol">
      <div class="btn-group">
        <input type="text" class="span3" id="rename-new-col" ng-model="renColName" value="{{renColName}}" ui-event="{keypress: 'onKeypressRename($event, renColName)'}" />
        <button class="btn btn-primary" ng-click="validateColnameChange(renColName)">
          <i class="icon-white icon-ok"></i>
        </button>
        <button class="btn" ng-click="cancel()">
          <i class="icon-remove"></i>
        </button>
      </div>
    </div>
  </div>

  <div ng-show="currentCollection()" class="nav-buttons">
    <a class="btn btn-icon" ng-click="dropCol()"><i class="icon-trash"></i> Drop</a>
    <a class="btn btn-icon" ng-click="createDoc()"><i class="icon-plus"></i> New document</a>
    <a class="btn btn-icon" ng-click=""><i class="icon-share"></i> Export results</a>
    <a class="btn btn-icon" ng-click=""><i class="icon-th-list"></i> Ensure Index</a>
    <a class="btn btn-icon" ng-click=""><i class="icon-refresh"></i> Re-index</a>
    <span class="divider"></span>
    <a class="btn btn-icon" ng-class="{disabled: (!countDocumentsSelected)}" ng-click="dropDocuments()"><i class="icon-trash"></i> Drop documents</a>
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
    <tr ng-repeat="file in files()">
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