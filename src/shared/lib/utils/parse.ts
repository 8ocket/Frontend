import type { z } from 'zod';

/**
 * API 응답을 Zod 스키마로 검증합니다.
 * - 성공: 파싱된 데이터 반환
 * - 실패(dev): 콘솔 경고 후 원본 데이터 반환 (개발 흐름 유지)
 * - 실패(prod): 원본 데이터 반환 (앱 중단 방지)
 */
export function safeParse<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;

  if (process.env.NODE_ENV === 'development') {
    console.warn('[Zod] API 응답 검증 실패:', result.error.issues);
  }
  return data as z.infer<T>;
}
