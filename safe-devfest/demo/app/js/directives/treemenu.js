angular.module('sahibinden.treemenu', []).directive('treemenu', function ($rootScope) {
    'use strict';

    return function (scope, element) {
        $rootScope.$on('$routeChangeStart', function (next, current) {
            element.find('li').removeClass('active');

            angular.forEach(element.find('a'), function (el) {
                var anchorElement = angular.element(el),
                    routeName = anchorElement.attr('route-name'),
                    parent,
                    tagName;

                if (routeName) {
                    anchorElement.attr('href', $rootScope.url(routeName));

                    if ($rootScope.isActive(routeName, current)) {

                        parent = anchorElement.parent()[0];
                        scope.activeTab =  angular.element(element).attr('active-tab');

                        while ((tagName = parent.tagName.toLowerCase()) != 'html') {
                            if (tagName == 'li') {
                                angular.element(parent).addClass('active');
                            }

                            parent = angular.element(parent).parent()[0];

                        }
                    }
                }
            });
        });
    };
});
