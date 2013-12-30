//= require header
//= require_tree ./controllers
//require filters
//= require_tree ./directives
//= require_tree ./services
//= require_self

var farmdatModule = angular.module('farmdat',['ngRoute','ngAnimate','ngSanitize','ngDebounce','ui.bootstrap',
  ,'restangular','farmdatServices', 'maps', 'leaflet-directive']);
  // 'farmdatFilters']);

farmdatModule.config(['$routeProvider',function($routeProvider) {
  $routeProvider.
  // Start
  when('/start',{templateUrl: 'assets/welcome.html', controller: StartCtrl}).
  // when('/vineyards',{templateUrl: 'assets/vineyards/index.html', controller: VineyardListCtrl}).
  when('/vineyards/edit',{templateUrl: 'assets/vineyards/edit.html', controller: VineyardEditCtrl}).
  when('/vineyards/edit/:id',{templateUrl: 'assets/vineyards/edit.html', controller: VineyardEditCtrl}).
    // Default
    otherwise({templateUrl: 'assets/welcome.html', controller: StartCtrl});
  }])
.config(["$httpProvider", function(provider) {
  provider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content'),
  provider.defaults.headers.common['Content-Type'] = 'application/json',
    // loading indicator and message
    provider.responseInterceptors.push('myHttpInterceptor');
  }])
.config(['RestangularProvider', function(provider) {
  provider.setRestangularFields({ id: "_id" })
  }]);