// The source code including full typescript support is available at:
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/development.ts

import shakapacker from 'shakapacker';
import webpackConfig from './webpackConfig.js';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { Configuration } from 'webpack';

const { devServer, inliningCss } = shakapacker;

const developmentEnvOnly = (clientWebpackConfig: Configuration): void => {
  // plugins
  if (inliningCss) {
    // Note, when this is run, we're building the server and client bundles in separate processes.
    // Thus, this plugin is not applied to the server bundle.
    clientWebpackConfig.plugins?.push(
      new ReactRefreshWebpackPlugin({
        overlay: {
          sockPort: devServer.port as number,
        },
      }),
    );
  }
};

const config = webpackConfig(developmentEnvOnly);
export default config;
