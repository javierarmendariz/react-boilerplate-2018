const path = require('path');

module.exports = {
  mode: 'production',
  target: 'web',
  entry: path.resolve(__dirname, './src/client/index.jsx'),
  output: {
    path: path.resolve(__dirname, './dist/public/js'),
    filename: 'app.client.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  stats: 'none',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
