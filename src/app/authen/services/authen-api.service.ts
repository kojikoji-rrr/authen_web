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
        const text = await response.text();
        if (isCloudflareBlockResponse(response, text)) {
          return reloadAfterCloudflareBlock();
        }
        throw new ApiError(response.status, parseErrorMessage(response.status, text));
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

function parseErrorMessage(status: number, text: string): string {
  if (!text) {
    return `Request failed. (${status})`;
  }
  try {
    const body = JSON.parse(text) as { message?: unknown };
    return typeof body.message === 'string' ? body.message : text;
  } catch {
    return text;
  }
}

function isCloudflareBlockResponse(response: Response, text: string): boolean {
  if (response.status !== 403) {
    return false;
  }

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
  if (!contentType.includes('text/html')) {
    return false;
  }

  return (
    text.includes('Attention Required! | Cloudflare') ||
    text.includes('Sorry, you have been blocked') ||
    text.includes('cf-error-details')
  );
}

function reloadAfterCloudflareBlock(): Promise<never> {
  window.location.reload();
  return new Promise<never>(() => undefined);
}
