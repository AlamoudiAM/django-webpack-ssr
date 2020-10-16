var path = require("path");
const fs = require('fs'); 
const util = require('util');
const { execSync } = require('child_process');
// get path for files with .ejs ext.
const stdout = execSync('find .. -name "*.ejs" ! -path "*/node_modules/*"').toString();
var ejsFiles = stdout?.split('\n');
ejsFiles = ejsFiles.filter((item)=>Boolean(item));

var pluginCalls = [];

ejsFiles.forEach(filePath => {
  // get file location
  const extension = path.extname(filePath);
  const file = path.basename(filePath,extension);

  // setup plugin call for each page
  pluginCalls.push(`new HtmlWebpackPlugin(${util.inspect({
    filename: path.join(__dirname, path.dirname(filePath), `${file}.html`), // the generated Django template file name
    template: path.join(__dirname, filePath), // here you should write your Django template which will be used to generate the actual django template (page-one.html)
    chunks: [file], // for optimization only include the needed entry (bundles)
    publicPath: 'dist',
    inject: false
  })})`);
});

// store them in file
const pluginCallsStr = `
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  module.exports = [${pluginCalls.join(',')}];
`;
fs.writeFileSync(path.join(__dirname, 'html-webpack-plugin-output.js'), pluginCallsStr);
