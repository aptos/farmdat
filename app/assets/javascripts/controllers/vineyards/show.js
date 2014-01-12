function VineyardShowCtrl($scope, Restangular, $routeParams, $location,$timeout, Elevation) {

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
          name: 'Satellite',
          layerType: 'HYBRID',
          type: 'google'
        },
        googleRoadmap: {
          name: 'Streets',
          layerType: 'ROADMAP',
          type: 'google'
        },
        googleTerrain: {
          name: 'Terrain',
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

  $scope.$on('leafletDirectiveMarker.dragend', function(event, args){
    $scope.latlong = [$scope.m1.lat, $scope.m1.lng];
    Elevation.location($scope.latlong).then(function (elevation) {
      $scope.vineyard.elevation = elevation;
    });
  });

  $scope.edit = function () {
    $location.path("vineyards/edit/" + $scope.vineyard._id);
  };

  var wp_base_url = "http://en.wikipedia.org/wiki/";

  Restangular.one('vineyards',$routeParams.id).get().then(function (data) {
    $scope.vineyard = data;
    $scope.latlong = $scope.vineyard.latlong;
    $scope.ava_url = (!!$scope.vineyard.appellation) ? wp_base_url + $scope.vineyard.appellation.replace("/\s/g","_") : wp_base_url + "Category:American_Viticultural_Areas";
    $timeout($scope.update_markers, 1000);
    $timeout($scope.update_center, 1000);
  });

}
VineyardShowCtrl.$inject = ['$scope', 'Restangular', '$routeParams', '$location','$timeout', 'Elevation'];