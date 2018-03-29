const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: path.resolve(__dirname, './src/server/index.production.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'app.server.bundle.js',
    publicPath: '/public/',
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
