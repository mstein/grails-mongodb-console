function FileUploadCtrl($scope) {
    $scope.uploadedFiles = [];

    $scope.fileList = function() {
        var fileList = [];
        angular.forEach($scope.uploadedFiles, function(data, index){
            angular.forEach(data.files, function(file, i){
                fileList.push(file);
            });
        });
        return fileList;
    };

    $scope.submit = function() {
        angular.forEach($scope.uploadedFiles, function(data, index) {
            data.scope = $scope;
            data.submit();
        });
    };

    $scope.cancel = function() {
        $scope.uploadedFiles = [];
        if(typeof $scope.$parent.cancel === "function") {
            $scope.$parent.cancel();
        }
    };
}

MongoDBConsoleModule.directive('fileUpload', function factory() {
    return {
        transclude:false,
        restrict:'EA',
        scope:true,
        replace:false,
        controller:FileUploadCtrl,
        link:function(scope, element, attrs) {
            var config = {};
            if(!angular.isDefined(attrs.autoUpload) || scope.$parent.$eval(attrs.autoUpload) == false) {
                // The add callback is overriden to prevent the automatic submit
                config['add'] = function(e, data) {
                    scope.uploadedFiles.push(data);
                    scope.$apply();
                };
            }
            if(angular.isDefined(attrs.dropZone)) {
                var elem = attrs.dropZone;
                if(elem == 'this') { elem = element; }
                config['dropZone'] = $(elem);
                $(elem).on("dragenter",function(e) {
                    $(e.delegateTarget).addClass('fileupload-dragenter');
                });
                $(elem).on('dragleave', function(e){
                    $(e.delegateTarget).removeClass('fileupload-dragover');
                });
                $(elem).on('dragend', function(e){
                    $(e.delegateTarget).removeClass('fileupload-dragover');
                });
            }

            // Initialize the fileupload element & forward events
            $(element).fileupload(config).on([
                'fileuploadadd',
                'fileuploadsubmit',
                'fileuploadsend',
                'fileuploaddone',
                'fileuploadfail',
                'fileuploadalways',
                'fileuploadprogress',
                'fileuploadprogressall',
                'fileuploadstart',
                'fileuploadstop',
                'fileuploadchange',
                'fileuploadpaste',
                'fileuploaddrop',
                'fileuploaddragover',
                'fileuploadchunksend',
                'fileuploadchunkdone',
                'fileuploadchunkfail',
                'fileuploadchunkalways',
                'fileuploadprocessstart',
                'fileuploadprocess',
                'fileuploadprocessdone',
                'fileuploadprocessfail',
                'fileuploadprocessalways',
                'fileuploadprocessstop'
            ].join(' '), function (e, data) {
                scope.$emit(e.type, data);
            });
        }
    };
});