/**
 * @ngdoc directive
 * @name safe.directive:pageTitle
 *
 * @element ANY
 * @param {string} pageTitle Verilen değer sayfa başlığı olarak değiştirilir
 *
 * @description
 *
 * `page-title` attribute'una sahip elementlerin, varsa `page-title` attribute değeri
 * yoksa içeriği sayfa başlığı olarak(`title` etiketi içeriği) belirlenir.
 *
 <doc:example>
     <doc:source>
        <h1 page-title>Sayfa başlığı bu metin olacak</h1>

        veya

        <p page-title="Bu şekilde de sayfa başlığı değiştirilebilir">Burada ne metin olduğunun önemi yok</p>
     </doc:source>
 </doc:example>
 *
 */

angular.module('sahibinden.pageTitle', [])
    .directive('pageTitle', function () {
        'use strict';

        return function (scope, element, attrs) {
            document.getElementsByTagName('title')[0].innerHTML = attrs.pageTitle || element.html();
        };
    });
