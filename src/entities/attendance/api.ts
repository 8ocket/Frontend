import { api } from '@/shared/api/axios';
import { USE_MOCK } from '@/shared/lib/env';
import { safeParse } from '@/shared/lib/utils/parse';
import { AttendanceResponseSchema } from './schema';

interface AttendanceResponse {
  attendanceDates: string[];
}

/**
 * 월별 출석 현황 조회 API
 * GET /v1/attendance/me/{yearMonth}
 * @param yearMonth - 'YYYY-MM' 형식 (예: '2026-04')
 */
export const getAttendanceApi = async (yearMonth: string): Promise<AttendanceResponse> => {
  if (USE_MOCK) {
    return {
      attendanceDates: [
        `${yearMonth}-01`,
        `${yearMonth}-02`,
        `${yearMonth}-03`,
        `${yearMonth}-05`,
        `${yearMonth}-06`,
      ],
    };
  }

  const response = await api.get<AttendanceResponse>(`/attendance/me/${yearMonth}`);
  return safeParse(AttendanceResponseSchema, response.data);
};
