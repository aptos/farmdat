function LabSamplesCtrl($scope, $routeParams, $debounce, $location, Restangular) {

  $scope.saveInProgress = false;
  var saveFinished = function () {_.delay( function() {$scope.saveInProgress = false; $scope.$apply();}, 500); };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 0,
  };
  $scope.dateFormat = 'dd-MMMM-yyyy';

  $scope.vineyard_selected = function (id) {
    if (!id) return;
    $scope.blocks = $scope.blocklist[id];
  }

  $scope.blocklist = {};
  $scope.vineyard_list = [];
  Restangular.one('vineyards','mine').getList().then( function(list) {
    $scope.vineyard_list = list.map( function (vineyard) { return { value: vineyard._id, text: vineyard.name }; });
    angular.forEach(list, function (vineyard) {
      $scope.blocklist[vineyard._id] = vineyard.blocks.map( function (block) { return {value: block.name, text: block.name }; });
    });
  });

  var saveUpdates = function (newVal, oldVal) {
    if ((newVal != oldVal) && ($scope.sampleEditForm.$valid) && (!$scope.saveInProgress) ) {
      $scope.saveInProgress = true;
      if ($scope.sample._id) {
        $scope.sample.put().then(saveFinished,saveFinished);
      } else {
        Restangular.all('samples').post($scope.sample).then(function (data) {
          $scope.sample = Restangular.copy(data);
          $scope.saveInProgress = false;
        }, saveFinished);
      }
    }
  };
  $scope.$watch('sample', $debounce(saveUpdates, 2000), true);

  $scope.delete = function () {
    console.info("delete requested!", $scope.sample);
    $scope.saveInProgress = true;
    if ($scope.sample._id) {
      $scope.sample.remove();
    }
  };
}
LabSamplesCtrl.$inject = ['$scope','$routeParams','$debounce','$location','Restangular'];