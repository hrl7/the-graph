"use strict";
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const dashboard = new Dashboard();
const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
  console.log("production build");
}
const path = require('path');

module.exports = {
  entry: './src/main.js',
  target: 'web',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './dist/')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
      /*, {
        test: /\.jsx?$/,
        loader: 'babel-loader!eslint-loader',
        exclude: /node_modules/,
        enforce: "pre"
      } */
    ]
  },
  plugins: [
    new DashboardPlugin(dashboard.setData),
    new WebpackNotifierPlugin({
      title: 'Noflow App',
      alwaysNotify: true
    }),
  ],
 devtool: isProduction ? '' : 'inline-source-map',
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [
      'node_modules'
    ]
  },
  devServer: {
    contentBase: [
      path.join(__dirname, './src'),
      path.join(__dirname, './dist'),
      path.join(__dirname, './themes'),
      path.join(__dirname, './node_modules/font-awesome'),
      path.join(__dirname, './examples')],
    watchContentBase: true,
    compress: true,
    inline: true,
    port: 9000,
    https: false,
    quiet: true,
    host: "0.0.0.0",
    historyApiFallback: true
  },
  performance: {
    hints: false
  },
  node: {
    fs: "empty"
  }
};
