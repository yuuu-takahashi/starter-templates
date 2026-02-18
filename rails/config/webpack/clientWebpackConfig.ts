// The source code including full typescript support is available at:
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/clientWebpackConfig.js

import { Configuration } from 'webpack';
import commonWebpackConfig from './commonWebpackConfig.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configureClient = (): Configuration => {
  const clientConfig = commonWebpackConfig();

  // Update entry points to use TypeScript files
  if (clientConfig.entry && typeof clientConfig.entry === 'object') {
    // server-bundle is special and should ONLY be built by the serverConfig
    // In case this entry is not deleted, a very strange "window" not found
    // error shows referring to window["webpackJsonp"]. That is because the
    // client config is going to try to load chunks.
    delete (clientConfig.entry as any)['server-bundle'];

    // Update entry points to use TypeScript files
    if ((clientConfig.entry as any)['application']) {
      (clientConfig.entry as any)['application'] = resolve(
        __dirname,
        '../../app/javascript/packs/application.ts',
      );
    }

    if ((clientConfig.entry as any)['HelloWorld']) {
      (clientConfig.entry as any)['HelloWorld'] = resolve(
        __dirname,
        '../../app/javascript/packs/hello-world-bundle.ts',
      );
    }
  }

  return clientConfig;
};

export default configureClient;
