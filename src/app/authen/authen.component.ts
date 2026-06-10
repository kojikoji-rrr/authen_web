import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiError, AuthenApiService } from './services/authen-api.service';

@Component({
  selector: 'app-authen',
  imports: [CommonModule, FormsModule],
  templateUrl: './authen.component.html',
  styleUrl: './authen.component.scss',
})
export class AuthenComponent implements OnInit {
  readonly apiBusy;
  userId = '';
  password = '';
  redirect: string | null = null;
  errorMessage = '';

  constructor(
    private readonly api: AuthenApiService,
    private readonly router: Router,
  ) {
    this.apiBusy = api.busy;
  }

  async ngOnInit(): Promise<void> {
    this.redirect = new URLSearchParams(location.search).get('redirect');
    try {
      await this.api.ensureClientCookie();
    } catch (error) {
      console.warn('Failed to initialize client cookie.', error);
    }
  }

  async login(): Promise<void> {
    this.errorMessage = '';

    try {
      const response = await this.api.login({
        userId: this.userId,
        password: this.password,
        redirect: this.redirect,
      });
      if (response.redirect) {
        location.assign(response.redirect);
        return;
      }
      await this.router.navigate(['/result']);
    } catch (error) {
      this.errorMessage = error instanceof ApiError ? error.message : 'ログインに失敗しました。';
    }
  }
}
