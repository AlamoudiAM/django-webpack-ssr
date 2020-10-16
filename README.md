# django-webpack-ssr

## Goal 

The goal is to give Django Template an access to NPM ecosystem (babel, web comopnents, react, jsx, vue, antd ..etc)  while still having all Django sweets. 

## How ?

1. Write your JavaScript files while using NPM and modern technologies.

2. Write your Django Template as always and save it with `.ejs` extension. (You don't need to add `<script src="...">` since this what Webpack is for)

3. Now Webpack will bundle your JavaScript files and will generate new Django Template in HTML (based on `.ejs` files  you wrote before)

4. The generated HTML and JS should be ready to be used in Django Template.

## Why ?

In my experience, separating frontend from backend for solo developer is exhausting. I'm not saying it's a bad idea but I'm saying it isn't productive for single developer. As a solo developer I cannot handle:

- managing permissions in two places (backend and fronted)
- managing routings in two places (backend and fronted)

Also I'm losing great Django features such as:

- Quick and easy forms setup and validation (+ crispy form). 
- Form CSRF protection. 
- Easy passing data from views to Django Template.
- Builtin Authentication views.

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
  	// every django template page should have its own HtmlWebpackPlugin
    new HtmlWebpackPlugin({
        filename: 'page-one.html', // the generated django template file name
        chunks: ['pageOne'],  // for optimization only include the needed entry (bundles)
        template: 'src/page-one.ejs',	// here you should write your django template which will be used to generate the actual django template (page-one.html)
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
<%# ...write your django template as always... %>

<%# send data from django view to js %>
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
