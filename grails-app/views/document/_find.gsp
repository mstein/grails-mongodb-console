<div class="find" ng-show="currentCollection">
    <div class="input-prepend input-append" style="padding:0;">
        <div class="btn-group">
            <button class="btn btn-inverse dropdown-toggle" data-toggle="dropdown" ng-init="queryAction = 'find'; findQuery = ''">
                {{queryAction}}
                <b class="caret"></b>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu">
                <li><a href="#" ng-click="queryAction = 'find'"><i ng-class="{'icon-ok':queryAction == 'find'}"></i>find</a>
                </li>
                <li><a href="#" ng-click="queryAction = 'findOne'"><i ng-class="{'icon-ok':queryAction == 'findOne'}"></i>findOne
                </a></li>
            </ul>
        </div>

        <input class="span3" type="search" ng-model="findQuery" placeholder="example : 'field':'value', '$gt':{'age' : 18}"/>

        <button class="btn btn-inverse" ng-click="hasSort = !hasSort" ng-show="queryAction != 'findOne'">sort</button>
        <input class="span1" type="search" ng-model="sort" ng-show="hasSort && queryAction != 'findOne'" placeholder="n:1, a:-1"/>

        <button class="btn btn-inverse" ng-click="hasLimit = !hasLimit" ng-show="queryAction != 'findOne'">limit</button>
        <input class="span1" type="search" ng-model="limit" ng-show="hasLimit && queryAction != 'findOne'" placeholder="max"/>

        <button class="btn btn-inverse" ng-click="hasSkip = !hasSkip" ng-show="queryAction != 'findOne'">skip</button>
        <input class="span1" type="search" ng-model="skip" ng-show="hasSkip && queryAction != 'findOne'" placeholder="offset"/>

        <button class="btn btn-primary" ng-click="submitFindQuery()">Query</button>
    </div>
</div>