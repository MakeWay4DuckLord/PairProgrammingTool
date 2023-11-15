/**
 * This is a configuration file for the webpack used for creating the React server.
*/

// used for joining directory with src path
const path = require('path');



// export a configuration for the index.jsx file on the web server
module.exports = [
  {
    name: 'webpack',
    mode: "development",
    entry: './src/app/index.js',
    target: 'web',
    output: {
      // name of the script used in the webview panel
      filename: 'index.js',
      // put this index "file" (that is never actually created) inside the app directory
      path: path.resolve(__dirname, './src/app')
    },
    resolve: {
      // look for js first then jsx if searching for a specific filename
      extensions: ['.js', '.jsx'],
      fallback: {
        "os": false
      }
    },
    module: {
      rules: [
        {
          exclude: /node_modules/,
          // needed to bypass the automatic JSON importing
          test: /\.(js|jsx)$/,
          // uses the babel loader (which is the reason for .babelrc file)
          use: [{
            loader: 'babel-loader'
          }]
        }, 
        {
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 0,
                modules: true,
              },
            }
          ],
          exclude: /node_modules/,
          test: /\.(css)$/,
        },
      ]
    },
    // creates the server that the script is found on 
    // running on port 3000
    devServer: {
      compress: true,
      // hot modular replacement
      hot: true,
      port: 8080,
      // get rids of the repeated header error
      allowedHosts: 'all'
    }
  }
];