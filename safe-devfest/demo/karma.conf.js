plugins = [
  'karma-jasmine',
  //'karma-ng-scenario',
  'karma-chrome-launcher'
  //'karma-firefox-launcher',
  //'karma-safari-launcher',
  //'karma-ng-scenario'
];

frameworks = ['jasmine'];
basePath  = './';
singleRun = true;
autoWatch = false;
colors    = true;

reporters = ['progress', 'dots'];
browsers = ['PhantomJS'];
proxies = {
  '/': 'http://localhost:8000/'
};

files = [
  //'./test/mocha.conf.js',

  JASMINE,
  JASMINE_ADAPTER,

  'app/js/components/angular/angular.js',
  'app/js/components/angular-route/angular-route.js',
  'app/js/components/angular-resource/angular-resource.js',
  'app/js/components/angular-mocks/angular-mocks.js',
  'app/js/components/angular-i18n/angular-locale_tr.js',
  'app/js/init.js',
  'tmp/lang-config.js',
  'app/js/utils/**/*.js',
  'app/js/config/*.js',
  'app/js/directives/**/*.js',
  'app/js/filters/**/*.js',
  'app/js/services/**/*.js',
  'app/views/**/*.js',
]
