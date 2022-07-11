const webpack = require('webpack');
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const library = 'axios';

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'ts',
          target: 'es2015',
          implementation: esbuild
        }
      }
    ]
  },
  entry: './src/index.ts',
  output: {
    filename: 'axios.js',
    path: path.resolve(__dirname, 'example'),
    library,
    libraryTarget: 'umd',
    libraryExport: 'default',  // export the default as window.MyClass
  },
  plugins: [
    new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8')),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
};
