
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  module.exports = [new HtmlWebpackPlugin({
  filename: '/private/var/www/django-webpack-ssr/project/templates/todo.html',
  template: '/private/var/www/django-webpack-ssr/project/templates/todo.ejs',
  chunks: [ 'todo' ],
  publicPath: 'dist',
  inject: false
})];
