import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from '../client/reducers';
import App from '../client/App';

const express = require('express');

const app = express();

app.use(express.static('./dist/public'));

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="./js/app.client.bundle.js"></script>
      </body>
    </html>
    `;
}

function handleRequest(req, res) {
  const store = createStore(reducers);
  const html = ReactDOMServer.renderToString(<Provider store={store}><App /></Provider>);
  const preloadedState = store.getState();
  res.send(renderFullPage(html, preloadedState));
}

app.use(handleRequest);

// Listen for connections (Start the server)
app.listen(3000, () => {
  console.log('Server running at port 3000');
});
