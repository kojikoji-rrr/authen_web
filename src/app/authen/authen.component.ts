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
  loginSucceeded = false;

  constructor(private readonly api: AuthenApiService) {
    this.apiBusy = api.busy;
  }

  ngOnInit(): void {
    this.redirect = new URLSearchParams(location.search).get('redirect');
  }

  async login(): Promise<void> {
    this.errorMessage = '';
    this.loginSucceeded = false;

    const userId = this.userId.trim();
    if (!userId || !this.password) {
      this.errorMessage = 'ユーザーIDとパスワードを入力してください。';
      return;
    }

    try {
      const result = await this.api.login({
        userId,
        password: this.password,
        ...(this.redirect ? { redirect: this.redirect } : {}),
      });

      const redirectTo = result.redirectTo ?? this.redirect;
      if (redirectTo) {
        location.assign(redirectTo);
        return;
      }

      this.password = '';
      this.loginSucceeded = true;
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof ApiError && error.message) {
      return error.message;
    }
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return 'ログインに失敗しました。';
  }
}
