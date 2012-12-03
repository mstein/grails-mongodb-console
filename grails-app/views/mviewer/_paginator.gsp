<div class="pagination" ng-controller="PaginatorCtrl" ng-init="init(${varTotal})" ng-show="currentCollection">
  {{totalEntries = ${varTotal}; ''}}
  <ul>
    <li ng-class="{disabled: currentPage == 1}"><a ng-click="previous()"> « </a></li>
    <li ng-class="{active: currentPage == (n)}" ng-repeat="n in pages()">
      <a ng-click="select(n)">{{n}}</a>
    </li>
    <li ng-class="{disabled: currentPage == totalPage()}"><a ng-click="next()"> » </a></li>
  </ul>
</div>