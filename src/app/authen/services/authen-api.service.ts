import { computed, Injectable, signal } from '@angular/core';
import { APP_CONFIG } from '../../common/constant/constant';

@Injectable({ providedIn: 'root' })
export class AuthenApiService {
  private readonly pendingRequests = signal(0);
  readonly busy = computed(() => this.pendingRequests() > 0);

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    return this.withPending(async () => {
      const response = await fetch(`${APP_CONFIG.apiBaseUrl}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init.headers ?? {}),
        },
      });

      if (!response.ok) {
        throw new ApiError(response.status, await response.text());
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
