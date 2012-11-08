
<div class="title">
    <a ng-click="selectdb(currentDB)">{{currentDB}}</a>
    <span class="divider"></span>
    <span>{{currentCollection}}</span>
</div>

<div ng-show="currentCollection" class="page-actions" style="margin-bottom:10px">
    <a class="btn" href="#" ng-click="renameCol('rename-new-col')"><i class="icon-edit"></i> Rename Collection</a>
    <a class="btn" href="#" ng-click="dropCol()"><i class="icon-trash"></i> Drop Collection</a>
    <a class="btn" href="#" ng-click="createDoc()"><i class="icon-plus"></i> New document</a>
    <a class="btn" href="#" ng-click=""><i class="icon-share"></i> Export results</a>
    <a class="btn" href="#" ng-click=""><i class="icon-th-list"></i> Ensure Index</a>
    <a class="btn" href="#" ng-click=""><i class="icon-refresh"></i> Re-index</a>
</div>

<g:render template="/document/find" />
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