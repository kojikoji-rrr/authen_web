import { Routes } from '@angular/router';
import { AuthenComponent } from './authen/authen.component';
import { ResultComponent } from './result/result.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthenComponent,
  },
  {
    path: 'result',
    component: ResultComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
