<div class="document-entry editable-{{editMode}} doc-{{$index}}" ng-repeat="document in documents">
    <div class="head">
        <label>
            <input type="checkbox" value="{{document._id}}"/>
            Object ID : <span class="mongo-object-id">{{document._id}}</span>
        </label>
        <div class="actions">
            <a ng-click="setEditable('json-response-'+document._id)"><i class="icon-pencil"></i></a>
            <a><i class="icon-trash"></i></a>
        </div>
    </div>

    <pre id="json-response-{{document._id}}" class="prettyprint json limited" ng-bind-html-unsafe="document | commonJson"></pre>
    %{--<script>
      function setEditable(id) {
        var editor = ace.edit(id);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/json");
      }
    </script>--}%
</div>