// Karma configuration
// Generated on Fri Oct 16 2015 18:21:34 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon', 'browserify'],

    // list of files / patterns to load in the browser
    files: [
      // Braintree Dependencies
      'client/lib/braintree-web/dist/braintree.js',
      // Typeahead Dependencies
      'client/lib/jquery/dist/jquery.js',
      'client/lib/typeahead.js/dist/typeahead.bundle.js',
      //Angular Material Dependencies
      'client/lib/angular/angular.js',
      'client/lib/angular-animate/angular-animate.js',
      'client/lib/angular-aria/angular-aria.js',
      'client/lib/angular-material/angular-material.js',
      'client/lib/angular-ui-router/release/angular-ui-router.js',
      'client/lib/angularjs-geolocation/src/geolocation.js',
      'client/lib/angular-strap/dist/angular-strap.min.js',
      'client/lib/angular-strap/dist/angular-strap.tpl.min.js',
      'client/lib/angular-mocks/angular-mocks.js',
      // Image Uploading Dependencies
      'client/lib/cloudinary_ng/js/angular.cloudinary.js',
      'client/lib/ng-file-upload/ng-file-upload-shim.js',
      'client/lib/ng-file-upload/ng-file-upload.js',
      // App Files
      // 'client/dist/**/*.js',
      'client/*.js',
      'client/controllers/**/*.js',
      'client/directives/**/*.js',
      'server/helpers.js',
      'spec/**/*.js',
      'client/views/**/*.html',
    ],

    ngHtml2JsPreprocessor: {
      // If your build process changes the path to your templates,
      // use stripPrefix and prependPrefix to adjust it.
      stripPrefix: 'client/',
      // prependPrefix: "web/path/to/templates/",

      // the name of the Angular module to create
      moduleName: 'my.templates',
    },

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'spec/server/**/*.js': ['browserify'],
      'client/*.js': ['coverage'],
      'client/controllers/**/*.js': ['coverage'],
      'client/directives/**/*.js': ['coverage'],
      'server/helpers.js': ['coverage'],
      'client/views/**/*.html': ['ng-html2js'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,
  });
};
