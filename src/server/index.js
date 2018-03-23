var argv = require('attrs.argv');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../../webpack.config.js');
const path = require('path');

// CLI Arguments
const { NODE_ENV } = argv;

// Webpack Configuration Object
const webpackConfig = config({
  env: {
    NODE_ENV,
  },
});
const compiler = webpack(webpackConfig);

const app = express();
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  stats: {
    colors: true,
  },
}));
app.use(webpackHotMiddleware(compiler));


app.use(express.static(path.join(`${__dirname}/static`)));
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

app.listen(3000, () => {
  console.log('Server running at port 3000');
});
