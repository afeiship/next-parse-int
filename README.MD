#angular-multi-level-select
AngularJs directive provide multi level select ,for example province,city,area.


##usage:
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
        value: '-1',
        empty: {
          value: '-1',
          text: '请选择周几'
        }
      };
      vm.hour = {
        name: 'hour',
        source: getHours,
        value: '-1',
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
