import { COMMON_TRANSLATE } from '../translate/common.translate';
import { APP_CONFIG_LOCAL, APP_CONFIG_PROD, AppConfig } from '../config/app-config';

/*
 * 共通定数と機能別TRANSLATE辞書を集約して公開する。
 */

export const APP_CONFIG: AppConfig = {
  // ここに環境共通の定義があれば記載
  ...getAppConfig(),
} as const;

export const TRANSLATE = {
  // 機能ごとのtransulate.tsはここに定義追加
  COMMON: COMMON_TRANSLATE,
} as const;

/*
 * 以下はconstant用途の共通関数
 */

export function getEnv(): 'local' | 'prod' {
  switch (location.hostname) {
    case 'localhost':
    case '127.0.0.1':
      return 'local';
    default:
      return 'prod';
  }
}

export function isEnv(envName: 'local' | 'prod'): boolean {
  return getEnv() === envName;
}

function getAppConfig() {
  switch (getEnv()) {
    case 'local':
      return APP_CONFIG_LOCAL;
    case 'prod':
      return APP_CONFIG_PROD;
  }
}
