import { env } from 'shakapacker';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Configuration } from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envSpecificConfig = async (): Promise<Configuration> => {
  // Try to load TypeScript file first, then fall back to JavaScript
  const tsPath = resolve(__dirname, `${env.nodeEnv}.ts`);
  const jsPath = resolve(__dirname, `${env.nodeEnv}.js`);

  if (existsSync(tsPath)) {
    console.log(`Loading ENV specific webpack configuration file ${tsPath}`);
    const config = await import(`${tsPath}?${Date.now()}`);
    return config.default;
  } else if (existsSync(jsPath)) {
    console.log(`Loading ENV specific webpack configuration file ${jsPath}`);
    const config = await import(`${jsPath}?${Date.now()}`);
    return config.default;
  } else {
    throw new Error(
      `Could not find file to load ${tsPath} or ${jsPath}, based on NODE_ENV`,
    );
  }
};

// Use a synchronous approach to avoid top-level await
const config = await envSpecificConfig();
export default config;
