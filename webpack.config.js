const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'examples/src'),
  mode: 'development',
  entry: {
    app: './app.js',
  },
  output: {
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'examples/src'),
    disableHostCheck: true,
    port: 8000,
    host: "0.0.0.0",
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.css$/,
        use: [
               { loader: 'style-loader' },
               { loader: 'css-loader' }
             ],
      }
    ],
  },
  resolve: {
    alias: {
      'react-photo-gallery': path.resolve(__dirname, 'src/Gallery')
    }
  },
};
