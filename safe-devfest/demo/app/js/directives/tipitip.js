/**
 * @ngdoc directive
 * @name sahibinden.tipitip:tipitip
 *
 * @element ANY
 *
 * @description
 *
 * Tooltip eklentisi
 *
 <doc:example>
   <doc:source>
     <span tipitip title="Ayrıntılı bilgilendirme tooltip içinde">Üzerime gel</span>
   </doc:source>
 </doc:example>
 *
 */

angular.module('sahibinden.tipitip', []).directive('tipitip', function () {
    'use strict';

    var ttIndex = 0;

    return {
        restrict: 'A',
        scope: {
            tipitipShow: '&tipitipShow'
        },
        link: function (scope, element, attrs) {
            var elEventOnload = element.data('onload'),

                elOpenEvent = attrs.openEvent || 'mouseenter',
                elCloseEvent = attrs.closeEvent || 'mouseleave',
                customClass = element.data('class'),
                ttId = 'tt-' + ttIndex++,
                ttElement,

                positionCalculator = function (el, elDataPos, tipitip) {
                    var rect = el[0].getBoundingClientRect(),
                        elWidth = rect.width,
                        elHeight = rect.height,
                        elPosTop = rect.top + window.pageYOffset - document.documentElement.clientTop,
                        elPosLeft = rect.left + window.pageXOffset - document.documentElement.clientLeft,
                        tipitipRect = tipitip[0].getBoundingClientRect(),
                        tipitipOuterHeight = tipitipRect.height,
                        tipitipOuterWidth = tipitipRect.width,
                        tipitipArrowHeight = 15,
                        tipitipArrowWidth = 20,
                        posIndex = {
                            'north-east'    : [0, 0],
                            'north'         : [0, 1],
                            'north-west'    : [0, 2],
                            'south-east'    : [1, 0],
                            'south'         : [1, 1],
                            'south-west'    : [1, 2],
                            'west'          : [2, 3],
                            'east'          : [2, 4]
                        },
                        posTop = [
                            elPosTop - (tipitipOuterHeight + tipitipArrowHeight),    // south-west, south ve south-east top degerini hesaplar.
                            elPosTop + elHeight + tipitipArrowHeight,    // north-west, north ve north-east top degerini hesaplar.
                            elPosTop - ((tipitipOuterHeight - elHeight) / 2)    // west ve east top degerini hesaplar.
                        ],
                        posLeft = [
                            elPosLeft,    // north-west ve south-west left degerini hesaplar.
                            elPosLeft - ((tipitipOuterWidth - elWidth) / 2),   // north ve south left degerini hesaplar.
                            elPosLeft - tipitipOuterWidth + elWidth,    // north-east ve south-east left degerini hesaplar.
                            elPosLeft - tipitipOuterWidth - tipitipArrowWidth,    // east left degerini hesaplar.
                            elPosLeft + elWidth + tipitipArrowWidth    // west left degerini hesaplar.
                        ];

                    return {
                        'top'   : posTop[posIndex[elDataPos][0]],    // Yon degerinin 0. elemani elPosTop a gonderilir, yon hesaplanir.
                        'left'  : posLeft[posIndex[elDataPos][1]]    // Yon degerinin 1. elemani elPosTop a gonderilir, yon hesaplanir.
                    };
                },

                openHandler = function () {
                    if (scope.tipitipShow()) {
                        var elTitle = attrs.title,
                            elDataPos = attrs.position || 'east',
                            elContent = '',
                            position;

                        if (!ttElement || attrs.live) {    // Tooltip olusturulmamissa

                            ttElement = angular.element(document.createElement('div'));
                            ttElement.attr('id', ttId).addClass('tipitip').addClass(customClass);

                            angular.element(document.body).append(ttElement);

                            // elContent, tooltip iceriginin nereden alinacagina karar verir ve oradan icerigi alip degiskene kaydeder.
                            elContent = (attrs.target ? angular.element(document.getElementById(attrs.target)).html() : '') ||
                                element.data('content') || elTitle;

                            ttElement.addClass('tt-' + elDataPos)
                                   .html(elContent);

                        }

                        ttElement.css('display', 'block');
                        position = positionCalculator(element, elDataPos, ttElement);
                        ttElement.css('top', position.top + 'px');
                        ttElement.css('left', position.left + 'px');

                        /**
                         *
                         * title ozniteliginin kendi kendine cikan varsayilan tooltipini engelemek icindir.
                         * mouse eleman üzerine geldiginde title da ki bilgiyi elSelectorTitle degiskenine gonderir
                         * ve title in icini temizler.
                         *
                         */

                        if (elTitle) {
                            element.attr('title', '');
                        }
                    }
                };

            element.bind(elOpenEvent, openHandler);

            element.bind(elCloseEvent, function () {
                if (!attrs.stayOpen && ttElement) {
                    ttElement.css('display', 'none');
                }
            });

            if (elEventOnload) {
                openHandler();
            }
        }
    };
});
