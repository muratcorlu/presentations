/**
 * @ngdoc directive
 * @name ng.directive:translate
 *
 * @element ANY
 *
 * @description
 *
 * Angular icin ceviri directive'i
 *
 * Ayrintili bilgi: 
 * @link: http://pascalprecht.github.io/angular-translate/
 *
 <doc:example>
   <doc:source>
    <div ng-controller="Ctrl">
      <span translate="messageKey">Varsayılan dil karşılığı</span>
    </div>
   </doc:source>
 </doc:example>
 *
 */

(function (ng) {
    'use strict';

    /* Services */
    ng.module('translate', [], ['$provide', function ($provide) {
        $provide.factory('translate', ['$log', 'config', 'translations', function ($log, config, translations) {
            var localizedStrings = translations,
                log = config.logMissingTranslations,
                translate = function (sourceString, lang) {
                    if (!sourceString) {
                        return '';
                    }

                    if (!lang) {
                        lang = config.defaultLanguage;
                    }

                    sourceString = sourceString.trim();

                    if (localizedStrings[lang] && localizedStrings[lang][sourceString]) {
                        return localizedStrings[lang][sourceString];
                    } else {
                        if (log) {
                            $log.warn('Missing localisation for "' + sourceString + '"');
                        }

                        return sourceString;
                    }
                };

            return translate;
        }]);
    }]);

    /* Directives */
    ng.module('translate.directives', [], ['$compileProvider', function ($compileProvider) {
        $compileProvider.directive('translate', ['$compile', 'translate', '$rootScope', 'config', function ($compile, translate, $rootScope, config) {
            return {
                priority: 10, //Should be evaluated befor e. G. pluralize
                restrict: 'ECMA',
                compile: function compile(el, attrs) {
                    var translateInnerHtml = false,
                        translateAttributes = [],
                        attrsToTranslate;

                    if (attrs.translate) {
                        attrsToTranslate = attrs.translate.split(';');
                        ng.forEach(attrsToTranslate, function (v) {
                            var parts = v.split(' ');

                            if (parts.length > 1) {
                                translateAttributes.push(parts);
                            } else {
                                translateInnerHtml = v;
                            }
                        });
                    } else {
                        translateInnerHtml = el.html();
                    }

                    return function preLink(scope, el) {
                        $rootScope.$watch('lang', function (lang) {
                            if (lang && lang !== config.defaultLanguage) {
                                if (translateInnerHtml) {
                                    var value = translate(translateInnerHtml, lang);

                                    if (translateInnerHtml != value) {
                                        el.html(value);
                                    }
                                    $compile(el.contents())(scope);
                                }
                                ng.forEach(translateAttributes, function (attr) {
                                    console.log(attr[0], translate(attr[1], lang));
                                    console.log(el.attr(attr[0]));
                                    el.attr(attr[0], translate(attr[1], lang));
                                });

                            }
                        });
                    };
                }
            };
        }]);
    }]);
}(angular));