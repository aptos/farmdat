function VineyardEditCtrl($scope, $debounce, $routeParams, $location, Restangular) {

  $scope.saveInProgress = false;
  var saveFinished = function () {_.delay( function() {$scope.saveInProgress = false; $scope.$apply();}, 500)};

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

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (data) {
        $scope.latlong = [data.coords.latitude, data.coords.longitude];
      },
      function (error) {
        console.info("navigator.geolocation error", error);
      }
      );
  }

  $scope.$watch('latlong', function () {
    if (!$scope.latlong || !$scope.vineyard) return;
    console.info("latlong", $scope.latlong);
    $scope.vineyard.latlong = $scope.latlong;
    $scope.center.lat = $scope.latlong[0];
    $scope.center.lng = $scope.latlong[1];
    $scope.markers.m1 = {lat: $scope.latlong[0], lng: $scope.latlong[1], focus: true, draggable: true};
    $scope.center.zoom = 15;
  });

  if ($routeParams.id) {
    console.info("get",$routeParams.id )
    $scope.saveInProgress = true;
    Restangular.one('vineyards',$routeParams.id).get().then(function (data) {
      $scope.vineyard = data;
      $scope.latLong = $scope.vineyard.latlong;
      $scope.saveInProgress = false;
    }, saveFinished);
  } else {
    $scope.vineyard = {
      blocks: [{number: 1}]
    }
  }

  var saveUpdates = function (newVal, oldVal) {
    if ((newVal != oldVal) && ($scope.vineyardEditForm.$valid) && (!$scope.saveInProgress)) {
      $scope.saveInProgress = true;
      if ($scope.vineyard._id) {
        console.info("put...", $scope.vineyard);
        $scope.vineyard.put().then(saveFinished,saveFinished);
      } else {
        Restangular.all('vineyards').post($scope.vineyard).then(function (data) {
          console.info("post...", $scope.vineyard);
          $scope.vineyard = Restangular.copy(data);
          $scope.saveInProgress = false;
          $location.path($location.path() + "/" + $scope.vineyard._id);
        }, saveFinished);
      }
    }
  };
  $scope.$watch('vineyard', $debounce(saveUpdates, 2000), true);
}
VineyardEditCtrl.$inject = ['$scope', '$debounce','$routeParams','$location','Restangular'];