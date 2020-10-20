/* for generating/updating initial HtmlWebpackPlugin config */

var path = require("path");
const outputPath = path.join(__dirname, 'html-webpack-plugin-output.js');
const fs = require('fs'); 
const util = require('util');
const { execSync } = require('child_process');
var isFstTime = false;

try {
  var htmlWebpackPluginConfig = require('./html-webpack-plugin-output');
  htmlWebpackPluginConfig = htmlWebpackPluginConfig.map(item => util.inspect(item));
} catch(err) {
  var htmlWebpackPluginConfig = [];
}

// get path for files with .ejs ext.
const stdout = execSync('find .. -name "*.ejs" ! -path "*/node_modules/*"').toString();
var ejsFiles = stdout?.split('\n');
ejsFiles = ejsFiles.filter((item)=>Boolean(item));

function isPageExist (ejsFile) {
  for(var i=0; i < htmlWebpackPluginConfig.length; i++){
    const config = htmlWebpackPluginConfig[i];
    if(config.indexOf(ejsFile) !== -1){
      return true;
    }
  }
  return false;
}

for(var i=0; i < ejsFiles.length; i++){
  // get file location
  const filePath = ejsFiles[i];
  const extension = path.extname(filePath);
  const file = path.basename(filePath,extension);

  if(isPageExist(`${file}.ejs`))
    continue;
    
  // setup plugin call for each page
  htmlWebpackPluginConfig.push(`${util.inspect({
    filename: path.join(__dirname, path.dirname(filePath), `${file}.html`), // the generated Django template file name
    template: path.join(__dirname, filePath), // here you should write your Django template which will be used to generate the actual django template (page-one.html)
    chunks: [file], // for optimization only include the needed entry (bundles)
    publicPath: 'dist',
    minify: false,
    inject: false
  })}`);
}

// store them in file
const pluginCallsStr = `
  module.exports = [${htmlWebpackPluginConfig.join(',')}];
`;
fs.writeFileSync(outputPath, pluginCallsStr);
