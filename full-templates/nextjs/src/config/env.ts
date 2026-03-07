/**
 * 環境変数の設定とバリデーション
 *
 * 環境変数は以下の4つのカテゴリに分類される：
 * 1. ビルドプロセス制御（種類0）
 * 2. 公開設定値（NEXT_PUBLIC_*）（種類1）
 * 3. サーバー設定値（種類2）
 * 4. シークレット（種類3）
 */

// ============================================
// 種類1: 公開設定値（NEXT_PUBLIC_*）
// ============================================
// クライアント側とサーバー側の両方で使用可能
interface PublicConfig {
  APP_URL: string;
}

const env = process.env;

export const publicConfig: PublicConfig = {
  APP_URL: env.NEXT_PUBLIC_APP_URL || '',
};

// ============================================
// 種類2: サーバー設定値
// ============================================
// サーバー側のみで使用可能（クライアント側からはアクセス不可）
interface ServerConfig {
  ENV: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
  IS_TEST: boolean;
  LOG_LEVEL: string;
}

export const serverConfig: ServerConfig = {
  ENV: env.APP_ENV || 'development',
  IS_DEVELOPMENT: env.APP_ENV === 'development',
  IS_PRODUCTION: env.APP_ENV === 'production',
  IS_TEST: env.NODE_ENV === 'test',
  LOG_LEVEL: env.LOG_LEVEL || 'info',
};

// ============================================
// バリデーション
// ============================================
const requiredPublicEnvVars = ['NEXT_PUBLIC_APP_URL'] as const;

export const validateEnv = () => {
  requiredPublicEnvVars.forEach((varName) => {
    if (!env[varName]) {
      console.error(`Missing required environment variable: ${varName}`);
      console.error(`Check your .env.local or .env.example file.`);
      throw new Error(`${varName} is not defined`);
    }
  });
};
