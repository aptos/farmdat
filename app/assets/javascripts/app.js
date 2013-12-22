//= require header
//= require_tree ./controllers
//= require filters
//= require_tree ./directives
//= require_tree ./services
//= require_self

var farmdatModule = angular.module('farmdat',
  ['ui.bootstrap', 'farmdatDirectives', 'farmdatServices', 'farmdatFilters']);

farmdatModule.config(['$routeProvider',function($routeProvider) {
  $routeProvider.
  // Start
  when('/start',{templateUrl: 'assets/start.html', controller: StartCtrl}).
    // Default
  otherwise({templateUrl: 'assets/start.html', controller: StartCtrl});
}])
.config(["$httpProvider", function(provider) {
  provider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content'),
  provider.defaults.headers.common['Content-Type'] = 'application/json',
    // loading indicator and message
    provider.responseInterceptors.push('myHttpInterceptor')
}]);