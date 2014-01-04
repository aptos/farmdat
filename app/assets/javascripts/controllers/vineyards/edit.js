function VineyardEditCtrl($rootScope, $scope, $debounce, $routeParams, $location, Restangular, $log, $timeout, Elevation) {

  $scope.saveInProgress = false;
  var saveFinished = function () {_.delay( function() {$scope.saveInProgress = false; $scope.$apply();}, 500); };

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
    $scope.update_markers();
    Elevation.location($scope.latlong).then(function (elevation) {
      $scope.vineyard.elevation = elevation;
    });
  });

  $scope.update_markers = function () {
    $scope.vineyard.latlong = $scope.latlong;
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
  });

  $scope.add_block = function () {
    $scope.vineyard.blocks.push({id: $scope.vineyard.blocks.length});
  };

  $scope.delete_block = function (index) {
    $scope.vineyard.blocks.splice(index, 1);
    _.foreEach($scope.vineyard.blocks, function (block, index) {
      block.id = index;
    });
  };

  if (!!$routeParams && $routeParams.id) {
    $scope.saveInProgress = true;
    Restangular.one('vineyards',$routeParams.id).get().then(function (data) {
      $scope.vineyard = data;
      $scope.latlong = $scope.vineyard.latlong;
      $scope.saveInProgress = false;
      $timeout($scope.update_markers, 1000);
      $timeout($scope.update_center, 1000);
    }, saveFinished);
  } else {
    $scope.vineyard = {
      blocks: [{id: 1}],
      // image_url: "/assets/welcome.jpg"
    };
    get_location();
  }

  $scope.header_image = function () {
    return "image-src style='background-image: url('" + vineyard.image_url + "')";
  };

  var saveUpdates = function (newVal, oldVal) {
    if ((newVal != oldVal) && ($scope.vineyardEditForm.$valid) && (!$scope.saveInProgress)) {
      $scope.saveInProgress = true;
      $scope.vineyard.center = $scope.center;
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

  $scope.upload_options = {
    getOptionsUri: '/signed_url',
    filetype: 'image.*',
    maxSize: [960, 1200]
  };

  $scope.publish = function () {
    $scope.vineyard.published = true;
  };

  $scope.delete_me = function () {
    console.info("delete requested!");
    $scope.saveInProgress = true;
    $scope.vineyard.remove().then($location.path("/"));
  };
}
VineyardEditCtrl.$inject = ['$rootScope','$scope', '$debounce','$routeParams','$location','Restangular', '$log', '$timeout', 'Elevation'];