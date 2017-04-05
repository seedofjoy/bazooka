const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,

  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './index.js',
  ],
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/dist',
  },

  devtool: 'inline-source-map',

  devServer: {
    hot: true,
    contentBase: __dirname,
    publicPath: '/dist',
  },

  module: {},

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};
