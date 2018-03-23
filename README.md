# 35 Steps to configure a React/Redux project
The other day I was wondering about how many steps it takes to configure a React/Redux boilerplate?, So I decided to initiate the creation of this step by step guide. This is still a work in progress...

This guide supposes the user has some experience with the Command Line Interface for _npm_ and _git_.

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
  entry: './src/client/app.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
  },
};
```
Up to this point, we have Webpack 4 ready to bundle JavaScript code! Create the _src/client/app.jsx_ file and put some Vanilla Javascript code, let's say:
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
  4. Update the file ./src/client/app.jsx to console.log(12345678900)
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
  './src/client/app.jsx',
  'webpack-hot-middleware/client',
]
```

### 24. Webpack to accept updates **module.hot**
Add this inside the ./src/client/app.jsx file
```js
if (module.hot) {
  module.hot.accept();
}
```
Up to this point any change we do in ./src/client/app.jsx will be automatically reflected in the browser, with no page refresh needed.

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
