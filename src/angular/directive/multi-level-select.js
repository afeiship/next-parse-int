(function (angular) {
  'use strict';

  var selects = {};
  //link function:
  function nxMultiLevelSelect($http, $parse, $timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        name: '@',
        source: '=',
        empty: '=',
        dependents: '=',
        ngModel: '='
      },
      template: ''
      + '<option value="{{empty.value}}">{{empty.text}}</option>'
      + '<option ng-repeat="item in items" value="{{item.value}}">{{item.text}}</option>',
      link: function (scope, elem, attrs, ngModelCtrl) {
        var dependents = scope.dependents || [];
        var parentScope = scope.$parent;
        var scopeName = scope.name = scope.name || 'multi-select-' + Math.floor(Math.random() * 900000 + 100000);
        var initialed = false;

        //cache multi-select-model,get current model value:
        selects[scopeName] = {
          scope: scope,
          getValue: function () {
            return scope.ngModel;
          }
        };


        function onDependentsUpdate() {

          var returned = scope.source ? scope.source() : false;
          var initialValue;
          var hasInitialedValue;
          if (returned) {
            //normalize synchronization & asynchronous data source:
            if (!returned.then) {
              returned = {
                then: (function (data) {
                  //synchronization
                  return function (callback) {
                    callback.call(window, {
                      data: data
                    });
                  };
                })(returned)
              };
            }

            returned.then(function (response) {
              scope.items = response.data;
              $timeout(function () {
                //initial default ng-model:
                hasInitialedValue = _findInitialValue(scope.items, scope.ngModel);
                if (initialed || hasInitialedValue) {
                  initialValue = scope.empty.value;
                } else {
                  initialValue = scope.ngModel;
                }
                ngModelCtrl.$setViewValue(initialValue);
                ngModelCtrl.$render();
                initialed = true;
              });
            });
          }
        }

        if (dependents.length > 0) {
          scope.$on('selectUpdate', function (e, data) {
            if (dependents.indexOf(data.name) > -1) {
              onDependentsUpdate();
            }
          });
        } else {
          onDependentsUpdate();
        }


        //add watcher
        parentScope.$watch(function () {
          return scope.ngModel;
        }, function (newValue, oldValue) {
          //on-init:newValue will equal oldValue.
          if (newValue !== oldValue || newValue !== scope.empty.value) {
            scope.$root.$broadcast('selectUpdate', scope);
          }
        });
      }
    };
  }


  /*@private method@*/
  function _findInitialValue(inItems, inValue) {
    var hasValue = false;
    angular.forEach(inItems, function (item) {
      if (item.value === inValue) {
        return true;
      }
    });
    return hasValue;
  }


  //injections:
  nxMultiLevelSelect.$inject = ['$http', '$parse', '$timeout'];

  //directive init:
  angular
    .module('nx.widget')
    .directive('nxMultiLevelSelect', nxMultiLevelSelect);

}(angular));
