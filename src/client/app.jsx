import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header';

if (module.hot) {
  module.hot.accept();
}

const App = () => (<div><Header /></div>);

ReactDOM.render(<App />, document.getElementById('root'));
