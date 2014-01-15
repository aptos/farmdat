function LabSamplesCtrl($scope, $routeParams, $debounce, $location, Restangular) {

  $scope.saveInProgress = false;
  var saveFinished = function () {_.delay( function() {$scope.saveInProgress = false; $scope.$apply();}, 500); };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };
  $scope.dateFormat = 'dd-MMMM-yyyy';

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