<div class="modal hide fade" id="renameACol">
    <div class="modal-header">
        <button type="button" class="close" ng-click="cancel()">&times;</button>
        <h4>Rename a collection</h4>
    </div>
    <div class="modal-content">
        <form class="form-horizontal">
            <div class="control-group">
                <label class="control-label" for="rename-a-col">Name</label>
                <div class="controls">
                    <input type="text" id="rename-a-col" ng-model="renColName" value="{{renamingACol}}"/>
                </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <a class="btn btn-primary" ng-click="validateAColnameChange(renColName)"><i class="icon-ok icon-white"></i> Rename</a>
        <a class="btn" ng-click="cancel()"><i class="icon-remove"></i> Cancel</a>
    </div>
</div>
