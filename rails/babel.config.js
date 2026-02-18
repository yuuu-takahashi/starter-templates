// The source code including full typescript support is available at:
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/babel.config.js

import shakapackerPreset from 'shakapacker/package/babel/preset.js';

export default function (api) {
  const defaultConfigFunc = shakapackerPreset;
  const resultConfig = defaultConfigFunc(api);
  // const isProductionEnv = api.env('production');

  const changesOnDefault = {
    presets: [['@babel/preset-react', { runtime: 'automatic' }]],
  };

  resultConfig.presets = [...resultConfig.presets, ...changesOnDefault.presets];

  return resultConfig;
}
