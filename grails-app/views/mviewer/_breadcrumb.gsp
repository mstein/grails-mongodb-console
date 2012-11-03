<div class="navbar" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html">
  <div class="navbar-inner">
    <ul class="nav">
      <li class="dropdown">
        <a class="dropdown-toggle" data-toggle="dropdown">DB <b class="caret"></b></a>
        <ul class="dropdown-menu">
          <li><a href="#" ng-click="createDB()"><i class="icon-plus"></i> Create DB</a></li>
          <li class="divider"></li>
          <li class="nav-header">Database(s) ({{totalSize | fileSize}})</li>
          <li ng-repeat="db in databases">
            <a class="lockClick" href="#" ng-click="selectdb(db.name)"> <strong>{{db.name}}</strong> <em>({{db.sizeOnDisk | fileSize}})</em></a>
          </li>
        </ul>
      </li>

      <li class="divider-vertical" ng-show="currentDB != null || creatingDB"></li>

      <li class="dropdown" ng-show="currentDB != null && !copyingDB && !creatingDB">
        <a class="dropdown-toggle" data-toggle="dropdown">
          {{currentDB}} <b class="caret"></b>
        </a>

        <ul class="dropdown-menu">
          <li><a href="#" ng-click="copyDB()"><i class="icon-repeat"></i> Copy DB</a></li>
          <li><a href="#" ng-click="dropDB()"><i class="icon-trash"></i> Drop DB</a></li>
          <li class="divider"></li>
          <li><a href="#" ng-click="createCol('create-new-col')"><i class="icon-plus"></i> Create Collection</a></li>
          <li><a href="#" ng-click=""><i class="icon-download-alt"></i> Import</a></li>
          <li><a href="#" ng-click=""><i class="icon-share"></i> Export</a></li>
        </ul>
      </li>

      <li class="navbar-form input-append" ng-show="creatingDB && !copyingDB">
        <input type="text" class="span9" ng-model="newDbname" value=""/>
        <a class="btn" href="#" ng-click="validateDBCreation()"><i class="icon-ok"></i></a>
        <a class="btn" href="#" ng-click="cancel()"><i class="icon-remove"></i></a>
      </li>

      <li class="navbar-form input-append" ng-show="copyingDB && !creatingDB">
        <input type="text" class="span9" value="{{currentDB}}-copy"/>
        <a class="btn" href="#"><i class="icon-ok"></i></a>
        <a class="btn" href="#" ng-click="cancel()"><i class="icon-remove"></i></a>
      </li>

      <li class="divider-vertical" ng-show="currentCollection != null || creatingCol"></li>

      <li class="dropdown" ng-show="currentCollection != null && !renamingCol && !creatingCol">
        <a class="dropdown-toggle" data-toggle="dropdown">{{currentCollection}} <b class="caret"></b></a>
        <ul class="dropdown-menu">
          <li><a href="#" ng-click="renameCol('rename-new-col')"><i class="icon-edit"></i> Rename Collection</a></li>
          <li><a href="#" ng-click="dropCol()"><i class="icon-trash"></i> Drop Collection</a></li>
          <li class="divider"></li>
          <li><a href="#"><i class="icon-plus"></i> New document</a></li>
        </ul>
      </li>

      <li class="navbar-form input-append" ng-show="renamingCol && !creatingCol">
        <input type="text" id="rename-new-col" class="span9" ng-model="renColName" value="{{renColName}}"/>
        <a class="btn" href="#" ng-click="validateColnameChange()"><i class="icon-ok"></i></a>
        <a class="btn" href="#" ng-click="cancel()"><i class="icon-remove"></i></a>
      </li>

      <li class="navbar-form input-append" ng-show="!renamingCol && creatingCol">
        <input type="text" id="create-new-col" class="span9" ng-model="newColname" value="{{newColName}}"/>
        <a class="btn" href="#" ng-click="validateCreateCollection()"><i class="icon-ok"></i></a>
        <a class="btn" href="#" ng-click="cancel()"><i class="icon-remove"></i></a>
      </li>
    </ul>
  </div>

  <div class="outernav">
    <g:render template="paginator" model="[varTotal:'totalCount']"/>
  </div>
</div>