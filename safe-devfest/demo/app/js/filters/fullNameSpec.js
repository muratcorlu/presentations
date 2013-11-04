describe('fullName filter', function() {
    beforeEach(module('safe'));

    it('null olmamalı', inject(function(fullNameFilter) {
        expect(fullNameFilter).not.toBeNull();
    }));

    it('ad ve soyadı düzgün dönmeli', inject(function(fullNameFilter) {
        var user = {
            firstname: 'Ad',
            lastname: 'Soyad'
        };
        expect(fullNameFilter(user)).toBe('Ad Soyad');
    }));
});
