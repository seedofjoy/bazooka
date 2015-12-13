var path = require("path");
var webpack = require('webpack');

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      '**/*Spec.js'
    ],

    exclude: [],

    preprocessors: {
      '**/*Spec.js': ['webpack']
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['PhantomJS'],

    plugins: [
      'karma-webpack',
      'karma-jasmine',
      'karma-phantomjs-launcher'
    ],

    webpack: {
      resolve: {
        alias: {
          bazooka: path.join(__dirname, '..', 'src', 'main.js'),
        },
        modulesDirectories: ["node_modules", "src"],
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
      ],
    },

    webpackMiddleware: {
      noInfo: true
    },

    singleRun: false
  });
};
