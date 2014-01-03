function VineyardEditCtrl($rootScope, $scope, $debounce, $routeParams, $location, Restangular, $log) {

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

  angular.extend($scope,$scope.markers) ;

  var get_location = function () {
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
  };

  $scope.$watch('latlong', function () {
    if (!$scope.latlong || !$scope.vineyard) return;
    $scope.vineyard.latlong = $scope.latlong;
    $scope.center.lat = $scope.latlong[0];
    $scope.center.lng = $scope.latlong[1];
    $scope.markers.m1 = {lat: $scope.latlong[0], lng: $scope.latlong[1], focus: true, draggable: true};
    $scope.center.zoom = 15;
    angular.extend($scope,$scope.markers) ;
  });

  $scope.$on('leafletDirectiveMarker.dragend', function(event, args){
    console.info("moved", $scope.m1)
    $scope.latlong = [$scope.m1.lat, $scope.m1.lng];
  });

  $scope.add_block = function () {
    $scope.vineyard.blocks.push({id: $scope.vineyard.blocks.length});
  };

  $scope.delete_block = function (index) {
    $scope.vineyard.blocks.splice(index, 1);
  };

  if (!!$routeParams && $routeParams.id) {
    $scope.saveInProgress = true;
    Restangular.one('vineyards',$routeParams.id).get().then(function (data) {
      $scope.vineyard = data;
      $scope.latlong = $scope.vineyard.latlong;
      $scope.saveInProgress = false;
    }, saveFinished);
  } else {
    $scope.vineyard = {
      blocks: [{id: 1}],
      image_url: "/assets/welcome.jpg"
    };
    get_location();
  }

  $scope.header_image = function () {
    return "image-src style='background-image: url('" + vineyard.image_url + "')";
  };

  var saveUpdates = function (newVal, oldVal) {
    if ((newVal != oldVal) && ($scope.vineyardEditForm.$valid) && (!$scope.saveInProgress)) {
      $scope.saveInProgress = true;
      if ($scope.vineyard._id) {
        $scope.vineyard.put().then(saveFinished,saveFinished);
      } else {
        Restangular.all('vineyards').post($scope.vineyard).then(function (data) {
          $scope.vineyard = Restangular.copy(data);
          $scope.saveInProgress = false;
          $location.path($location.path() + "/" + $scope.vineyard._id);
        }, saveFinished);
      }
    }
  };
  $scope.$watch('vineyard', $debounce(saveUpdates, 2000), true);

  $scope.publish = function () {
    $scope.vineyard.published = true;
  };

  $scope.delete_me = function () {
    console.info("delete requested!");
    $scope.saveInProgress = true;
    $scope.vineyard.remove().then($location.path("/"));
  };
}
VineyardEditCtrl.$inject = ['$rootScope','$scope', '$debounce','$routeParams','$location','Restangular', '$log'];