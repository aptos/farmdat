function LabSamplesCtrl($scope, $routeParams, $debounce, $location, Restangular) {

  // Fetch Samples
  var refresh = function () {
    Restangular.one('samples', 'mine').getList().then( function (list) {
      $scope.samples = list;
    });
  };
  refresh();

  // Fetch Vineyard List, create Block list for each vineyard
  $scope.blocklist = {};
  $scope.vineyard_list = [];
  Restangular.one('vineyards','mine').getList().then( function(list) {
    $scope.vineyard_list = list.map( function (vineyard) { return { value: vineyard._id, text: vineyard.name }; });
    angular.forEach(list, function (vineyard) {
      $scope.blocklist[vineyard._id] = vineyard.blocks.map( function (block) { return {value: block.name, text: block.name }; });
    });
  });

  // Form Functions
  $scope.saveInProgress = false;

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 0,
  };
  $scope.dateFormat = 'dd-MMMM-yyyy';

  $scope.vineyard_selected = function (id) {
    if (!id) return;
    $scope.sample.vineyard_name = _.find($scope.vineyard_list, function (v) { return v.value == id; }).text;
    $scope.blocks = $scope.blocklist[id];
  };

  $scope.new_sample = function () {
    $scope.sample = { brix: '', ta: '', ph: ''};
    $scope.sampleEditForm.$setPristine();
    $scope.show_form = true;
  };

  $scope.save = function () {
    if (($scope.sampleEditForm.$valid) && (!$scope.saveInProgress) ) {
      $scope.saveInProgress = true;
      if ($scope.sample._id) {
        $scope.sample.put().then($scope.close, $scope.close);
      } else {
        Restangular.all('samples').post($scope.sample).then( function () {
          $scope.close();
          refresh();
        },$scope.close);
      }
    }
  };

  $scope.close = function () {
    $scope.saveInProgress = false;
    $scope.show_form = false;
  };

  $scope.delete = function () {
    console.info("delete requested!", $scope.sample);
    $scope.saveInProgress = true;
    if ($scope.sample._id) {
      $scope.sample.remove();
    }
  };
}
LabSamplesCtrl.$inject = ['$scope','$routeParams','$debounce','$location','Restangular'];