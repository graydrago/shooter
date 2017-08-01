"use strict";

let CopyWebpackPlugin = require('copy-webpack-plugin');
let webpack = require('webpack');

module.exports = [
  {
    context: __dirname,
    entry: "./src/core.ts",
    output: {
      path: __dirname + "/build/public/",
      filename: "js/script.js",
    },
    module: {
      loaders: [
        { test: /\.ts?$/, loader: 'ts-loader' },
        { test: /\.css$/, loader: "style-loader!css-loader" }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: 'src/index.html', to: 'index.html' },
        { from: 'src/vendor/three.min.js', to: 'src/vendor/three.min.js' },
      ]),
    ],
    devtool: "source-map"
  }
];
