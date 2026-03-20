/**
 * DevContainer type definitions, exported from a single source to avoid duplication.
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
