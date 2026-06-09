/*
 * API接続先などアプリ全体の実行時設定を定義する。
 */

export interface AppConfig {
  apiBaseUrl: string;
}

/*
 * 環境別設定値
 */

// ローカル環境用設定値
export const APP_CONFIG_LOCAL: AppConfig = {
  apiBaseUrl: 'http://localhost:8788/v1',
};

// 本番環境用設定値
export const APP_CONFIG_PROD: AppConfig = {
  apiBaseUrl: 'https://authen.kojica.jp/v1',
};
