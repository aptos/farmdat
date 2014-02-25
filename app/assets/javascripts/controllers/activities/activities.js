function ActivitiesCtrl($scope, $rootScope, $routeParams, $debounce, $location, $filter, Restangular) {

  // utility functions
  var getYear = function (ymd) { return ymd.split("-")[0]; };

  $scope.selected = undefined;
  $rootScope.getMeta().then(function (metadata) {
    $scope.metadata = metadata;
    $scope.jobs = metadata.jobs;
  });


  // Fetch activities
  var refresh = function () {
    Restangular.one('activities', 'mine').getList().then( function (list) {
      $scope.activities = list;
      $scope.seasons = _.uniq(_.map(_.pluck(list, 'date'), function (d) { return getYear(d); })).sort().reverse();
    });
  };
  refresh();

  // Date Format
  $scope.dateformat = 'D MMM \'YY';
  $scope.toggle_date = function () {
    $scope.dateformat = ($scope.dateformat == 'timeago') ? 'D MMM \'YY'  : 'timeago';
  };

  // Filter by query or season
  var filterFilter = $filter('filter');
  var orderByFilter = $filter('orderBy');
  var matchYear = $filter('matchYear');
  $scope.season = '2014';
  $scope.filterItems = function() {
    var q_activities= filterFilter($scope.activities, $scope.query);
    var by_season = matchYear(q_activities, $scope.season);
    var orderedItems = orderByFilter(by_season, ['vineyard_name','date']);

    $scope.filtered_activities = orderedItems;
  };

  $scope.$watch('activities', $scope.filterItems);
  $scope.$watch('query', $scope.filterItems);

  // Fetch Vineyard List, create Block list for each vineyard
  $scope.blocklist = {};
  $scope.vineyard_list = [];
  Restangular.one('vineyards','mine').getList().then( function(list) {
    $scope.vineyard_list = list.map( function (vineyard) { return { value: vineyard._id, text: vineyard.name }; });
    angular.forEach(list, function (vineyard) {
      $scope.blocklist[vineyard._id] = vineyard.blocks.map( function (block) { return {value: block.name, text: block.name }; });
    });
  });


  // Table rendering
  var prev_site = '';
  $scope.break_by_site = function (name) {
    var this_cls = (name == prev_site) ? '' : "scrolling-list-subgroup";
    prev_site = name;
    return this_cls;
  };

  // Form Functions
  $scope.saveInProgress = false;

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 0,
  };
  $scope.dateFormat = 'dd-MMMM-yyyy';

  $scope.vineyard_selected = function (id) {
    if (!id) return;
    $scope.activity.vineyard_name = _.find($scope.vineyard_list, function (v) { return v.value == id; }).text;
    $scope.blocks = $scope.blocklist[id];
  };

  $scope.new_activity = function () {
    $scope.activity = { job: '' };
    $scope.activityEditForm.$setPristine();
    $scope.show_form = true;
  };

  $scope.save = function () {
    if (($scope.activityEditForm.$valid) && (!$scope.saveInProgress) ) {
      $scope.saveInProgress = true;
      if ($scope.activity._id) {
        $scope.activity.put().then($scope.close, $scope.close);
      } else {
        Restangular.all('activities').post($scope.activity).then( function () {
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

  $scope.vineyards = function () {
    $location.path("/vineyards");
  };

  $scope.delete = function () {
    console.info("delete requested!", $scope.activity);
    $scope.saveInProgress = true;
    if ($scope.activity._id) {
      $scope.activity.remove();
    }
  };
}
ActivitiesCtrl.$inject = ['$scope','$rootScope','$routeParams','$debounce','$location','$filter','Restangular'];