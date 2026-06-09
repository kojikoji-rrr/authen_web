import { ApplicationConfig, Component, provideBrowserGlobalErrorListeners } from '@angular/core';
import { AuthenComponent } from './authen/authen.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
};

@Component({
  selector: 'app-root',
  imports: [AuthenComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
