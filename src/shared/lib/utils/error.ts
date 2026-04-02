import { AxiosError } from 'axios';

export class HttpStatusError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'HttpStatusError';
    this.status = status;
  }
}

export function createHttpStatusError(status: number, message?: string): HttpStatusError {
  return new HttpStatusError(message ?? `HTTP ${status}`, status);
}

export function getErrorStatus(error: unknown): number | undefined {
  if (error instanceof AxiosError) {
    return error.response?.status;
  }
  if (error instanceof HttpStatusError) {
    return error.status;
  }
  if (error instanceof Error) {
    const match = error.message.match(/HTTP\s+(\d{3})/i);
    return match ? Number(match[1]) : undefined;
  }
  return undefined;
}

export function getErrorMessage(error: unknown, fallback = '알 수 없는 오류가 발생했습니다.'): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.error?.message ?? error.message ?? fallback;
  }
  if (error instanceof HttpStatusError) {
    return error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
