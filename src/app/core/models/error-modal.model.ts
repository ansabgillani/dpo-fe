export interface ErrorModalConfig {
  level: 1 | 2 | 3;
  title: string;
  message: string;
  errorCode?: string;
  retryFn?: () => void;
  redirectUrl?: string;
}
