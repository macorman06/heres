export interface ApiError {
  message: string;
  status: number;
  details?: never;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface RequestConfig {
  timeout?: number;
  retry?: boolean;
  retryAttempts?: number;
  headers?: Record<string, string>;
}
