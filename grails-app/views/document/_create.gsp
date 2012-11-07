<div class="modal hide" id="createDoc" style="width:700px; ">
  <div class="modal-header">
    <button type="button" class="close" ng-click="cancel()">&times;</button>
    <h4>Create a document</h4>
  </div>
  <div class="modal-content">
    <form class="form-horizontal">
      <div class="control-group">
        <label class="control-label" for="new-doc">New document</label>
          <div id="new-doc" style="width:700px; height:300px; position:relative;">{
  "field":"value"
}</div>
      </div>
    </form>
  </div>
  <div class="modal-footer">
    <a class="btn btn-primary" href="#" ng-click="validateCreateDocument()"><i class="icon-ok icon-white"></i> Create</a>
    <a class="btn" href="#" ng-click="cancel()"><i class="icon-remove"></i> Cancel</a>
  </div>
</div>