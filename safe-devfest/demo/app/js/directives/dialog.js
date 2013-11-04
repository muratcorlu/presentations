angular.module('sahibinden.modal', [])
    .directive('dialog', function () {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                title: '@',
                extraClass: '@',
                visible: '='
            },
            template: '<div ng-class="{hidden: !visible}">' +
                '<div class="overlay"></div>' +
                '<div class="dialog-content {{ extraClass }}" ng-class="{dialogEffect: visible}">' +
                    '<div>' +
                        '<a ng-show="closable" class="dialog-close" ng-click="visible = false">close</a>' +
                        '<h3>{{ title }}</h3>' +
                        '<main></main>' +
                    '</div>' +
                '</div>' +
            '</div>',

            controller: function ($scope, $element, $attrs, $transclude) {
                $transclude(function (clone, scope) {
                    scope.closeDialog = function () {
                        $scope.visible = false;
                    };

                    $element.find('main').append(clone);
                });
            },

            link: function (scope, element, attrs) {
                if (!angular.isDefined(attrs.closable)) {
                    scope.closable = true;
                } else {
                    scope.closable = attrs.closable;
                }
            }
        };
    });
