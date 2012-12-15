<script type="text/javascript">
  var GrailsModule = angular.module('GrailsModule', []);
  GrailsModule.provider('grails', function() {
    var definition = {
      resourceBasePath:'${resource()}',
      contextPath:'${request.contextPath}'
    };

    var functions = {
      resource:function (dir, file) {
        return definition.resourceBasePath + '/' + dir + '/' + file;
      },
      createLink:function(params) {
        var controller = params.controller != undefined ? params.controller : '${controllerName}' ;
        var action = params.action != undefined ? params.action : '${actionName}';
        var url = definition.contextPath + '/' + controller + '/' + action;

        var id = params.id != undefined ? params.id : null;

        if(id) {
          url += '/'+id;
        }

        if(params.params != undefined && typeof params.params === "object") {
          url += "?" + $.param(params.params);
        }

        return url;
      }
    };

    angular.extend(definition, functions);
    angular.extend(this, definition);

    this.$get = function(){
      return definition ;
    };

  });
</script>