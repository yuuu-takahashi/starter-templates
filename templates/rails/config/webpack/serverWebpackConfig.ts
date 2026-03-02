// The source code including full typescript support is available at:
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/serverWebpackConfig.js

import { Configuration } from 'webpack';
import shakapacker from 'shakapacker';
import commonWebpackConfig from './commonWebpackConfig.js';
import webpack from 'webpack';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const { config } = shakapacker;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Using any for complex webpack types to avoid excessive type errors
const configureServer = (): Configuration => {
  // We need to use "merge" because the clientConfigObject, EVEN after running
  // toWebpackConfig() is a mutable GLOBAL. Thus any changes, like modifying the
  // entry value will result in changing the client config!
  // Using webpack-merge into an empty object avoids this issue.
  const serverWebpackConfig = commonWebpackConfig();

  // We just want the single server bundle entry
  const serverEntry: Record<string, any> = {};
  if (
    serverWebpackConfig.entry &&
    typeof serverWebpackConfig.entry === 'object'
  ) {
    serverEntry['server-bundle'] = resolve(
      __dirname,
      '../../app/javascript/packs/server-bundle.ts',
    );
  }

  if (!serverEntry['server-bundle']) {
    throw new Error(
      "Create a pack with the file name 'server-bundle.js' containing all the server rendering files",
    );
  }

  serverWebpackConfig.entry = serverEntry;

  // Remove the mini-css-extract-plugin from the style loaders because
  // the client build will handle exporting CSS.
  // replace file-loader with null-loader
  if (serverWebpackConfig.module && serverWebpackConfig.module.rules) {
    (serverWebpackConfig.module.rules as any[]).forEach((rule: any) => {
      if (rule && rule.use && Array.isArray(rule.use)) {
        rule.use = rule.use.filter(
          (item: any) =>
            !(
              typeof item === 'string' && item.match(/mini-css-extract-plugin/)
            ),
        );
      }
    });
  }

  // No splitting of chunks for a server bundle
  serverWebpackConfig.optimization = {
    minimize: false,
  };

  if (serverWebpackConfig.plugins) {
    serverWebpackConfig.plugins.unshift(
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    );
  }

  // Custom output for the server-bundle that matches the config in
  // config/initializers/react_on_rails.rb
  serverWebpackConfig.output = {
    filename: 'server-bundle.js',
    globalObject: 'this',
    // If using the React on Rails Pro node server renderer, uncomment the next line
    // libraryTarget: 'commonjs2',
    path: config.outputPath,
    publicPath: config.publicPath,
    // https://webpack.js.org/configuration/output/#outputglobalobject
  };

  // Don't hash the server bundle b/c would conflict with the client manifest
  // And no need for the MiniCssExtractPlugin
  if (serverWebpackConfig.plugins) {
    serverWebpackConfig.plugins = (serverWebpackConfig.plugins as any[]).filter(
      (plugin: any) =>
        plugin.constructor.name !== 'WebpackAssetsManifest' &&
        plugin.constructor.name !== 'MiniCssExtractPlugin' &&
        plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin',
    );
  }

  // Configure loader rules for SSR
  // Remove the mini-css-extract-plugin from the style loaders because
  // the client build will handle exporting CSS.
  // replace file-loader with null-loader
  if (serverWebpackConfig.module && serverWebpackConfig.module.rules) {
    const rules = serverWebpackConfig.module.rules as any[];
    rules.forEach((rule: any) => {
      if (rule && Array.isArray(rule.use)) {
        // remove the mini-css-extract-plugin and style-loader
        rule.use = rule.use.filter((item: any) => {
          let testValue: string | undefined;
          if (typeof item === 'string') {
            testValue = item;
          } else if (item && typeof item.loader === 'string') {
            testValue = item.loader;
          }
          return (
            testValue !== 'style-loader' &&
            testValue !== 'css-loader' &&
            !testValue?.match(/mini-css-extract-plugin/)
          );
        });
      }
    });
  }

  // eval works well for the SSR bundle because it's the fastest and shows
  // lines in the server bundle which is good for debugging SSR
  // The default of cheap-module-source-map is slow and provides poor info.
  serverWebpackConfig.devtool = 'eval';

  // If using the default 'web', then libraries like Emotion and loadable-components
  // break with SSR. The fix is to use a node renderer and change the target.
  // If using the React on Rails Pro node server renderer, uncomment the next line
  // serverWebpackConfig.target = 'node'

  return serverWebpackConfig;
};

export default configureServer;
