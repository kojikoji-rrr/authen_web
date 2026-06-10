import { computed, Injectable, signal } from '@angular/core';
import { APP_CONFIG } from '../../common/constant/constant';
import { AuthenLoginRequest, AuthenLoginResponse } from '../models/authen-login.model';

@Injectable({ providedIn: 'root' })
export class AuthenApiService {
  private readonly pendingRequests = signal(0);
  readonly busy = computed(() => this.pendingRequests() > 0);

  ensureClientCookie(): Promise<void> {
    return this.request<void>('/client-token', {
      method: 'GET',
    });
  }

  login(request: AuthenLoginRequest): Promise<AuthenLoginResponse> {
    return this.request<AuthenLoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    return this.withPending(async () => {
      const response = await fetch(`${APP_CONFIG.apiBaseUrl}${path}`, {
        ...init,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(init.headers ?? {}),
        },
      });

      if (!response.ok) {
        throw new ApiError(response.status, await errorMessage(response));
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return response.json() as Promise<T>;
    });
  }

  private async withPending<T>(operation: () => Promise<T>): Promise<T> {
    this.pendingRequests.update((value) => value + 1);
    try {
      return await operation();
    } finally {
      this.pendingRequests.update((value) => Math.max(0, value - 1));
    }
  }
}

export class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

async function errorMessage(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) {
    return `Request failed. (${response.status})`;
  }
  try {
    const body = JSON.parse(text) as { message?: unknown };
    return typeof body.message === 'string' ? body.message : text;
  } catch {
    return text;
  }
}
