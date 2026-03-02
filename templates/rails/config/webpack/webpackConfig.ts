// The source code including full typescript support is available at:
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/webpackConfig.js

import shakapacker from 'shakapacker';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Configuration } from 'webpack';
import clientWebpackConfig from './clientWebpackConfig.js';
import serverWebpackConfig from './serverWebpackConfig.js';

const { env } = shakapacker;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type EnvSpecificFunction = (
  clientConfig: Configuration,
  serverConfig: Configuration,
) => void;

const webpackConfig = (
  envSpecific?: EnvSpecificFunction,
): Configuration | Configuration[] => {
  const clientConfig = clientWebpackConfig();
  const serverConfig = serverWebpackConfig();

  if (envSpecific) {
    envSpecific(clientConfig, serverConfig);
  }

  let result: Configuration | Configuration[];
  // For HMR, need to separate the the client and server webpack configurations
  if (process.env.WEBPACK_SERVE || process.env.CLIENT_BUNDLE_ONLY) {
    console.log('[React on Rails] Creating only the client bundles.');
    result = clientConfig;
  } else if (process.env.SERVER_BUNDLE_ONLY) {
    console.log('[React on Rails] Creating only the server bundle.');
    result = serverConfig;
  } else {
    // default is the standard client and server build

    console.log('[React on Rails] Creating both client and server bundles.');
    result = [clientConfig, serverConfig];
  }

  // To debug, uncomment next line and inspect "result"
  // debugger
  return result;
};

export default webpackConfig;
