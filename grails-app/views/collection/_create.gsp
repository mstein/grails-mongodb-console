<div class="modal hide fade" id="createCol">
    <div class="modal-header">
        <button type="button" class="close" ng-click="cancel()">&times;</button>
        <h4>Create a collection</h4>
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
        <a class="btn btn-primary" ng-click="validateCreateCollection()"><i class="icon-ok icon-white"></i> Create</a>
        <a class="btn" ng-click="cancel()"><i class="icon-remove"></i> Cancel</a>
    </div>
</div>