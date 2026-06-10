import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  successMessage = '';

  constructor(private readonly api: AuthenApiService) {
    this.apiBusy = api.busy;
  }

  async ngOnInit(): Promise<void> {
    this.redirect = new URLSearchParams(location.search).get('redirect');
  }

  async login(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

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
      this.password = '';
      this.successMessage = 'success.';
    } catch (error) {
      this.errorMessage = error instanceof ApiError ? error.message : 'ログインに失敗しました。';
    }
  }
}
