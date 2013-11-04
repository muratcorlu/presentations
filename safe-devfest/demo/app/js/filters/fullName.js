/**
 * @ngdoc filter
 * @name ng.filter:fullName
 *
 * @element ANY
 *
 * @description
 *
 * Alınan objenin firstName ve lastName özelliklerini arasına boşluk
 * koyarak gönderilir.
 *
<doc:example>
    <doc:source>
        <span ng-bind="user | fullName"></span>
        <span>{{ user | fullName }}</span>
    </doc:source>
</doc:example>
*
*/
angular.module('safe').filter('fullName', function () {
    'use strict';

    return function (user) {
        return user ? user.firstname + ' ' + user.lastname : '';
    };
});
