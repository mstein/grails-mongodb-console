<div class="col1">
  <ul class="well">
      <li class="well-mongo dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              Mongo
              <i class="icon-white icon-chevron-right"></i>
          </a>
          <ul class="dropdown-menu">
              <li><a href="#" ng-click="createDB()"><i class="icon-plus"></i> Create DB</a></li>
              <li><a href="#" ng-click="createDB()"><i class="icon-download-alt"></i> Import DB</a></li>
              <li class="divider"></li>
              <li ng-repeat="db in databases" class="item" ng-class="{active: db.name == currentDB}">
                  <a href="#" ng-click="selectdb(db.name)"><strong>{{db.name}}</strong> <em>({{db.sizeOnDisk | fileSize}})</em></a>
              </li>
          </ul>
      </li>
      <li class="well-header" ng-class="{active:currentDB && !currentCollection}" ng-show="currentDB">
          <a ng-click="selectdb(currentDB)">
              {{currentDB}} ({{ currentDBSize | fileSize }})<br/>
              <span>Collections ({{collections.length}})</span>
          </a>
      </li>
      <li ng-repeat="collection in collections" class="item-collection" ng-class="{active:collection == currentCollection}">
          <a ng-click="selectCollection(collection)">{{collection}}</a>
    </li>
  </ul>
</div>