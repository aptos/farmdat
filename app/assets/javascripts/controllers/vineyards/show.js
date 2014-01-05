function VineyardShowCtrl($scope, Restangular, $routeParams, $location,$timeout) {

 angular.extend($scope, {
    defaults: {
      touchZoom: false,
      scrollWheelZoom: false,
      minZoom: 3
    },
    center: {
      lat: 36.97,
      lng: -121.89,
      zoom: 10
    },
    markers: {
      m1: {
        lat: 36.97,
        lng: -121.89,
        focus: true,
        draggable: true
      }
    },
    layers: {
      baselayers: {
        googleHybrid: {
          name: 'Google Hybrid',
          layerType: 'HYBRID',
          type: 'google'
        },
        googleRoadmap: {
          name: 'Google Streets',
          layerType: 'ROADMAP',
          type: 'google'
        },
        googleTerrain: {
          name: 'Google Terrain',
          layerType: 'TERRAIN',
          type: 'google'
        },
      }
    }
  });

  $scope.update_markers = function () {
    $scope.center.lat = $scope.markers.m1.lat = $scope.latlong[0];
    $scope.center.lng = $scope.markers.m1.lng = $scope.latlong[1];
    $scope.center.zoom = ($scope.center.zoom < 15) ? 15 : $scope.center.zoom ;
    angular.extend($scope,$scope.markers) ;
    $scope.$safeApply();
  };

  $scope.update_center = function () {
    $scope.center = $scope.vineyard.center;
    $scope.$safeApply();
  };

  $scope.edit = function () {
    $location.path("vineyards/edit/" + $scope.vineyard._id);
  };

  Restangular.one('vineyards',$routeParams.id).get().then(function (data) {
    $scope.vineyard = data;
    $scope.latlong = $scope.vineyard.latlong;
    $timeout($scope.update_markers, 1000);
    $timeout($scope.update_center, 1000);
  });

}
VineyardShowCtrl.$inject = ['$scope', 'Restangular', '$routeParams', '$location','$timeout'];