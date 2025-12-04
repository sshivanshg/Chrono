import { environment } from '../config/environment';
import AuthService from './authService';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions extends Omit<RequestInit, 'headers' | 'method'> {
  headers?: Record<string, string>;
  method?: HttpMethod;
  retries?: number;
  retryDelay?: number;
}

export class ApiError extends Error {
  status: number;
  statusText: string;
  body: any;

  constructor(message: string, status: number, statusText: string, body: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

class ApiClient {
  private readonly baseUrl = environment.apiBaseUrl.replace(/\/$/, '');

  private async buildHeaders(
    overrideHeaders?: Record<string, string>
  ): Promise<Record<string, string>> {
    const authHeader = await AuthService.getAuthHeader();
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(authHeader as Record<string, string>),
      ...(overrideHeaders ?? {}),
    };
  }

  /**
   * Low level request helper. Prefer the get/post helpers below.
   */
  async request<TResponse = unknown>(
    path: string,
    options: ApiRequestOptions = {}
  ): Promise<TResponse> {
    const url = `${this.baseUrl}/${path.replace(/^\//, '')}`;
    const headers = await this.buildHeaders(options.headers);

    const fetchOptions: RequestInit = {
      ...options,
      method: options.method ?? 'GET',
      headers,
    };

    const maxRetries = options.retries ?? 0;
    const retryDelay = options.retryDelay ?? 1000;
    let attempt = 0;

    while (true) {
      try {
        const response = await fetch(url, fetchOptions);

        // Don't retry on client errors (4xx), except maybe 429 (Too Many Requests) if we wanted to be fancy
        if (response.ok || (response.status < 500 && response.status !== 429)) {
          const isJson = response.headers.get('content-type')?.includes('application/json');
          const body = isJson ? await response.json() : await response.text();

          if (!response.ok) {
            throw new ApiError(
              'Request failed',
              response.status,
              response.statusText,
              body
            );
          }
          return body as TResponse;
        }

        // Throw for 5xx or 429 to trigger retry
        throw new Error(`Request failed with status ${response.status}`);

      } catch (error: any) {
        attempt++;
        if (attempt > maxRetries) {
          // If we have a specific ApiError, throw that, otherwise rethrow the last error
          throw error;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  get<TResponse = unknown>(path: string, options?: ApiRequestOptions) {
    return this.request<TResponse>(path, { ...options, method: 'GET' });
  }

  post<TResponse = unknown, TPayload = unknown>(
    path: string,
    payload?: TPayload,
    options?: ApiRequestOptions
  ) {
    return this.request<TResponse>(path, {
      ...options,
      method: 'POST',
      body: payload ? JSON.stringify(payload) : undefined,
    });
  }

  put<TResponse = unknown, TPayload = unknown>(
    path: string,
    payload?: TPayload,
    options?: ApiRequestOptions
  ) {
    return this.request<TResponse>(path, {
      ...options,
      method: 'PUT',
      body: payload ? JSON.stringify(payload) : undefined,
    });
  }

  patch<TResponse = unknown, TPayload = unknown>(
    path: string,
    payload?: TPayload,
    options?: ApiRequestOptions
  ) {
    return this.request<TResponse>(path, {
      ...options,
      method: 'PATCH',
      body: payload ? JSON.stringify(payload) : undefined,
    });
  }

  delete<TResponse = unknown>(path: string, options?: ApiRequestOptions) {
    return this.request<TResponse>(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

