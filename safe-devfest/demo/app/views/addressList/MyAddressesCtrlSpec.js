describe('Address List Controller', function () {

    var module;
    beforeEach(function() {
      module = angular.module('safe');
    });

    it('null olmamalı.', function() {
        expect(module.MyAddressesCtrl).not.toBeNull();
    });

});
