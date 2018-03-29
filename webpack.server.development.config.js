const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: [path.resolve(__dirname, './src/client/index.jsx'), 'webpack-hot-middleware/client'],
  output: {
    path: path.resolve(__dirname, './src/server/static'),
    filename: 'app.client.bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  stats: 'none',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
