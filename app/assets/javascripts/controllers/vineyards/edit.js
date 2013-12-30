function VineyardEditCtrl($scope, $debounce, $routeParams, Restangular) {

  var saveInProgress = false;
  var saveFinished = function () { saveInProgress = false; };

  angular.extend($scope, {
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
        googleTerrain: {
          name: 'Google Terrain',
          layerType: 'TERRAIN',
          type: 'google'
        },
        googleHybrid: {
          name: 'Google Hybrid',
          layerType: 'HYBRID',
          type: 'google'
        },
        googleRoadmap: {
          name: 'Google Streets',
          layerType: 'ROADMAP',
          type: 'google'
        }
      }
    }
  });

  $scope.$watch('latlong', function () {
    if (!$scope.latlong) return;
    console.info("latlong", $scope.latlong);
    $scope.vineyard.latlong = $scope.latlong;
    $scope.center.lat = $scope.markers.m1.lat = $scope.latlong[0];
    $scope.center.lng = $scope.markers.m1.lng = $scope.latlong[1];
    $scope.center.zoom = 15;
  })

  if ($routeParams.id) {
    console.info("get",$routeParams.id )
    saveInProgress = true;
    Restangular.one('vineyards',$routeParams.id).get().then(function (data) {
      $scope.vineyard = data;
      $scope.latLong = $scope.vineyard.latlong;
      saveInProgress = false;
    }, saveFinished);
  }

  var saveUpdates = function (newVal, oldVal) {
    if ((newVal != oldVal) && ($scope.vineyardEditForm.$valid) && (!saveInProgress)) {
      saveInProgress = true;
      if ($scope.vineyard._id) {
        console.info("put...", $scope.vineyard);
        $scope.vineyard.put().then(saveFinished,saveFinished);
      } else {
        Restangular.all('vineyards').post($scope.vineyard).then(function (data) {
          console.info("post...", $scope.vineyard);
          $scope.vineyard = Restangular.copy(data);
          saveInProgress = false;
        }, saveFinished);
      }
    }
  };
  $scope.$watch('vineyard', $debounce(saveUpdates, 2000), true);
}
VineyardEditCtrl.$inject = ['$scope', '$debounce','$routeParams','Restangular'];