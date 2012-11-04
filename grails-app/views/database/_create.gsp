<div class="modal" ng-show="creatingDB && !copyingDB">
    <div class="modal-header">
        <button type="button" class="close" ng-click="cancel()">&times;</button>
        <h3>Create a database</h3>
    </div>
    <div class="modal-content">
        <form class="form-horizontal">
            <div class="control-group">
                <label class="control-label" for="inputName">Name</label>
                <div class="controls">
                    <input type="text" id="inputName" ng-model="newDbname" placeholder="Name"/>
                </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <a class="btn btn-primary" href="#" ng-click="validateDBCreation()"><i class="icon-ok icon-white"></i> Create</a>
        <a class="btn" href="#" ng-click="cancel()"><i class="icon-remove"></i> Cancel</a>
    </div>
</div>
