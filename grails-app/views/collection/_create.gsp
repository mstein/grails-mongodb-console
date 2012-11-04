<div class="modal" ng-show="!renamingCol && creatingCol">
    <div class="modal-header">
        <button type="button" class="close" ng-click="cancel()">&times;</button>
        <h3>Create a collection</h3>
    </div>
    <div class="modal-content">
        <form class="form-horizontal">
            <div class="control-group">
                <label class="control-label" for="create-new-col">Name</label>
                <div class="controls">
                    <input type="text" id="create-new-col" ng-model="newColname" value="{{newColName}}"/>
                </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <a class="btn btn-primary" href="#" ng-click="validateCreateCollection()"><i class="icon-ok icon-white"></i> Create</a>
        <a class="btn" href="#" ng-click="cancel()"><i class="icon-remove"></i> Cancel</a>
    </div>
</div>