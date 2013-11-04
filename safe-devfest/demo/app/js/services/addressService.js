angular.module('safe').factory('addressService', function ($resource) {
    'use strict';

    return {
        // Login olan kullanici icin bilgileri doner
        getAddresses: function () {
            return $resource('/rest/my/addresses').query();
        },

        getAddress: function (addressId) {
            return $resource('/rest/my/addresses/:addressId', {
                addressId: addressId
            }).get();
        },

        saveAddress: function (address) {
            if (address.id) {
                return $resource('/rest/my/addresses/:addressId', {
                    addressId: address.id
                }).save(address);
            } else {
                return $resource('/rest/my/addresses').save(address);
            }
        },

        deleteAddress: function (addressId) {
            console.log('test');
            return $resource('/rest/my/addresses/:addressId', {
                addressId: addressId
            }).remove();
        }
    };
});
