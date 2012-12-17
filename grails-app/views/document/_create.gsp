<div class="modal modal-large hide fade" id="createDoc">
  <div class="modal-header">
    <button type="button" class="close" ng-click="cancel();setEditable('new-doc',false);">&times;</button>
    <h4>Create a document</h4>
  </div>
  <div>
          <div id="new-doc" style="width:700px; height:300px; position:relative;">{
  "field":"value"
}</div>
  </div>
  <div class="modal-footer">
    <a class="btn btn-primary" ng-click="validateCreateDocument()"><i class="icon-ok icon-white"></i> Create</a>
    <a class="btn cancel" ng-click="cancel();setEditable('new-doc',false);"><i class="icon-remove"></i> Cancel</a>
  </div>
</div>