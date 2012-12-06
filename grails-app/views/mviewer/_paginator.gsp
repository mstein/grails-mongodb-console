<div class="pagination" ng-controller="PaginatorCtrl" ng-init="init(${varTotal})" ng-show="currentCollection && totalEntries>0">
    {{totalEntries = ${varTotal}; ''}}
    <div class="left">Page <strong>{{currentPage}}</strong> of <strong>{{totalPage()}}</strong> - <strong>{{totalEntries}}</strong> documents</div>
    <ul class="right" ng-show="pages().length>1">
        <li ng-class="{disabled: currentPage == 1}"><a ng-click="previous()">« Previous</a></li>
        <li ng-class="{active: currentPage == (n)}" ng-repeat="n in pages()">
            <a ng-click="select(n)">{{n}}</a>
        </li>
        <li ng-class="{disabled: currentPage == totalPage()}"><a ng-click="next()">Next »</a></li>
    </ul>
</div>