import React from 'react';
import reactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import reducers from './reducers';

if (module.hot) {
  module.hot.accept();
}

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const AppConfiguration = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

reactDOM.render(<AppConfiguration />, document.getElementById('root'));
