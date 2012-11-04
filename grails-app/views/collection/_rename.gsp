<div class="modal hide" id="renameCol">
    <div class="modal-header">
        <button type="button" class="close" ng-click="cancel()">&times;</button>
        <h4>Rename a collection</h4>
    </div>
    <div class="modal-content">
        <form class="form-horizontal">
            <div class="control-group">
                <label class="control-label" for="rename-new-col">Name</label>
                <div class="controls">
                    <input type="text" id="rename-new-col" ng-model="renColName" value="{{renColName}}"/>
                </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <a class="btn btn-primary" ng-click="validateColnameChange()"><i class="icon-ok icon-white"></i> Rename</a>
        <a class="btn" ng-click="cancel()"><i class="icon-remove"></i> Cancel</a>
    </div>
</div>
