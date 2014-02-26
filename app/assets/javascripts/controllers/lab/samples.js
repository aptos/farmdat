function LabSamplesCtrl($scope, $routeParams, $debounce, $location, $filter, Restangular) {

  // utility functions
  var getYear = function (ymd) { return ymd.split("-")[0]; };

  // Fetch Samples
  var refresh = function () {
    Restangular.one('samples', 'mine').getList().then( function (list) {
      $scope.samples = list;
      $scope.seasons = _.uniq(_.map(_.pluck(list, 'date'), function (d) { return getYear(d); })).sort().reverse();
    });
  };
  refresh();

  // Filter by query or season
  var filterFilter = $filter('filter');
  var orderByFilter = $filter('orderBy');
  var matchYear = $filter('matchYear');
  $scope.season = '2014';
  $scope.filterItems = function() {
    var q_samples = filterFilter($scope.samples, $scope.query);
    var by_season = matchYear(q_samples, $scope.season);
    var orderedItems = orderByFilter(by_season, ['vineyard_name','date']);

    $scope.filtered_samples = orderedItems;
  };

  $scope.$watch('samples', $scope.filterItems);
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

  // Chart Functions
  var position = "right";
  $scope.timeline_config = {
    legend: {
      show: false,
      position: "nw",
      margin: 5
    },
    colors: ["#805EAF","rgba(75, 109, 75, 0.76)","#C0752E"],
    lines : { show : true, lineWidth : 5 },
    points: { show: true },
    grid: {
      hoverable: true
    },
    tooltip: true,
    tooltipOpts: {
      content: "%s: %y"
    },
    xaxis : {
      mode: "time",
      timeformat: "%b-%d",
      timezone: "browser"
    },
    yaxes: [ { min: 0 }, {
      alignTicksWithAxis: 1,
      position: "left"
    },{
      alignTicksWithAxis: 1,
      position: "right"
    } ]
  };

  var chartData = function (selected, prop) {
    var data = selected.map( function (sample) {
      return [moment(sample.date).unix() * 1000, sample[prop]];
    }).sort( function (a,b) { return a[0] - b[0]; });
    return data;
  };

  $scope.getTimeline = function (date, vineyard, block) {
    $scope.chart_title = (!!block) ? vineyard + " - " + block : vineyard;
    $scope.season = date.split("-")[0];
    $scope.current_year = new Date().getFullYear() == $scope.season;

    var selected = _.filter($scope.samples, function (sample) {
      var same_block = sample.vineyard_name == vineyard && sample.block == block;
      var combined = sample.vineyard_name == vineyard && block == 'combined';
      var this_season = (sample.date.split("-")[0] == $scope.season);

      return (this_season && (same_block || combined));
    });

    var brixData = chartData(selected, 'brix');
    var taData = chartData(selected, 'ta');
    var phData = chartData(selected, 'ph');

    $scope.timeline = [
    { label: 'Brix', data: brixData, yaxis: 1 },
    { label: 'TA', data: taData, yaxis: 2 },
    { label: 'pH', data: phData, yaxis: 3 }
    ];
  };

  // Table rendering
  var prev_site = '';
  $scope.break_by_site = function (name) {
    var this_cls = (name == prev_site) ? '' : "scrolling-list-subgroup";
    prev_site = name;
    return this_cls;
  }

  // Form Functions
  $scope.saveInProgress = false;

  $scope.min_date = "2000-01-01";
  $scope.max_date = "2016-01-01";

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

  $scope.vineyards = function () {
    $location.path("/vineyards");
  };

  $scope.delete = function () {
    console.info("delete requested!", $scope.sample);
    $scope.saveInProgress = true;
    if ($scope.sample._id) {
      $scope.sample.remove();
    }
  };
}
LabSamplesCtrl.$inject = ['$scope','$routeParams','$debounce','$location','$filter','Restangular'];