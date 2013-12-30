function VineyardEditCtrl($scope, $debounce, $routeParams, Restangular) {

  var saveInProgress = false;
  var saveFinished = function () { saveInProgress = false; };

  if ($routeParams.id) {
    console.info("get",$routeParams.id )
    saveInProgress = true;
    Restangular.one('vineyards',$routeParams.id).get().then(function (data) {
      $scope.vineyard = data;
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