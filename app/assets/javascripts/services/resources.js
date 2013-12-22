var farmdatServices = angular.module('farmdatServices');

farmdatServices.factory('Profile', ['$resource', function($resource){
  return $resource('profile', {}, {
    'get': { method:'GET' }
  });
}]);