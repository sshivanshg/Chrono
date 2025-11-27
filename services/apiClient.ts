import { environment } from '../config/environment';
import AuthService from './authService';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions extends Omit<RequestInit, 'headers' | 'method'> {
  headers?: Record<string, string>;
  method?: HttpMethod;
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
    const url = `${this.baseUrl}/${path.replace(/^\\//, '')}`;
    const headers = await this.buildHeaders(options.headers);

    const response = await fetch(url, {
      ...options,
      method: options.method ?? 'GET',
      headers,
    });

    const isJson =
      response.headers.get('content-type')?.includes('application/json');
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

