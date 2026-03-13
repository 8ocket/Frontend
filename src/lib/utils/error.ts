import { AxiosError } from 'axios';

export function getErrorMessage(error: unknown, fallback = '알 수 없는 오류가 발생했습니다.'): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.error?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
