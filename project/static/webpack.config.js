/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
"use strict";

const { resolve, join } = require("path");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const htmlWebpackPluginConfig = require("./html-webpack-plugin-output");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ENV = process.argv.find((arg) => arg.includes("NODE_ENV=production"))
  ? "production"
  : "development";
const IS_DEV = ENV === "development";

const IS_DEV_SERVER = process.argv.find((arg) =>
  arg.includes("webpack-dev-server")
);
const OUTPUT_PATH = IS_DEV_SERVER ? resolve("dist") : resolve("dist");

/**
 * Plugin configuration
 */
const plugins = [
  new CleanWebpackPlugin(),
  new ExtractTextPlugin("css/[name].bundle.css"),
]
  // every Django template page should have its own HtmlWebpackPlugin
  .concat(
    htmlWebpackPluginConfig.map((pageConfig) => new HtmlWebpackPlugin(pageConfig))
  );

function srcPath(subdir) {
  return join(__dirname, "src", subdir);
}

const shared = (env) => {
  if (!IS_DEV_SERVER) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false,
        reportFilename: "../report/report.html",
        statsFilename: "../report/stats.json",
        generateStatsFile: true,
        statsOptions: {
          chunkModules: true,
          children: false,
          source: false,
        },
      })
    );
  }

  let cssLoaders = [
    {
      loader: "css-loader",
      options: { importLoaders: 1 },
    },
    {
      loader: "postcss-loader",
      options: {
        plugins: (loader) => [
          require("postcss-import")({ root: loader.resourcePath }),
          require("postcss-preset-env")({
            browsers: "last 2 versions",
          }),
          ...(IS_DEV ? [] : [require("cssnano")()]),
        ],
      },
    },
  ];

  return {
    entry: {
      // one js per django template
      todo: "./src/todo.js",
      login: "./src/login.js",
    },
    devtool: "cheap-module-source-map",
    mode: ENV,
    output: {
      path: OUTPUT_PATH,
      filename: "js/[name].bundle.js",
    },
    // add code splitting for sharing code
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: cssLoaders,
          }),
        },
        {
            test: /\.(png|jpe?g|gif)$/,
            loader: 'url-loader?limit=10000&name=img/[name].[ext]'
        }
      ],
    },
    resolve: {
      extensions: [".js", ".json"],
    },
    plugins,
  };
};

module.exports = (env = {}) => {
  return [shared(env)];
};
