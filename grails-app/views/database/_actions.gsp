<div ng-show="currentDB && !currentCollection" class="head-actions">
    <a class="btn" href="#" ng-click="copyDB()"><i class="icon-repeat"></i> Copy DB</a>
    <a class="btn" href="#" ng-click="dropDB()"><i class="icon-trash"></i> Drop DB</a>
    <a class="btn" href="#" ng-click="createCol('create-new-col')"><i class="icon-plus"></i> Create Collection</a>
    <a class="btn" href="#" ng-click=""><i class="icon-download-alt"></i> Import</a>
    <a class="btn" href="#" ng-click=""><i class="icon-share"></i> Export</a>
</div>