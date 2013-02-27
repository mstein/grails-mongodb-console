<div class="modal hide fade" id="importData">
  <div class="modal-header">
    <button type="button" class="close" ng-click="cancel()">&times;</button>
    <h4>Import data into a collection</h4>
  </div>
  <div class="modal-content">
    <form class="form-horizontal">
      <div class="control-group">
        <label class="control-label" for="import-data-col">Collection name</label>
        <div class="controls">
          <input type="text" id="import-data-col" ng-model="importIntoCol" value="{{importIntoCol}}"/>
        </div>
      </div>
      <div class="control-group">
        <label class="control-label" for="import-data-file">File</label>
        <div class="controls">
          <input type="file" id="import-data-file" name="importFile" data-url="${createLink(controller: 'mviewer', action:'importData')}" />
        </div>
      </div>
    </form>
  </div>
  <div class="modal-footer">
    <a class="btn btn-primary" ng-click="validateImportDataCollection(importIntoCol, 'import-data-file')"><i class="icon-ok icon-white"></i> Import</a>
    <a class="btn cancel" ng-click="cancel()"><i class="icon-remove"></i> Cancel</a>
  </div>
</div>