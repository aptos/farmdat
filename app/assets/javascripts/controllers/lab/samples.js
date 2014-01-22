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

  // Chart Functions
  var position = "right";
  $scope.timeline_config = {
    legend: {
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

  $scope.getTimeline = function (vineyard, block) {
    $scope.chart_title = vineyard + " - " + block;

    var selected = _.filter($scope.samples, function (sample) {
      return (sample.vineyard_name == vineyard && sample.block == block);
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
LabSamplesCtrl.$inject = ['$scope','$routeParams','$debounce','$location','Restangular'];