
  module.exports = [{
  filename: '/private/var/www/django-webpack-ssr/project/templates/todo-react.html',
  template: '/private/var/www/django-webpack-ssr/project/templates/todo-react.ejs',
  chunks: [ 'todoReact' ],
  publicPath: 'dist',
  minify: false,
  inject: false
},{
  filename: '/private/var/www/django-webpack-ssr/project/templates/login.html',
  template: '/private/var/www/django-webpack-ssr/project/templates/login.ejs',
  chunks: [ 'login' ],
  publicPath: 'dist',
  minify: false,
  inject: false
},{
  filename: '/private/var/www/django-webpack-ssr/project/templates/todo-vue.html',
  template: '/private/var/www/django-webpack-ssr/project/templates/todo-vue.ejs',
  chunks: [ 'todoVue' ],
  publicPath: 'dist',
  minify: false,
  inject: false
}];
