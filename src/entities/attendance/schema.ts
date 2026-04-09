import { z } from 'zod';

export const AttendanceResponseSchema = z.object({
  attendanceDates: z.array(z.string()),
});
