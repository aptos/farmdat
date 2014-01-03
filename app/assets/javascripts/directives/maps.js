var maps = angular.module('maps', []);

maps.directive('geocode', ['$debounce', function($debounce) {
  return {
    restrict: 'A',
    require:'ngModel',
    replace: true,
    link: function(scope, element, attrs, ngModel) {

      var geocoder = new google.maps.Geocoder();
      var getLocation = $debounce(
        function (location, callback) {
          if (!location) { return; }
          geocoder.geocode( { 'address': location}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              latLong = [ results[0].geometry.location.lat(),results[0].geometry.location.lng()] ;
          console.info("geocode: " + latLong);
        } else {
          console.error("Geocode was not successful for the following reason: " + status);
          return;
        }
        callback(latLong);
      });
        }, 2000, false);

      scope.$watch(attrs.ngModel, function(value, oldValue) {
        if (value === oldValue) { return; }
        // if (typeof(oldValue) === 'undefined') { return; }
        console.info("update from geocode")
        getLocation(value, function(response) {
          scope[attrs.latlong] = response;
          scope.$apply();
        });
      });
    }
  };
}]);