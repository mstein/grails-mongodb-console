<g:render template="head"/>

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