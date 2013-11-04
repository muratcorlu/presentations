angular.module('safe').config(
function ($routeProvider, $locationProvider, saRouterProvider) {
    'use strict';

    // Url routing icin html5 pushstate kullan
    $locationProvider.html5Mode(true);

    /*
     * Kullanici bilgileri tabi
     */
    saRouterProvider
        .when('/adreslerim/yeni', {
            name: 'my_address_new',
            controller:  'MyAddressEditCtrl',
            templateUrl: '/views/addressEdit/addressEdit.html'
        })
        .when('/adreslerim/:addressId', {
            name: 'my_address_edit',
            controller:  'MyAddressEditCtrl',
            templateUrl: '/views/addressEdit/addressEdit.html'
        })
        .when('/adreslerim', {
            name: 'my_address_info',
            controller:  'MyAddressesCtrl',
            templateUrl: '/views/addressList/addressList.html'
        });

    /*
     * Ana sayfa
     * Bu url en sonda kalmali
     */
    saRouterProvider.otherwise({
            redirectTo : '/'
        });

    saRouterProvider.install($routeProvider);

});
