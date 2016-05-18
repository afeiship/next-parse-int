#angular-multi-level-select
AngularJs directive provide multi level select ,for example province,city,area.


##usage:
+ bower install `angular-multi-level-select`

## synchronization
+ html:
```html
<select nx-multi-level-select
        source="vm.day.source"
        name="{{vm.day.name}}"
        ng-model="vm.day.value"
        empty="vm.day.empty"></select>


<select nx-multi-level-select
        source="vm.hour.source"
        name="{{vm.hour.name}}"
        ng-model="vm.hour.value"
        empty="vm.hour.empty"
        dependents="vm.hour.dependents"
></select>
```
+ javascript:
```javascript
var TestModule = angular.module('TestApp', ['nx.widget'])
    .controller('MainCtrl', function ($scope) {
      var vm = window.vm = this;
      vm.day = {
        name: 'day',
        source: getDays,
        value: '0',
        empty: {
          value: '-1',
          text: '请选择周几'
        }
      };
      vm.hour = {
        name: 'hour',
        source: getHours,
        value: '1',
        empty: {
          value: '-1',
          text: '请选择时间'
        },
        dependents: ['day']
      };


      //the source is empty method:
      function getDays() {
        var days = '一二三'.split('');
        days.forEach(function (item, index) {
          days[index] = {
            text: '星期' + item,
            value: index
          };
        });
        return days;
      }

      function getHours() {
        var id = vm.day.value;
        if (id !== vm.day.empty.value) {
          var suffix = ++id;
          return [{
            text: '09:00-12:00-' + suffix,
            value: '1'
          }, {
            text: '14:00-17:00-' + suffix,
            value: '2'
          }];
        } else {
          return [];
        }
      }


    });
```

## asynchronous
+ html:

```html
<div class="row" style="padding:2em" ng-app="TestApp">
  <h1>Welcome</h1>

  <div class="wrapper" ng-controller="MainCtrl as vm">
    <p>
      <label for="">省</label>
      <select nx-multi-level-select
              source="vm.province.source"
              name="{{vm.province.name}}"
              ng-model="vm.province.value"
              empty="vm.province.empty"></select>
    </p>

    <p>
      <label for="">市</label>
      <select nx-multi-level-select
              source="vm.city.source"
              name="{{vm.city.name}}"
              ng-model="vm.city.value"
              empty="vm.city.empty"
              dependents="vm.city.dependents"
      ></select>
    </p>

    <p>
      <label for="">区</label>
      <select nx-multi-level-select
              source="vm.area.source"
              name="{{vm.area.name}}"
              ng-model="vm.area.value"
              empty="vm.area.empty"
              dependents="vm.area.dependents"
      ></select>
    </p>
  </div>
</div>
```

+ javascript:
```javascript
  angular.module('TestApp', ['nx.widget'])
    .controller('MainCtrl', function ($scope, $http) {
      var vm = window.vm = this;
      var extend = angular.extend;
      var defaults = {
        value: '-1',
        empty: {
          value: '-1',
          text: '请选择'
        }
      };

      //provinces:
      vm.province = extend(defaults, {
        name: 'province',
        source: getProvinces
      });

      //cities
      vm.city = extend(defaults, {
        name: 'city',
        source: getCities,
        dependents: ['province']
      });

      //areas:
      vm.area = extend(defaults, {
        name: 'area',
        source: getAreas,
        dependents: ['province', 'city']
      });


      /*
      >.<  =====  Image you have very terrible API from backend ====

      === BUT ===

      :) ==== I can handle it! =====
      */
      function getProvinces() {
        return $http.get('/zhaoshang/shangjia/get_provinces_list', {
          transformResponse: function (data, headersGetter) {
            // not sure what to do here?!
            var parsed = JSON.parse(data);
            var provinces = parsed.data.provinces;
            var parsed_provinces = [];

            angular.forEach(provinces, function (item) {
              parsed_provinces.push({
                value: String(item.id),
                text: item.name
              })
            });
            return parsed_provinces;
          }
        });
      }

      function getCities() {
        if (vm.province.value !== vm.city.value) {
          return $http.get('/location/location/new_areas', {
            params: {
              id: vm.province.value
            },
            transformResponse: function (data, headersGetter) {
              // not sure what to do here?!
              var parsed = JSON.parse(data);
              var provinces = parsed.data;
              var parsed_provinces = [];

              angular.forEach(provinces, function (item) {
                parsed_provinces.push({
                  value: String(item.id),
                  text: item.name
                })
              });
              return parsed_provinces;
            }
          });
        } else {
          return [];
        }
      }

      function getAreas() {
        if (vm.city.value !== vm.area.value) {
          return $http.get('/location/location/new_areas', {
            params: {
              id: vm.city.value
            },
            transformResponse: function (data, headersGetter) {
              // not sure what to do here?!
              var parsed = JSON.parse(data);
              console.log(parsed);
              var provinces = parsed.data;
              var parsed_provinces = [];

              angular.forEach(provinces, function (item) {
                parsed_provinces.push({
                  value: String(item.id),
                  text: item.name
                })
              });
              console.log(parsed_provinces);
              return parsed_provinces;
            }
          });
        } else {
          return [];
        }
      }
    });
```

##resources:
+ http://stackoverflow.com/questions/30119538/angularjs-ng-bind-not-updating
+ http://www.cnblogs.com/front-end-ralph/p/5133122.html
+ http://www.cnblogs.com/front-end-ralph/p/5131687.html
