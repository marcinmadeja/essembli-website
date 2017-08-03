if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const options = {
  sourceMap: process.env.NODE_ENV === 'development' ? true : false
};

console.log('--------------------------------');
console.log(process.env.NODE_ENV);
console.log('--------------------------------');

var user_plugins = [
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    Tether: 'tether'
  }),

  new ExtractTextPlugin({
    filename: 'style.bundle.css',
    allChunks: true
  }),

  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor', 'manifest']
  }),

  new HtmlWebpackPlugin({
    title: 'Essembli',  
    template: 'ejs-loader!src/index.ejs'
  }),

  // for async in script tag
  // new ScriptExtHtmlWebpackPlugin({
  //   defaultAttribute: 'async'
  // }),

  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),

  new BrowserSyncPlugin({
    host: 'localhost',
    port: 3000,
    files: ['./assetsss/*.html'],
    server: { baseDir: ['dist'] }
  })
];

if (process.env.NODE_ENV === 'development') {
  user_plugins.push(
    new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/,
        minimize: true
    })
  );
}


const VENDOR_LIBS = [
  'lodash'
];

const config = {
  entry: {
    bundle: './src/scripts/index.js',
    sass: './src/sass/main.scss',
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devtool: "source-map",
  module: {   
    rules: [
      // babel
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },

      // sass
      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            query: {
              minimize: true,
              modules: false,
              sourceMap: options.sourceMap,
              importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader',
              query: {
                sourceMap: options.sourceMap,
                sourceMapContents: options.sourceMap
              }
          }
        ]
        })
      },
      // sass end

      { 
        test: /\.(woff|woff2|eot|ttf)$/, 
        loader: 'url-loader?limit=100000',
      },

      // img loaders
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                mozjpeg: {
                  progressive: true,
                },
                gifsicle: {
                  interlaced: true,
                },
                optipng: {
                  optimizationLevel: 7,
                }
              }
            }
          }
        ]
      }
    ] //rules end
  },
  watch: true,
  plugins: user_plugins
};

module.exports = config;
