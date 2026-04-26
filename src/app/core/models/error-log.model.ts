export interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  errorCode: string;
  message: string;
  context?: Record<string, unknown>;
  originalError?: unknown;
}
