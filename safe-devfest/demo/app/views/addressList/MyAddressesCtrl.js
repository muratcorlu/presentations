// Adres listeleme componenti
angular.module('safe').controller('MyAddressesCtrl', function ($scope, addressService) {
    'use strict';

    // Aktif kullanicinin adresleri aliniyor
    $scope.addresses = addressService.getAddresses();

    $scope.deleteAddress = function (address) {
        addressService.deleteAddress(address.id);
    };
});
