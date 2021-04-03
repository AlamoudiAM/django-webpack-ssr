
  module.exports = [{
  filename: '/var/www/django-webpack-ssr/project/templates/todo-react.html',
  template: '/var/www/django-webpack-ssr/project/templates/todo-react.ejs',
  chunks: [ 'todoReact' ],
  publicPath: 'dist',
  minify: false,
  inject: false
},{
  filename: '/var/www/django-webpack-ssr/project/templates/login.html',
  template: '/var/www/django-webpack-ssr/project/templates/login.ejs',
  chunks: [ 'login' ],
  publicPath: 'dist',
  minify: false,
  inject: false
}];
