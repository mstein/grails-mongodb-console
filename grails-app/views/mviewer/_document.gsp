<div class="document-entry span5 editable-{{editMode}}" ng-repeat="document in documents">
  <div class="identifier">
    <label>
      <input type="checkbox" value="{{document._id}}"/>
      Object ID : {{document._id}}
    </label>
  </div>
  <div class="actions">
    <a class="btn btn-small" ng-click="setEditable('json-response-'+document._id)"><i class="icon-pencil"></i></a>
    <a class="btn btn-small"><i class="icon-trash"></i></a>
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