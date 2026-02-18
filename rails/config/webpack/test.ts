// The source code including full typescript support is available at:
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/test.js

import webpackConfig from './webpackConfig';

const testOnly = (): void => {
  // place any code here that is for test only
};

export default webpackConfig(testOnly);
