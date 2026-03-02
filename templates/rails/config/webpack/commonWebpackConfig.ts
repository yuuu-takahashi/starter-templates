// The source code including full typescript support is available at:
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/commonWebpackConfig.js

import { Configuration } from 'webpack';
import shakapacker from 'shakapacker';

const { generateWebpackConfig, merge } = shakapacker;

const baseClientWebpackConfig = generateWebpackConfig();

const commonOptions: Partial<Configuration> = {
  resolve: {
    extensions: ['.css', '.ts', '.tsx'],
  },
};

// Copy the object using merge b/c the baseClientWebpackConfig and commonOptions are mutable globals
const commonWebpackConfig = (): Configuration =>
  merge({}, baseClientWebpackConfig, commonOptions);

export default commonWebpackConfig;
