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

        //cache multi-select-model,get current model value:
        selects[scopeName] = {
          scope: scope,
          getValue: function () {
            return scope.ngModel;
          }
        };


        function onDependentsUpdate() {

          var returned = scope.source ? scope.source() : false;
          if (returned) {
            //normalize synchronization & asynchronous data source:
            if (!returned.then) {
              returned = {
                then: (function (data) {
                  //synchronization
                  return function (callback) {
                    callback.call(window, data);
                  };
                })(returned)
              };
            }

            returned.then(function (items) {
              scope.items = items;
              $timeout(function () {
                ngModelCtrl.$setViewValue(scope.ngModel);
                ngModelCtrl.$render();
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
          if (newValue !== oldValue || newValue!==scope.empty.value) {
            scope.$root.$broadcast('selectUpdate', scope);
          }
        });
      }
    };
  }


  //injections:
  nxMultiLevelSelect.$inject = ['$http', '$parse', '$timeout'];

  //directive init:
  angular
    .module('nx.widget')
    .directive('nxMultiLevelSelect', nxMultiLevelSelect);

}(angular));
