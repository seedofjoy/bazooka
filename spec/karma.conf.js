module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['browserify', 'jasmine'],

    files: [
      '**/*Spec.js'
    ],

    exclude: [],

    preprocessors: {
      '**/*Spec.js': ['browserify']
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['PhantomJS'],

    plugins: [
      'karma-browserify',
      'karma-jasmine',
      'karma-phantomjs-launcher'
    ],

    browserify: {
      plugin: ['proxyquireify/plugin']
    },

    singleRun: false
  });
};
