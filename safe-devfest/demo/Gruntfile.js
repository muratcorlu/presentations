/**
 * Front-end projesi grunt konfigürasyon dosyası
 */
module.exports = function(grunt) {
  var apiMocker = require('./lib/middlewares/api-mocker'),
      urlRewrite = require('./lib/middlewares/url-rewrite'),
      url = require('url'),
      proxy = require('proxy-middleware'),
      excludedPlugins = [],
      includedPlugins = [];

  // Default task'de bazi eklentilere gerek yok
  if (grunt.cli.tasks.length == 0) {
    excludedPlugins = [
      'grunt-bower-task',
      'grunt-karma',
      'grunt-contrib-uglify',
      'grunt-contrib-nodeunit',
      'grunt-ngdocs',
      'grunt-plato',
      'grunt-usemin',
      'grunt-filerev',
      'grunt-cdn',
      'grunt-ngmin',
      'grunt-replace',
      'grunt-string-replace',
      'grunt-contrib-htmlmin'
    ];
  // Watch mode'da js degisikliklerinde sadece bu eklentiler lazim
  } else if (grunt.cli.tasks[0] == 'refreshJSs') {
    includedPlugins = [
      'grunt-contrib-jshint',
      'grunt-contrib-copy',
      'grunt-notify'
    ];

  // Watch mode'da stylus ve image degisikliklerinde sadece bu eklentiler lazim
  } else if (grunt.cli.tasks[0] == 'stylus' || grunt.cli.tasks[0] == 'sprite') {
    includedPlugins = [
      'grunt-stylus-sprite',
      'grunt-notify'
    ];

  // Watch mode'da html degisikliklerinde sadece bu eklentiler lazim
  } else if (grunt.cli.tasks[0] == 'refreshHTMLs') {
    includedPlugins = [
      'grunt-contrib-copy',
      'grunt-template',
      'grunt-notify'
    ];
  }

  // Eklentiler yukleniyor...
  var totalTook = 0;
  require('matchdep').filterAll('grunt-*').forEach(function(name) {
      if ((includedPlugins.length > 0 && includedPlugins.indexOf(name) > -1) ||
          (includedPlugins.length == 0 && excludedPlugins.indexOf(name) == -1)) {
          var start = new Date().getTime();
          grunt.loadNpmTasks(name);
          var took = new Date().getTime() - start;
          totalTook += took;
          console.log('Loading ' + name + ' took ' + took + ' ms.');
      }
  });

  console.log('*** Loading all tasks took ' + totalTook + ' ms. ***\n');

  var config = grunt.file.readJSON('config.json');

  var join = require('path').join;

  var getVendorJs = function (baseDir) {
    return [
      'js/components/angular/angular.js',
      'js/components/angular-route/angular-route.js',
      'js/components/angular-resource/angular-resource.js',
      'js/components/angular-i18n/angular-locale_tr.js',
      'js/components/angular-router-advanced/angular-router-advanced.js'
    ].map(function (path) {
      return join(baseDir, path);
    });
  };

  var getVendorJsTmp = function () {
    return getVendorJs(config.tmpDir);
  };

  var getVendorJsDest = function () {
    return join(config.buildDir, config.assetsPath, 'js/vendor.js');
  };

  var getNgtemplates = function (baseDir) {
    return join(baseDir, 'js/templates.js');
  };

  var getAppJs = function (baseDir, isProd) {
    var files = grunt.file.expand({cwd: config.appDir}, [
      'js/init.js',
      'js/utils/**/*.js',
      'js/config/**/*.js',
      'js/directives/**/*.js',
      'js/filters/**/*.js',
      'js/services/**/*.js',
      '!js/**/*Spec.js',
      'views/**/*.js',
      '!views/**/*Spec.js',
    ]);

    if (isProd) {
      files.push(getNgtemplates(''));
    }

    files = files.map(function (path) {
      return join(baseDir, path);
    });

    return files;
  };

  var getAppJsTmp = function (isProd) {
    return getAppJs(config.tmpDir, isProd);
  };

  var getAppJsDest = function () {
    return join(config.buildDir, config.assetsPath, 'js/app.js');
  };

  var getCommonCssDest = function () {
    return join(config.buildDir, config.assetsPath, 'css/common.css');
  };

  var getCommonCssHttp = function () {
    return '/' + join(config.assetsPath, 'css/common.css');
  };

  var getAppCssDest = function () {
    return join(config.buildDir, config.assetsPath, 'css/app.css');
  };

  var getAppCssHttp = function () {
    return '/' + join(config.assetsPath, 'css/app.css');
  };

  var getStylusFiles = function () {
    var files = {};
    files[getCommonCssDest()] = [join(config.appDir, 'styles/index.styl')];
    files[getAppCssDest()] = grunt.file.expand([
      config.appDir + '/**/*.styl',
      '!' + config.appDir + '/styles/**/*.styl'
    ]);
    return files;
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: config,

    clean: {
      build: ['<%= config.tmpDir %>', '<%= config.buildDir %>']
    },

    sprite: {
      options: {
        imagePath: '<%= config.tmpDir %>/img',
        imageHttpPath: '/<%= config.assetsPath %>/img'
      },
      build: {}
    },

    // Stylus dosyalarinin compile edilmesi
    stylus: {
      options: {
        includePath: '<%= config.appDir %>/styles',
      },
      build: {
        files: getStylusFiles()
      }
    },

    filerev: {
      dist: {
        src: [
          '<%= config.buildDir %>/assets/js/{,*/}*.js',
          '<%= config.buildDir %>/assets/css/{,*/}*.css',
          '<%= config.buildDir %>/assets/img/**/*.{png,jpg,svg}',
          // exclude sprites
          '!<%= config.buildDir %>/assets/img/*-*.png'
        ]
      }
    },

    useminPrepare: {
      html: '<%= config.buildDir %>/index.html',
    },

    usemin: {
      html: ['<%= config.buildDir %>/index.html'],
      css: ['<%= config.buildDir %>/assets/css/**/*.css'],
      // js: ['<%= config.dist %>scripts/{,*/}*.js'],
      options: {
        assetsDirs: ['<%= config.buildDir %>']
      }
    },

    img: {
        build: {
            src: '<%= config.appDir %>/img/*.png',
            dest: '<%= config.buildDir %>/<%= config.assetsPath %>/img'
        }
    },

    bower: {
      options: {
        targetDir: '<%= config.appDir %>/js/components',
        cleanTargetDir: false,
        cleanBowerDir: true,
        verbose: true
      },
      install: {
         //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
      }
    },

    // Javascript kodlarinin kontrolden gecirilmesi
    jshint: {
      // define the files to lint
      files: [
        '<%= config.appDir %>/**/*.js',
        '!<%= config.appDir %>/js/vendor/**/*.js',
        '!<%= config.appDir %>/js/components/**/*.js',
        '!<%= config.appDir %>/**/*Spec.js'
      ],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
        unused: true,   // Tanimlanan ama kullanilmayan parametreleri uyar
        curly: true,    // suslu parantez kullanilmadan belirtilen bloklari uyar
        boss: true,     // condition yazarken yanlislikla degisken set etme durumunda uyarir
        onevar: true,   // Her fonksiyonda tek bir var kullanimina izin ver
        indent: 4,      // Her tab 4 bosluk olmali
        camelcase: true,// Degisken adlari camelCase veya UPPER_CASE olmak zorunda
        latedef: true,  // Bir degisken tanimlanmadan once kullanilmamali
        quotmark: 'single', // String degerler tek tirnakla verilmeli
        trailing: true, // Satir sonlarindaki bosluklara kizar
        evil: true,     // eval kullanimini engeller
        white: true,    // Bosluklara Douglas Crockford ayari
        strict: true,   // 'use strict' olmayan fonksiyonlari uyar

        // more options here if you want to override JSHint defaults
        globals: {
          console: true // console global degiskenine izin ver
        }
      }
    },

    jsonlint: {
      dev: {
        src: [
            '<%= config.appDir %>/mock/**/*.json'
        ]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          base: '<%= config.tmpDir %>/views',        // $templateCache ID will be relative to this folder
          prepend: '/views/',  // (Optional) Prepend path to $templateCache ID
          module: 'safe'               // (Optional) The module the templates will be added to
        },
        src: '<%= config.tmpDir %>/views/**/*.html',
        dest: getNgtemplates(config.tmpDir)
      }
    },

    // Bağımlılık injectionlarının UglifyJS'den geçtiğinde bozulmasını engelleyen task
    ngmin: {
      dist: {
        expand: true,
        cwd: '<%= config.tmpDir %>',
        src: getAppJs(''),
        dest: '<%= config.tmpDir %>'
      }
    },

    // Javascript kodlarininin kucultulmesi
    uglify: {
      options: {
        "lift-vars": false
      },
      vendor: {
        src: getVendorJsTmp(),
        dest: getVendorJsDest(),
        options: {
          sourceMap: '<%= config.buildDir %>/<%= config.assetsPath %>/js/vendor.sourceMap.js'
        }
      },
      app: {
        src: getAppJsTmp(true),
        dest: getAppJsDest(),
        options: {
          sourceMap: '<%= config.buildDir %>/<%= config.assetsPath %>/js/app.sourceMap.js'
        }
      }
    },

    template: {
      dev: {
        src: '<%= config.appDir %>/views/index.html',
        dest: '<%= config.buildDir %>/index.html',
        options: {
          data: function () {
            var processUrls = function (urls) {
              return urls.map(function(url) {
                return '/' + url;
              });
            };

            return {
              js: {
                vendor: processUrls(getVendorJsTmp()),
                app: processUrls(getAppJsTmp(false))
              },
              css: {
                common: [getCommonCssHttp()],
                app: [getAppCssHttp()]
              },
              liveReloadEnabled: true
            };
          }
        }
      },
      dist: {
        src: '<%= config.appDir %>/views/index.html',
        dest: '<%= config.buildDir %>/index.html',
        options: {
          data: function () {
            return {
              js: {
                vendor: [getVendorJsDest()],
                app: [getAppJsDest()]
              },
              css: {
                common: [getCommonCssDest()],
                app: [getAppCssDest()]
              },
              liveReloadEnabled: false
            };
          }
        }
      }
    },

    cdn: {
      options: {
        cdn: '<%= config.assetsHttpPath %>'
      },
      dist: {
        src: ['<%= config.buildDir %>/index.html']
      }
    },

    'string-replace': {
      dist: {
        files: {
          './': '<%= config.buildDir %>/<%= config.assetsPath %>/css/**/*.css'
        },
        options: {
          replacements: [{
            pattern: /\/assets/ig,
            replacement: '/assets/safe/assets'
          }]
        }
      }
    },

    // Test konfigurasyonu
    karma: {
      options: {
        configFile: 'karma.conf.js',
        runnerPort: 9999
      },
      /*continuous: {
        singleRun: true,
        browsers: ['PhantomJS']
      },*/
      dev: {
      }
    },

    // Dosya degisikliklerinin takip edilerek aninda diger islemlerden gecirilmeleri
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: ['<%= config.appDir %>/**/*.styl'],
        tasks: ['stylus'],
        options: {
          nospawn: true
        }
      },
      img: {
        files: ['<%= config.appDir %>/img/**/*'],
        tasks: ['sprite']
      },
      js: {
        files: '<%= jshint.files %>',
        tasks: ['refreshJSs']
      },
      html: {
        files: ['<%= config.appDir %>/**/*.html'],
        tasks: ['refreshHTMLs']
      }
    },

    // Bilgilendirme araci
    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5, // maximum number of notifications from jshint output
        title: "Sahibinden Front-end" // defaults to the name in package.json, or uses project's directory name, you can change to the name of your project
      }
    },

    // Kod yorumlarindan dokumantasyon cikarimi
    ngdocs: {
      options: {
        title: "Sahibinden Front-end",
        startPage: '/baslangic/giris'
      },
      baslangic: {
        src: ['<%= config.appDir %>/content/baslangic/*.ngdoc'],
        title: 'Başlangıç'
      },
      api: {
        src: [
          '<%= config.appDir %>/**/*.js',
          '!<%= config.appDir %>/js/vendor/**/*.js',
          '!<%= config.appDir %>/js/components/**/*.js'
        ],
        title: 'Referans'
      }
    },

    // Gelistirme sunucusu
    connect: {
      server: {
        options: {
          proxy: '<%= config.proxy %>',
          mocker: '<%= config.mocker %>',
          port: '<%= config.port %>',
          base: '<%= config.buildDir %>',
          hostname: '<%= config.hostname %>',
          middleware: function(connect, options) {

            var middlewares = [];

            if (grunt.option('proxy')) {
              // Proxy'nin hangi backendi kullanacagini belirliyoruz
              var proxyOptions = url.parse( options.proxy.address );

              proxyOptions.route = options.proxy.route;

              middlewares.push( proxy(proxyOptions) );
            }

            // mock/rest klasorunu sahte servis katmani olarak kullan
            middlewares.push(apiMocker(
              options.mocker.route,
              options.mocker.path,
              options.mocker.speedSimulationLimit
            ));

            // butun pathleri roottaki index.html'e yonlendir (html5 pushstate)
            middlewares.push(urlRewrite(options.base));

            // Serve static files.
            middlewares.push(connect.static(options.base));
            middlewares.push(connect.static(__dirname));

            // Make empty directories browsable.
            middlewares.push(connect.directory(options.base));

            return middlewares;
          }
        }
      },
      docs: {
        options: {
          base: 'docs',
          keepalive: true,
          port: 9002
        }
      }
    },

    // Kod karmasiklik raporu
    plato: {
      report: {
        files: {
          'docs/reports/': [
            '<%= config.appDir %>/js/**/*.js',
            '<%= config.appDir %>/views/**/*.js',
            '!<%= config.appDir %>/js/vendor/**/*.js',
            '!<%= config.appDir %>/js/components/**/*.js'
          ],
        }
      },
    },

    // Herhangi bir islemden gecmeyen dosyalarin build klasorune tasinmasi
    copy: {
      html: {
        expand: true,
        cwd: '<%= config.appDir %>',
        src: 'views/**/*.html',
        dest: '<%= config.buildDir %>/',
        filter: 'isFile'
      },
      htmltmp: {
        expand: true,
        cwd: '<%= config.appDir %>',
        src: ['views/**/*.html', '!views/index.html'],
        dest: '<%= config.tmpDir %>/',
        filter: 'isFile'
      },
      imgtmp: {
        expand: true,
        cwd: '<%= config.appDir %>/img',
        src: ['**/*'],
        dest: '<%= config.tmpDir %>/img'
      },
      img: {
        expand: true,
        cwd: '<%= config.tmpDir %>/img',
        src: ['*.png', '*.svg'],
        dest: '<%= config.buildDir %>/<%= config.assetsPath %>/img'
      },
      js: {
        expand: true,
        cwd: '<%= config.appDir %>',
        src: ['js/**/*.js', 'views/**/*.js'],
        dest: '<%= config.tmpDir %>'
      }
    },

    // HTML kucultucu
    htmlmin: {
      options: {
        removeComments: true,         // Yorumlari sil
        collapseWhitespace: true      // Bosluklari sil
      },
      index: {
        src: '<%= config.buildDir %>/index.html',
        dest: '<%= config.buildDir %>/index.html'
      },
      dist: {
        expand: true,
        cwd: '<%= config.tmpDir %>',
        src: 'views/**/*.html',
        dest: '<%= config.tmpDir %>'
      }
    }
  });

  grunt.task.run('notify_hooks'); // Bilgilendirme eklentisini hemen calistir...

  // Gorev tanimlari - Varsayilan gorevler
  grunt.registerTask('default', [
    'clean',
    'jshint',
    'jsonlint',
    'copy:imgtmp',
    'sprite',
    'stylus',
    'copy',
    'template:dev',
    'connect:server',
    'watch'
  ]);

  // Test gorevleri. ($ grunt test)
  grunt.registerTask('test', [
    'clean',
    'jshint',
    'jsonlint',
    'copy',
    'template:dev',
    'karma'
  ]);

  // Yayinlama gorevleri. Productiona giderken bunlar calistirilir ($ grunt package)
  grunt.registerTask('package', [
    'clean',
    'bower:install',
    'template:dist',
    'useminPrepare',
    'copy:imgtmp',
    'sprite',
    'stylus',
    'copy:img',
    'copy:htmltmp',
    'copy:js',
    'htmlmin:dist',
    'ngtemplates',
    'ngmin',
    'uglify:vendor',
    'uglify:app',
    'filerev',
    'usemin',
    'cdn',
    'string-replace',
    'htmlmin:index'
  ]);

  // Dokumantasyon goruntuleme gorevleri ($ grunt docs)
  grunt.registerTask('docs', [
    'ngdocs',
    'connect:docs'
  ]);

  // Javascript degisikliklerinde calisan taskler (watch mode icin)
  grunt.registerTask('refreshJSs', [
    'jshint',
    'copy:js'
  ]);

  // HTML degisikliklerinde calisan taskler (watch mode icin)
  grunt.registerTask('refreshHTMLs', [
    'copy:html',
    'template:dev'
  ]);

};
