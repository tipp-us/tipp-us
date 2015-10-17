// Karma configuration
// Generated on Fri Oct 16 2015 18:21:34 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      'client/lib/angular/angular.js',
      'client/lib/angular-animate/angular-animate.js',
      'client/lib/angular-aria/angular-aria.js',
      'client/lib/braintree-web/dist/braintree.js',
      'client/lib/angular-material/angular-material.js',
      'client/lib/angular-ui-router/release/angular-ui-router.js',
      'client/lib/angularjs-geolocation/src/geolocation.js',
      'client/lib/angular-mocks/angular-mocks.js',
      'client/lib/angular-typeahead/angular-typeahead.js',
      'client/*.js',
      'spec/**/*.js',
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

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
