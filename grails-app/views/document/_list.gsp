
<div class="title">
    <a ng-click="selectdb(currentDB)">{{currentDB}}</a>
    <span class="divider"></span>
    <span>{{currentCollection}}</span>
    <span class="divider"></span>
    <div class="input-prepend input-append" style="padding:0; height:30px; margin:-6px;">
      <div class="btn-group">
        <button class="btn btn-inverse dropdown-toggle" data-toggle="dropdown" ng-init="queryAction = 'find'; findQuery = ''">
          {{queryAction}}
          <b class="caret"></b>
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenu">
          <li><a href="#" ng-click="queryAction = 'find'"><i ng-class="{'icon-ok':queryAction == 'find'}"></i>find</a></li>
          <li><a href="#" ng-click="queryAction = 'findOne'"><i ng-class="{'icon-ok':queryAction == 'findOne'}"></i>findOne</a></li>
        </ul>
      </div>

      <input class="span3" type="search" ng-model="findQuery" placeholder="example : 'field':'value', '$gt':{'age' : 18}"/>

      <button class="btn btn-inverse" ng-click="hasSort = !hasSort" ng-show="queryAction != 'findOne'"> sort </button>
      <input class="span1" type="search" ng-model="sort" ng-show="hasSort && queryAction != 'findOne'" placeholder="n:1, a:-1"/>

      <button class="btn btn-inverse" ng-click="hasLimit = !hasLimit" ng-show="queryAction != 'findOne'"> limit </button>
      <input class="span1" type="search" ng-model="limit" ng-show="hasLimit && queryAction != 'findOne'" placeholder="max"/>

      <button class="btn btn-inverse" ng-click="hasSkip = !hasSkip" ng-show="queryAction != 'findOne'"> skip </button>
      <input class="span1" type="search" ng-model="skip" ng-show="hasSkip && queryAction != 'findOne'" placeholder="offset"/>

      <button class="btn" ng-click="submitFindQuery()"> Query </button>
    </div>
</div>

<div ng-show="currentCollection" class="page-actions">
    <a class="btn" href="#" ng-click="renameCol('rename-new-col')"><i class="icon-edit"></i> Rename Collection</a>
    <a class="btn" href="#" ng-click="dropCol()"><i class="icon-trash"></i> Drop Collection</a>
    <a class="btn" href="#" ng-click="createDoc()"><i class="icon-plus"></i> New document</a>

</div>
<g:render template="/mviewer/paginator" model="[varTotal: 'totalCount']" />

<div class="main">
    <div class="document-entry editable-{{editMode}} doc-{{$index}}" ng-repeat="document in documents">
        <div class="head" ng-init="editMode = false">
            <label>
                <input type="checkbox" value="{{document._id.toString()}}"/>
                Object ID : <span class="mongo-object-id">{{document._id.toString()}}</span>
            </label>
            <div class="actions">
                <a ng-click="submitChange('json-document-'+document._id.toString(), document._id.toString(), document)" ng-show="editMode"><i class="icon-ok"></i></a>
                <a ng-click="setEditable('json-document-'+document._id.toString(), !editMode); editMode = !editMode" ng-class="{active: editMode}"><i class="icon-pencil"></i></a>
                <a><i class="icon-trash"></i></a>
            </div>
        </div>

        <pre id="json-document-{{document._id.toString()}}"
             style="position:relative; min-height: 200px; padding:0;"
             class="prettyprint json limited pre"
             ng-bind-html-unsafe="document | commonJson"></pre>
        %{--<div id="json-document-edit-{{document._id}}" ng-bind-html-unsafe="document | commonJson" style="display:none;"></div>--}%
    </div>
</div>