(function (angular, window) {
  'use strict';

  angular.module('nx.widget')
    .directive('nxMultiLevelSelect', ['$parse', '$timeout', function ($parse, $timeout) {

      var selects = {};
      var DEFAULT_VALUE = '';

      return {
        restrict: 'A',
        template: ''
        + '<option ng-show="empty" value="">{{empty}}</option>'
        + '<option ng-repeat="item in items" value="{{item.value}}">{{item.text}}</option>',
        scope: {
          name: '@name',
          dependents: '@dependents',
          source: '=source',
          empty: '@empty',
          modelName: '@ngModel'
        },
        require: 'ngModel',
        link: linkFn
      };


      function linkFn(scope, elem, attr, model) {
        var dependents = scope.dependents ? scope.dependents.split(',') : false;
        var parentScope = scope.$parent;
        var initValue, inited;
        scope.name = scope.name || 'multi-select-' + Math.floor(Math.random() * 900000 + 100000);

        //cache multi-select-model:
        selects[scope.name] = {
          getValue: function () {
            return $parse(scope.modelName)(parentScope);
          }
        };

        initValue = selects[scope.name].getValue();
        inited = initValue != DEFAULT_VALUE;
        model.$setViewValue(DEFAULT_VALUE);


        function onParentChange() {
          var values = {};
          if (dependents) {
            angular.forEach(dependents, function (dependent) {
              values[dependent] = selects[dependent].getValue();
            });
          }

          (function (thenValues) {

            var returned = scope.source ? scope.source(values) : false;
            !returned || (returned = returned.then ? returned : {
              then: (function (data) {
                //synchronization
                return function (callback) {
                  callback.call(window, data);
                };
              })(returned)
            }).then(function (items) {

              for (var name in thenValues) {
                if (thenValues[name] !== selects[name].getValue()) {
                  return;
                }
              }

              scope.items = items;
              $timeout(function () {
                if (scope.items !== items) return;
                if (scope.empty) {
                  model.$setViewValue(DEFAULT_VALUE);
                } else {
                  model.$setViewValue(scope.items[0].value);
                }

                var initValueIncluded = !inited && (function () {
                    for (var i = 0; i < scope.items.length; i++) {
                      if (scope.items[i].value === initValue) {
                        return true;
                      }
                    }
                    return false;
                  })();

                if (initValueIncluded) {
                  inited = true;
                  model.$setViewValue(initValue);
                }

                model.$render();
              });
            });

          })(values);
        }


        if (!dependents) {
          onParentChange()
        } else {
          scope.$on('selectUpdate', function (e, data) {
            if (dependents.indexOf(data.name) > -1) {
              onParentChange();
            }
          });
        }


        parentScope.$watch(scope.modelName, function (newValue, oldValue) {
          if (newValue || DEFAULT_VALUE !== oldValue || DEFAULT_VALUE) {
            scope.$root.$broadcast('selectUpdate', {
              name: scope.name
            });
          }
        });

      }

    }]);


})(angular, window);
