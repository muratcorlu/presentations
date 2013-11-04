// Adres listeleme componenti
angular.module('safe').controller('MyAddressEditCtrl', function ($scope, $routeParams, addressService, saRouter, $location) {
    'use strict';

    // Aktif kullanicinin adresleri aliniyor
    if ($routeParams.addressId) {
        $scope.address = addressService.getAddress($routeParams.addressId);
    }

    $scope.save = function () {
        addressService.saveAddress($scope.address).$promise.then(function () {
            $location.path(saRouter.routePath('my_address_info'));
        });
    };
});
