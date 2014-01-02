angular.module('farmdatDirectives', []).
  directive('contenteditable', function () {
      return {
          restrict: 'A', // only activate on element attribute
          require: '?ngModel', // get a hold of NgModelController
          link: function (scope, element, attrs, ngModel) {
              if (!ngModel) return; // do nothing if no ng-model
              var placeholder = (attrs.placeholder) ? attrs.placeholder : '';
              // Specify how UI should be updated
              ngModel.$render = function () {
                  element.html(ngModel.$viewValue || placeholder);
              };

              // Listen for change events to enable binding
              element.on('blur keyup change', function () {
                  scope.$apply(readViewText);
              });

              // revert to placeholder if user leaves field empty
              element.on('mouseleave mouseout', function () {
                  if (element.html() === '') {
                    html = placeholder;
                    element.html(html);
                  }
              });

              // No need to initialize, AngularJS will initialize the text based on ng-model attribute

              // Write data to the model
              function readViewText() {
                  var html = element.html();
                  // When we clear the content editable the browser leaves a <br> behind
                  // If strip-br attribute is provided then we strip this out
                  if (attrs.stripBr && html == '<br>') {
                      html = '';
                  }

                  ngModel.$setViewValue(html);
              }
          }
      };
  });
