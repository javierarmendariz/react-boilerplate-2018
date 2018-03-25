const path = require('path');
const webpack = require('webpack');

module.exports = env => ({
  mode: env.NODE_ENV === 'development' ? 'development' : 'production',
  devtool: env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'source-map',
  entry: [path.resolve(__dirname, './src/client/index.jsx'), 'webpack-hot-middleware/client'],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'app.bundle.js',
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
});
