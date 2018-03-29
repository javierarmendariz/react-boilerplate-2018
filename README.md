# 47 Steps to configure a React/Redux project
The other day I was wondering about how many steps it takes to configure a React/Redux boilerplate?, So I decided to initiate the creation of this step by step guide. This is still a work in progress...

This guide supposes the user has some experience with the Command Line Interface for _npm_ and _git_.

- [Initial Configuration](#initial-configuration)
- [Configuring React](#configuring-react)
- [Configuring the Server](#configuring-the-server)
- [Hot Module Reloading (HMR)](#hot-module-reloading-hmr)
- [Development configurations](#development-configurations)
- [Unit Testing](#unit-testing)
- [Redux](#redux)
- [Server Side Rendering](#server-side-rendering)

## Initial Configuration
### 1. Install in this order
  * **nvm** https://github.com/creationix/nvm#installation , use the CURL option
  * **avn** https://github.com/wbyoung/avn#install
  * **oh-my-zsh** https://github.com/robbyrussell/oh-my-zsh  

### 2. Create **.gitignore**
In your project root directory create the file _.gitignore_ with the content:
```
.DS_STORE
/node_modules
/dist
package-lock.json
```  
This will specify intentionally untracked files to ignore.

### 3. Create **package.json** file
```
npm init --yes
```

### 4. Create the **.node-version** file.
And add the node semver number (9.8.0 at the time of writing this Readme)
```
9.8.0
```

### 5. Only for Atom users
Make Atom to ignore _node_modules_. Since we have not configured any GIT repository yet, Atom will read the entire node_modules directory. Which will cause some plugins/packages to fail. So, go ahead to the Preferences and add *node_modules* in the _Ignored Names_ list section.

### 6. Install **eslint**
```
npm i eslint --save-dev
```

### 7. Setup the **eslint** configuration file
```
eslint --init
```
And use this configuration
```
How would you like to configure ESLint? Use a popular style guide
Which style guide do you want to follow? AirBnB
What format do you want your config file to be in? JavaScript
```

### 8. Install the following npm eslint dependencies:
* **eslint-plugin-react**
```
npm i eslint-plugin-react@latest --save-dev
```
* **eslint-plugin-jsx-a11y**
```
npm i eslint-plugin-jsx-a11y@latest --save-dev
```
* **eslint-plugin-import**
```
npm i eslint-plugin-import@latest --save-dev
```  

### 9. Install webpack
```
npm i webpack webpack-cli --save-dev
```

### 10. Create the **webpack.config.js** file with the initial configuration:
```js
const path = require('path');

module.exports = {
  entry: './src/client/App.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
```
Up to this point, we have Webpack 4 ready to bundle JavaScript code! Create the _src/client/App.jsx_ file and put some Vanilla Javascript code, let's say:
```js
console.log(1234567890);
```
Then run:
```
webpack --mode development
```
This will create the _bundle_ under the _./dist_ directory.

## Configuring React
### 11. Install **react** and **react-dom**
```
npm i react react-dom --save
```

### 12. Install **Babel**
```
npm install --save-dev babel-loader babel-core
```

### 13. Update the **webpack.config.js** file
We will now include the _babel loader_ as follow:
```js
module: {
  rules: [
    {
      test: /\.jsx$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    },
  ],
}
```
Notice the _exclude_ property, this will prevent _Webpack_ to apply the loader on the node_modules directory

### 14. Install **babel-preset-env**
Which enables transforms for _ES2015+_
```
npm install babel-preset-env --save-dev
```

### 15. Create the **.babelrc** file and add:
```js
{
  "presets": ["env"]
}
```

### 16. Install Babel plugins for React
```
npm install --save-dev babel-cli babel-preset-react
```

### 17. Add this new plugin into the **.babelrc** file
```js
{
  "presets": ["env", "react"]
}
```

Up to this point, we already have our initial Webpack 4 configuration with support for:
  * ES15+
  * React
  * Eslint

## Configuring the Server
### 18. Install **express**
```
npm i express --save
```
### 19. Install **webpack-dev-middleware** (Emission of files)
```
npm i webpack-dev-middleware --save-dev
```
### 20. Create the **server script**
The server script should be placed at this path: /src/server/index.js
```js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const config = require('../../webpack.config.js');

const compiler = webpack(config);

const app = express();
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

app.listen(3000, () => {
  console.log('Server running at port 3000');
});

```
We now have a Web server running on the port 3000. And any file change will trigger the build process, and the Server will be updated automatically. To see this in action do this:

  1. Run the Server: node ./src/server
  2. Visit http://localhost:3000/app.bundle.js. You should see the bundle created by Webpack
  3. Look for: console.log(1234567890)
  4. Update the file ./src/client/App.jsx to console.log(12345678900)
  5. Refresh http://localhost:3000/app.bundle.js
  6. Look for: console.log(12345678900)

## Hot Module Reloading **(HMR)**
### 21. webpack-hot-middleware
Install this new dev package
```
npm i webpack-hot-middleware --save-dev
```
Add it to the server script:
```js
const webpackHotMiddleware = require('webpack-hot-middleware');
app.use(webpackHotMiddleware(compiler));
```

### 22. Hot Module Reloading plugin
Add the following plugin in the webpack.config.js file
```js
plugins: [
  new webpack.HotModuleReplacementPlugin(),
],
```

### 23. Hot Module Reloading entry
Add a new entry in the webpack.config.js file
```js
entry: [
  './src/client/App.jsx',
  'webpack-hot-middleware/client',
]
```

### 24. Webpack to accept updates **module.hot**
Add this inside the ./src/client/App.jsx file
```js
if (module.hot) {
  module.hot.accept();
}
```
Up to this point any change we do in ./src/client/App.jsx will be automatically reflected in the browser, with no page refresh needed.

## Development configurations
### 25. Webpack **development mode**
Add this line in the webpack.config.js file
```js
mode: 'development',
```

### 26. **Source Map** in Webpack configuration
Add this line in the webpack.config.js file
```js
devtool: 'cheap-module-eval-source-map'
```

### 27. **Source Map** in Chrome
Make sure the _Enable JS source maps_ option is enabled as per Chrome documentation: [enable_source_maps_in_settings](https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps#enable_source_maps_in_settings)

Restart the server, you should then be able to see the project original files:

![Source map in Chrome](/readme/26.source-map-in-chrome.png)

### 28. Source Map Explorer
Install Source Map Explorer npm package
```
npm i source-map-explorer --save-dev
```
### 29. Update the webpack.config.js file
Add:
```js
mode: env.NODE_ENV === 'development' ? 'development' : 'production',
devtool: env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'source-map',
```
Convert module.exports to a function:
```js
module.exports = env => (
  {
    mode: env.NODE_ENV === 'development' ? 'development' : 'production',
    devtool: env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'source-map',
    /* The rest of the configuration goes here.
    .
    .
    .
    */
  }
);
```

### 30. Create a new script in the package.json file:
```json
"source-map-explorer-production": "webpack --env.NODE_ENV=production && ./node_modules/.bin/source-map-explorer ./dist/app.bundle.js"
```
Now you can analyze the bundle of the App running:
```
npm source-map-explorer-production
```
> The source map explorer determines which file each byte in your minified code came from. It shows you a treemap visualization to help you debug where all the code is coming from.

![Source Map Explorer](/readme/30.source-map-explorer.png)

By default we have set the _production mode_ to work with the _source-map-explorer_ package. Try to change the webpack.config.js to _development_, to see the difference in size of both configurations.
```js
mode: 'development'
```
Production: ~162Kb

Development: ~717Kb

### 31. Server script to accept Command Line arguments
Install attrs.argv
```
npm install attrs.argv
```
Update the Script server (/src/server/index.js):
```js
var argv = require('attrs.argv');
// CLI Arguments
const { NODE_ENV } = argv;

// Webpack Configuration Object
const webpackConfig = config({
  env: {
    NODE_ENV,
  },
});
const compiler = webpack(webpackConfig);
```
Also update the _publicPath_
```js
publicPath: webpackConfig.output.publicPath,
```
### 32. Create a new package.json scripts **_server-dev_**
```json
"server-dev": "node ./src/server NODE_ENV=development"
```
You should be able to run the _development_ server
```
npm run server-dev
```
## Unit Testing
### 33. **Jest**
```
npm i jest --save-dev
```
>Place your tests in a __tests__ folder, or name your test files with a .spec.js or .test.js extension. Whatever you prefer, Jest will find and run your tests.

Following Jest documentation we will create a new directory named _utils_ with the following structure (_/src/client/utils_):
```
|-- src
    |-- client
    |   |-- utils
    |       |-- arrays.js
    |       |-- __tests__
    |           |-- arrays.test.js
```
#### utils/array.js
```js
const concat = (arrayOne, arrayTwo) => (
  [...arrayOne, ...arrayTwo]
);

const lastElement = array => (
  array[array.length - 1]
);

export {
  concat,
  lastElement,
};
```
#### \__tests__/arrays.test.js
```js
import * as utils from '../arrays';

describe('Arrays', () => {
  test('concat', () => {
    const arrayOne = [1, 2, 3];
    const arrayTwo = [4, 5, 6];
    expect(utils.concat(arrayOne, arrayTwo)).toEqual([1, 2, 3, 4, 5, 6]);
  });
  test('Last item', () => {
    const receivedArray = ['one', 'two', 'three'];
    expect(utils.lastElement(receivedArray)).toBe('three');
  });
});
```
### 34. New package.json script **npm run test**
```json
"test": "./node_modules/.bin/jest --watch",
```
Execute the tests:
```
npm un test
```

### 35. Enzyme
```
npm i --save-dev enzyme enzyme-adapter-react-16
```
Create the following structure and files (/src/client/components/header/):
```
|-- src
    |-- client
    |   |-- components
    |   |   |-- header
    |   |       |-- Header.jsx
    |   |       |-- index.js
    |   |       |-- __tests__
    |   |           |-- Header.test.js
```
#### Header.jsx
```js
import React from 'react';

const Header = () => (
  <h1>Header!</h1>
);

export default Header;
```
#### index.js
```js
import Header from './Header.jsx';
export default Header;
```
#### Header.test.js
```js
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Header from '../Header';

Enzyme.configure({ adapter: new Adapter() });

describe('Header (component)', () => {
  it('has at least one <h1> tag', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.contains(<h1>Header!</h1>)).toBe(true);
  })
});
```
Execute the test script and Enzyme will run over Jest:
```
npm run tests
```

## Redux
### 36. Install **Redux**
```
npm i redux --save
```
### 37. Install **React Redux**
```
npm i react-redux --save
```

### 38. Create the **index.jsx** in the _client_ directory
./src/client/index.jsx
```js
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
```
### 39. **First Reducer**
Create the following file structure for the reducers configuration:
```
|-- src
    |-- reducers
    |   |-- index.js
    |   |-- inventory.js
```    
#### 40. Reducer: index.js
./src/client/reducers/index.js
```js
import { combineReducers } from 'redux';
import inventory from './inventory';

export { inventory };

export default combineReducers({
  inventory,
});
```
#### 41. Reducer: inventory.js
./src/client/reducers/inventory.js
```js
const inventory = (state = {}) => state;

export default inventory;
```

### 42. Simplify the App.jsx
./src/client/App.jsx
```js
import React from 'react';
import Header from './components/header';

const App = () => (
  <div>
    <Header />
  </div>
);

export default App;
```
### 43. **Redux DevTools**
Install the Chrome Addon [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd), so you can see the Store state structure. By now we only have the _inventory_ property with an empty object:

![Redux Devtools](./readme/43.redux-devtools.png)

## Server Side Rendering
We will organize a little bit our scripts and configurations, such way we have the _Development_ and _Configuration_ settings separated.
Basically the Server Side Rendering magic happens in the _Production Server_ file.

### 44. **Development Server**
src/server/index.development.js
```js
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
```
### 45. **Production Server**
src/server/index.production.js
```js
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
```
### 46. **Webpack Configuration**
#### Production Client
```js
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
```
#### Development Server
```js
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
```
#### Production Server
```js
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
```
### 47. NPM Scripts by Environment
Let's add the following scripts in the package.json file:
#### server-development
Will run the application using the configuration done in the section _Development configurations_
```json
"server-development": "node ./src/server/index.development.js NODE_ENV=development",
```
#### server-production
Will transpile both the Client and Server scripts, and then run the Express server.
```json
"server-production": "npm run client-production && webpack --config webpack.server.production.config.js && node ./dist/app.server.bundle.js",
```
#### client-production
Will transpile only the Client code.
```json
"client-production": "webpack --config webpack.client.production.config.js"
```
Summarizing:

![Diagram](./readme/47.npm-scripts-by-environment.png)
