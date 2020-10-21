# django-webpack-ssr

## Goal 

The goal is to give Django Template an access to NPM ecosystem (babel, web components, react, jsx, vue, antd ..etc.) while still having all Django sweets. 

## How?

1. Write your JavaScript files (react, vue ..etc.) using NPM and modern technologies.
   - Files location: Optionally, the files should be stored in `project/static/src`.
   - Specify JS files in `webpack.config.js`
     ```javascript
     entry: {
       // rule of thumb: one js per django template
       todo: "./src/todo.js",
     },
     ```
     - Note: any package 

2. Write your Django Template (as always you do) and save it with `.ejs` extension (!NOT HTML).
   - Use Django [`{{ json_script }}`](https://docs.djangoproject.com/en/3.1/ref/templates/builtins/#json-script) tag to pass initial data from Django view to JavaScript.
   - [Pass CSRF-token to Javascript](https://docs.djangoproject.com/en/3.1/ref/csrf/#acquiring-the-token-if-csrf-use-sessions-or-csrf-cookie-httponly-is-true) if needed.
   - Tell webpack where to generate `<script src="...">` by using this snippet
    ```ejs
    <% htmlWebpackPlugin.tags.bodyTags.forEach( tag => { %>
      <% if (tag.tagName == 'script') {%>
          <script src="{% static "<%= tag.attributes.src %>" %}"></script>
      <% } %>
    <% }) %>
    ```
   - Tell webpack where to generate `<link href="...">` by using this snippet
    ```ejs
    <% htmlWebpackPlugin.tags.headTags.forEach( tag => { %>
      <% if (tag.tagName == 'link') {%>
          <link href="{% static "<%= tag.attributes.href %>" %}" rel="stylesheet">
      <% } %>
    <% }) %>
    ```
   - Files location:
     - The files can be located anywhere.
     - Either specify the location manually in `HtmlWebpackPlugin`. 
     - Or use [this script](project/static/html-webpack-plugin-generator.js) to find all `.ejs` files in project and setup them for HtmlWebpackPlugin configuration.
     - run `npm run watch` for development or `npm run build:prod` for production. `.ejs` will be converted to `.html` and be saved as same location as `.ejs` files. 

3. Webpack will bundle your JavaScript files and will generate new Django Template in HTML (based on `.ejs` files you wrote before).

4. The generated HTML and JS should be ready to be used in Django Template.

## Demo



## Why?

In my experience, separating frontend from backend for solo developer is exhausting. I'm not saying it's a bad idea but I'm saying it isn't productive for single developer. As a solo developer I cannot handle:

- managing permissions in two places (backend and fronted).
- managing routings in two places (backend and fronted).

Also I'm losing great Django features such as:

- Quick and easy forms setup and validation (+ crispy form). 
- Form CSRF protection. 
- Passing initial data from views to Django Template.
- Built-in Authentication views.

On the other hand, I still need to use NPM ecosystem for modernity.

## Requirements

- Nodejs
  - webpack
  - webpack-cli
  - html-webpack-plugin

## Snippets

**webpack.config.js**

```js
const { resolve, join } = require('path');

module.exports = {
  entry: {
    // one js per django template
    pageOne: './src/page-one.js',
    pageTwo: './src/page-two.js',
  },
	/* ... */
  plugins: [
  	// every Django template page should have its own HtmlWebpackPlugin
    new HtmlWebpackPlugin({
        filename: 'page-one.html', // the generated Django template file name
        chunks: ['pageOne'],  // for optimization only include the needed entry (bundles)
        template: 'src/page-one.ejs',	// here you should write your Django template which will be used to generate the actual django template (page-one.html)
        inject: false
    }),
    new HtmlWebpackPlugin({
        filename: 'page-two.html',
        chunks: ['pageTwo'],
        template: 'src/page-two.ejs',
        inject: false
    })
	],
  /* ... */
  // add code splitting for sharing code
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
  }
};
```

**page-one.ejs** and **page-two.ejs** (it uses [ejs](https://ejs.co/#docs) for templating)

```ejs
<%# ...write your Django template as always... %>

<%# send data from Django view to js %>
{{ data_1|json_script:"data-1" }}
{{ data_2|json_script:"data-2" }}

<%# add the generated js bundles %>
<% htmlWebpackPlugin.tags.bodyTags.forEach( tag => { %> 
    <% if (tag.tagName == 'script') {%> 
        <script src="{% static js/<%= tag.attributes.src %> %}"></script>
    <% } %> 
<% }) %> 
```

# References

- [spectrum-web-components webpack example](https://github.com/adobe/spectrum-web-components/tree/main/projects/example-project-webpack)
- [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)
  - [examples/custom-insertion-position](https://github.com/jantimon/html-webpack-plugin/tree/master/examples/custom-insertion-position)
- [html-webpack-template](https://github.com/jaketrent/html-webpack-template)
  - [index.ejs](https://github.com/jaketrent/html-webpack-template/blob/master/index.ejs)
