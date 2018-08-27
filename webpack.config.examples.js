'use strict';

var fs = require('fs');
var path = require('path');
var zipObject = require('lodash.zipobject');

var EXAMPLES_BASE_DIR = path.join(__dirname, 'examples');

var getDirectories = function(srcPath) {
  return fs.readdirSync(srcPath).filter(function(file) {
    return fs.statSync(path.join(srcPath, file)).isDirectory() &&
      file.indexOf('_') !== 0;
  });
};

var makeFullPath = function(p) {
  return path.join(EXAMPLES_BASE_DIR, p);
};

var makeAppPath = function(dir) {
  return path.join(dir, 'app.js');
};

var examplesNames = getDirectories(EXAMPLES_BASE_DIR);
var examplesPaths = examplesNames.map(makeFullPath);
var examplesAppPaths = examplesPaths.map(makeAppPath);

var entry = zipObject(examplesNames, examplesAppPaths);

var modulesDirectories = ['node_modules', 'src'];
modulesDirectories = modulesDirectories.concat(examplesPaths);

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      bazooka: path.join(__dirname, 'src', 'main.js'),
    },
    modules: modulesDirectories,
  },
};
