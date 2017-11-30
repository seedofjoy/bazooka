const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,

  entry: ['./index.js'],

  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/dist',
  },

  devtool: 'inline-source-map',

  devServer: {
    contentBase: __dirname,
    publicPath: '/dist',
  },

  module: {},

  resolve: {
    alias: {
      bazooka: resolve(__dirname, '../../src/main.js'),
    },
  },

  plugins: [new webpack.NamedModulesPlugin()],
};
