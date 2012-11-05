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
              <li ng-repeat="db in databases" class="item {{activeDB(db)}}">
                  <a href="#" ng-click="selectdb(db.name)"><strong>{{db.name}}</strong> <em>({{db.sizeOnDisk | fileSize}})</em></a>
              </li>
          </ul>
      </li>
      <li class="well-header {{isDbSelected()}}">
          <a ng-click="selectdb(currentDB)" ng-show="currentDB">
              {{currentDB}} ({{ currentDBSize | fileSize }})<br/>
              <span>Collections ({{collections.length}})</span>
          </a>
          <a href="#" ng-show="!currentDB">
            Selected a database<br />
            <span>Count : {{databases.length}}</span>
        </a>
    </li>
    <li ng-repeat="collection in collections" class="item-collection {{activeCollection(collection)}}">
      <a ng-click="selectCollection(collection)">{{collection}}</a>
    </li>
  </ul>
</div>