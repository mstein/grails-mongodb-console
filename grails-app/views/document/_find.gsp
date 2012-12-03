<div class="find" ng-show="currentCollection">
  <div class="input-prepend input-append" style="padding:0;">
    <div class="btn-group">
      <button class="btn btn-inverse dropdown-toggle" data-toggle="dropdown" ng-init="currentAction = 'find'; findQuery = ''">
        {{currentAction}}
        <b class="caret"></b>
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenu">
        <li ng-class="{active:currentAction == action}" ng-repeat="(action, input) in queriesActionsFilters">
          <a ng-click="$parent.currentAction = action">{{action}}</a>
        </li>
      </ul>
    </div>

    <mongo-queries mg-in="queriesInputs" mg-filters="queriesActionsFilters" mg-current="currentAction"/>
  </div>
</div>