function VineyardListCtrl($scope, Restangular) {

  Restangular.all('vineyards').getList().then(function(vineyards) {
    $scope.vineyards = vineyards;
  });

}
VineyardEditCtrl.$inject = ['$scope', 'Restangular'];
