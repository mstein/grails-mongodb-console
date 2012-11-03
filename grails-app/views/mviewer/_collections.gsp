<div class="span2">
  <ul class="nav nav-list well">
    <li class="nav-header" ng-show="currentDB">{{currentDB}} ({{ currentDBSize | fileSize }})</li>
    <li class="nav-header" ng-show="currentDB">Collections ({{collections.length}})</li>
    <li class="nav-header" ng-show="!currentDB">No database selected</li>
    <li ng-repeat="collection in collections" class=" {{activeCollection(collection)}}">
      <a ng-click="selectCollection(collection)">{{collection}}</a>
    </li>
  </ul>
</div>