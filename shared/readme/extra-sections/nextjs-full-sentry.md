## Sentry エラートラッキング設定

このテンプレートには、Sentry によるエラートラッキング機能が統合されています。

### Sentry のセットアップ

1. **Sentry プロジェクトを作成**

   - [Sentry.io](https://sentry.io) にアクセスしてアカウントを作成
   - 新しいプロジェクトを作成（プラットフォーム: **Next.js**）
   - Project Settings → Client Keys (DSN) から **DSN** をコピー

2. **環境変数を設定**

   ```bash
   # .env.local（開発環境）
   SENTRY_DSN=https://your-key@your-org.ingest.sentry.io/your-project-id
   ```

   本番環境では `.env.production` に設定してください。

3. **Sentry の有効化**

   - 本番環境（`APP_ENV=production`）のみで自動的に有効化されます
   - 開発環境ではデフォルトで無効化されています

### 設定値の説明

| 環境変数 | 説明 | 必須 |
| --- | --- | --- |
| `SENTRY_DSN` | Sentry の Data Source Name | 本番環境 |
| `SENTRY_ENVIRONMENT` | 環境名（production, staging など） | ❌ |
| `NEXT_PUBLIC_SENTRY_RELEASE` | リリースバージョン | ❌ |
| `SENTRY_DEBUG` | デバッグモード（開発時のトラブルシューティング用） | ❌ |

### 動作確認

テスト用のエラーを送信してみる（開発環境では動作しません）：

```typescript
import * as Sentry from '@sentry/nextjs';

// エラーをキャプチャ
try {
  // エラーを発生させるコード
} catch (error) {
  Sentry.captureException(error);
}
```

### カスタマイズ

Sentry の設定は `src/config/sentry.config.ts` で管理されます。本番環境でのサンプリング率は以下の通り：

- エラー時のリプレイ: 100%
- セッションリプレイ: 10%
- トレース: 100%

### トラブルシューティング

#### 開発環境で Sentry が動作しない場合

これは正常な動作です。開発環境では意図的に無効化されています。本番環境に対して設定を確認してください。

#### 本番環境でエラーが送信されない場合

1. `SENTRY_DSN` が正しく設定されているか確認
2. `APP_ENV=production` が設定されているか確認
3. ネットワーク接続を確認
