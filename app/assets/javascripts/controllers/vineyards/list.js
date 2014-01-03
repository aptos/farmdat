function VineyardListCtrl($scope, Restangular, $location) {

  Restangular.all('vineyards').getList().then(function(vineyards) {
    $scope.vineyards = vineyards;
  });

  $scope.add_vineyard = function () {
    $location.path('/vineyards/edit');
  };
}
VineyardListCtrl.$inject = ['$scope', 'Restangular', '$location'];