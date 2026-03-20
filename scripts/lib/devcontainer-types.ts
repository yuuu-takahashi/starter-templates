/**
 * DevContainer type definitions, exported from a single source to avoid duplication.
 *
 * ## 構成
 *
 * - ExtensionSetKey: Dev Container で使用できる拡張機能セットの種類
 * - DevcontainerStackConfigBasic: 基本的な DevContainer 設定（buildMode, remoteUser, extensionSets など）
 * - DevcontainerStackConfig: StackDefinition に埋め込む簡潔な設定型
 *   - buildMode: 'node' (Dockerfile.node) | 'ruby' (Dockerfile.ruby) | 'docker-compose'
 *   - remoteUser: コンテナ内で使用するユーザー（通常は 'node'）
 *   - extensionSets: shared/devcontainer/defaults.json で定義された拡張機能セット群
 *   - extraSettings: VSCode/Cursor の設定カスタマイズ（例: ESLint の対象言語）
 *   - composeKey: docker-compose を使う場合のファイルの種類（'ruby-db', 'rails', 'rails-api-full'）
 *   - full: full-templates 版の devcontainer 設定
 *
 * ## 使用場所
 *
 * - STACK_DEFINITIONS（scripts/lib/stacks.ts）: 各テンプレートの devcontainer 設定を定義
 * - generate-devcontainer.ts: 簡潔な設定から完全な devcontainer.json を生成
 */

/** Dev Container の拡張機能セット（shared/devcontainer/defaults.json の extensions キー） */
export type ExtensionSetKey =
  | 'base'
  | 'node'
  | 'ruby'
  | 'erb'
  | 'tooling'
  | 'markdownPreview';

/** VSCode/Cursor 設定オブジェクト */
export type VscodeSettings = Record<string, unknown>;

/** Devcontainer 構築モード */
export type DevcontainerBuildMode = 'node' | 'ruby' | 'docker-compose';

/** 1つのスタック（minimal/full）用の簡潔なdevcontainer定義 */
export interface DevcontainerStackConfigBasic {
  name: string;
  buildMode: DevcontainerBuildMode;
  remoteUser: string;
  extensionSets: ExtensionSetKey[];
  extraSettings?: VscodeSettings;
  composeKey?: 'ruby-db' | 'rails' | 'rails-api-full';
}

/** full版の設定 */
export interface DevcontainerStackConfigFull {
  name: string;
  extensionSets: ExtensionSetKey[];
}

/**
 * StackDefinition 内に埋め込まれるdevcontainer設定
 * STACK_DEFINITIONS で使用する簡略型（実際の DevcontainerConfig は generate-devcontainer.ts で構築）
 */
export interface DevcontainerStackConfig extends DevcontainerStackConfigBasic {
  /** full版の設定（undefined なら full版なし） */
  full?: DevcontainerStackConfigFull;
}
