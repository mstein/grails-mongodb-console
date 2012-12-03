<script type="text/javascript">
  var GrailsModule = angular.module('GrailsModule', []);
  GrailsModule.factory('grails', ['$http', function($http) {
    var definition = {
      resourceBasePath:'${resource()}',
      contextPath:'${request.contextPath}'
    };

    var functions = {
      resource:function (dir, file) {
        return definition.resourceBasePath + '/' + dir + '/' + file;
      }
    };
    angular.extend(definition, functions);
    return definition;
  }]);
</script>