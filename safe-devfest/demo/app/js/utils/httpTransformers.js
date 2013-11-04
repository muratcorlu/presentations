angular.module('safe').config(function ($httpProvider) {
    'use strict';

    var endsWith = function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    $httpProvider.defaults.timeout = 10000;
    $httpProvider.defaults.xsrfHeaderName = 'x-xsrf-token';
    $httpProvider.defaults.xsrfCookieName = 'xsrf-token';

    $httpProvider.interceptors.push(['$q', '$rootScope', function ($q, $rootScope) {
        return {
            request: function (config) {
                // Butun XHR requeslerine asagidaki header'lari ekliyoruz
                config.headers = angular.extend({
                    'x-api-key': '94931ab85d095c37cb78f7bd2061922e32d235e6',
                    'x-client-profile': 'Generic_v1.1'
                }, config.headers);

                return config;
            },

            responseError: function (httpResponse) {
                if (endsWith(httpResponse.config.url, '.html')) {
                    var errorCode = 'html-http-' + httpResponse.status;
                    $rootScope.errorCode = errorCode;
                }
                return $q.reject(httpResponse);
            }
        };
    }]);
});
