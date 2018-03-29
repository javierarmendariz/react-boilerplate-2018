const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../webpack.server.development.config.js');

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

app.get('/', (req, res) => {
  const html = `
  <html>
    <head>
    </head>
    <body>
      <div id="root"></div>
      <script src="http://localhost:3000/app.client.bundle.js"></script>
    </body>
  </html>

  `;
  res.send(html);
});

app.listen(3000, () => {
  console.log('Server running at port 3000');
});
