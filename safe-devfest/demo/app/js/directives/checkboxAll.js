/**
 * @ngdoc directive
 * @name safe.directive:checkboxAll
 *
 * @element input
 *
 * @description
 *
 * Bir listedeki tüm elemanları seçen bir checkbox kutusu yapmak için pratik bir directive.
 *
<doc:example>
    <doc:source>
      <script>
        function Ctrl($scope) {
          $scope.items = [1,2,3,4,5];
        }
      </script>
      <div ng-controller="Ctrl">
        <p><input type="checkbox" checkbox-all="items.isSelected"> Tümünü seç</p>
        <ul>
          <li ng-repeat="item in items"><input type="checkbox" ng-model="item.isSelected"> {{ $index }}. secenek</li>
        </ul>
      </div>
    </doc:source>
</doc:example>
*
*/
angular.module('safe').directive('checkboxAll', function () {
    'use strict';

    return function (scope, iElement, iAttrs) {
        var parts = iAttrs.checkboxAll.split('.');

        iElement.attr('type', 'checkbox');
        iElement.bind('change', function () {
            scope.$apply(function () {
                var setValue = iElement.prop('checked');
                angular.forEach(scope.$eval(parts[0]), function (v) {
                    v[parts[1]] = setValue;
                });
            });
        });

        scope.$watch(parts[0], function (newVal) {
            var hasTrue, hasFalse;
            angular.forEach(newVal, function (v) {
                if (v[parts[1]]) {
                    hasTrue = true;
                } else {
                    hasFalse = true;
                }
            });
            if (hasTrue && hasFalse) {
                iElement.attr('checked', false);
                iElement.addClass('greyed');
            } else {
                iElement.attr('checked', hasTrue);
                iElement.removeClass('greyed');
            }
        }, true);
    };
});
