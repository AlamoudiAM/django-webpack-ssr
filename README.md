# django-webpack-ssr

*Start simple, grow complex*
*Best of both worlds*
*Next, Nuxt alternative*
**This guide will let you use (react, vue ..etc.) with django as server-side rendering and multi page app.**

## Goal 

The goal is to give Django Template an access to NPM ecosystem (babel, web components, react, jsx, vue, antd ..etc.) while still having all Django sweets. 

## Visualizing Process
### Diagram
### Screenshots

## Requirements

- Nodejs
  - webpack
  - webpack-cli
  - html-webpack-plugin

## How?

1. Write your JavaScript files (react, vue ..etc.) using NPM and modern technologies. Rule of thumb: one js per django template.
   - Files location: Optionally, the files stored in `project/static/src`.
   - Specify JS files in `webpack.config.js`
     ```javascript
     entry: {
       // rule of thumb: one js per django template
       todo: "./src/todo.js",
     },
     ```

2. Write your Django Template (as always you do) and save it with `.ejs` extension (NOT HTML yet!).
   - Use Django [`{{ json_script }}`](https://docs.djangoproject.com/en/3.1/ref/templates/builtins/#json-script) tag to pass initial data from Django view to JavaScript. **This will make your page render so fast**. 
   - [Pass CSRF-token to Javascript](https://docs.djangoproject.com/en/3.1/ref/csrf/#acquiring-the-token-if-csrf-use-sessions-or-csrf-cookie-httponly-is-true) when using `POST`, `PUT`, and `DELETE` methods.
   - You don't have to specify `<script src="...">` since this what Webpack is for. Just tell webpack where to generate `<script src="...">` by using this snippet
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
     - Either specify the location manually in `HtmlWebpackPlugin`. Example:
       ```javascript
       plugins: [
          // every Django template page should have its own HtmlWebpackPlugin
          HtmlWebpackPlugin({
            filename: '../templates/todo.html',  // the generated Django template file name
            template: '../templates/todo.ejs', // here you should write your Django template which will be used to generate the actual django template (todo.html)
            chunks: [ 'todo' ],  // for optimization only include the needed entry (bundles)
            publicPath: 'dist',
            minify: false,
            inject: false
          }),
	     ],
       ```
     - Or use [this script](project/static/html-webpack-plugin-generator.js) to find all `.ejs` files in project and generate initial configs for HtmlWebpackPlugin.
     - run `npm run watch` for development or `npm run build:prod` for production. Now `.ejs` will be converted to `.html` and be saved as same location as `.ejs` files. 

3. Webpack will bundle your JavaScript files and will generate new Django Template in HTML (based on `.ejs` files you wrote before).

4. The generated HTML and JS should be ready to be used in Django Template.

## Demo
**this demo for showing you the capabilities. It isn't intended to be used for production**
The demo implement a todo app in Vue and React. View authentication, routing, initial data, and API are handled by Django.

### Run

### Demo Code Explanation

## Why?

In my experience, separating frontend from backend for solo developer is exhausting. I'm not saying it's a bad idea but I'm saying it isn't productive for single developer. As a solo developer I cannot handle:

- managing permissions in two places (backend and fronted).
- managing routings in two places (backend and fronted).

Also I'm losing great Django features such as:

- Quick and easy forms setup and validation (+ crispy form). 
- Form CSRF protection. 
- Passing initial data from views to Django Template (Benefit: data displayed faster on user screen than calling API via DRF).
- Built-in Authentication views.

On the other hand, I still need to use NPM ecosystem for modernity.

## React vs Vue. Whats is better for Django ?

- In my opinion, Vue integrates very well with Django template. With Vue, you can throw all components in Django template and have more control over components from server side (e.g. use Django `url` template tag within Vue components). On other hand, with react, all data have to be pushed to javascript so react can control it and django template only have little power over what react can do (e.g. Django template only used for page routing and authorization).
- In addition, in Vue, it's easy to share states between multiple instances (multiple `new Vue({})`). Unlike Vue, in react to share state between multiple instances (multiple `ReactDOM.render()`), you have to use [portals](https://reactjs.org/docs/portals.html) and context. For react, this isn't straightforward and needs more code.
- Regardless, react has better ecosystem with enterprise first-citizen support (👍 antd vs 👎 antdv, fluentui, ..etc.). and in react most packages are up to date.

# References

- [spectrum-web-components webpack example](https://github.com/adobe/spectrum-web-components/tree/main/projects/example-project-webpack)
- [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)
  - [examples/custom-insertion-position](https://github.com/jantimon/html-webpack-plugin/tree/master/examples/custom-insertion-position)
- [html-webpack-template](https://github.com/jaketrent/html-webpack-template)
  - [index.ejs](https://github.com/jaketrent/html-webpack-template/blob/master/index.ejs)
