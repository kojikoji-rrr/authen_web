import { bootstrapApplication } from '@angular/platform-browser';
import { App, appConfig } from './app/app';

/*
 * Angularアプリを起動し、ルートコンポーネントとアプリ設定を接続する。
 */

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
