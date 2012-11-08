<div class="find" ng-show="currentCollection">
  <div class="input-prepend input-append" style="padding:0;">
    <div class="btn-group">
      <button class="btn btn-inverse dropdown-toggle" data-toggle="dropdown" ng-init="currentAction = 'find'; findQuery = ''">
        {{currentAction}}
        <b class="caret"></b>
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenu">
        <li ng-class="{active:currentAction == action}" ng-repeat="action in queriesActions">
          <a href="#" ng-click="$parent.currentAction = action">{{action}}</a>
        </li>
      </ul>
    </div>

    <input class="span3" type="search" ng-model="findQuery" placeholder="example : 'field':'value', '$gt':{'age' : 18}"/>

    <button class="btn btn-inverse" ng-click="hasFields = !hasFields" ng-show="currentAction == 'find'">fields</button>
    <input class="span1" type="search" ng-model="fields" ng-show="hasFields && currentAction == 'find'" placeholder="'name':1, '_id':0"/>

    <button class="btn btn-inverse" ng-click="hasSort = !hasSort" ng-show="currentAction == 'find'">sort</button>
    <input class="span2" type="search" ng-model="sort" ng-show="hasSort && currentAction == 'find'" placeholder="n:1, a:-1"/>

    <button class="btn btn-inverse" ng-click="hasLimit = !hasLimit" ng-show="currentAction == 'find'">limit</button>
    <input class="span1" type="search" ng-model="limit" ng-show="hasLimit && currentAction == 'find'" placeholder="max"/>

    <button class="btn btn-inverse" ng-click="hasSkip = !hasSkip" ng-show="currentAction == 'find'">skip</button>
    <input class="span1" type="search" ng-model="skip" ng-show="hasSkip && currentAction == 'find'" placeholder="offset"/>

    <button class="btn btn-primary" ng-click="submitFindQuery()">Query</button>
  </div>
</div>