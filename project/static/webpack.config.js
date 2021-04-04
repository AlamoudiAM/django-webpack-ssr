const path = require('path');
const webpack = require('webpack');
const htmlWebpackPluginConfig = require("./html-webpack-plugin-output");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { resolve, join } = require("path");

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new MiniCssExtractPlugin(),
]
  // every Django template page should have its own HtmlWebpackPlugin
  .concat(
    htmlWebpackPluginConfig.map(
      (pageConfig) => new HtmlWebpackPlugin(pageConfig)
    )
  );

module.exports = {
  entry: {
    // one js per django template
    login: "./src/login.js",
    todoReact: "./src/todo-react.js",
  },
  optimization: {
    splitChunks: {
    // add code splitting for sharing code
      chunks: "all",
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
        }]
      }
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "[name].bundle.js",
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true,
  },
  plugins: plugins,
};