/**
 * ISO 8601 형식의 UTC 시간을 KST 날짜 형식으로 변환
 * @param isoString - ISO 8601 형식 (예: "2024-04-14T10:30:00")
 * @returns KST 시간을 "2024.04.14 10:30:00" 형식으로 반환
 */
export function formatToKST(isoString?: string | null): string {
  if (!isoString) return '-';

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';

    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Seoul',
    });

    const parts = formatter.formatToParts(date);
    const mapped = Object.fromEntries(
      parts.map(({ type, value }) => [type, value])
    );

    return `${mapped.year}.${mapped.month}.${mapped.day} ${mapped.hour}:${mapped.minute}:${mapped.second}`;
  } catch {
    return '-';
  }
}

/**
 * ISO 8601 형식의 UTC 시간을 KST 날짜만 표시
 * @param isoString - ISO 8601 형식
 * @returns KST 날짜를 "2024.04.14" 형식으로 반환
 */
export function formatToKSTDate(isoString?: string | null): string {
  if (!isoString) return '-';

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';

    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Seoul',
    });

    const parts = formatter.formatToParts(date);
    const mapped = Object.fromEntries(
      parts.map(({ type, value }) => [type, value])
    );

    return `${mapped.year}.${mapped.month}.${mapped.day}`;
  } catch {
    return '-';
  }
}

/**
 * ISO 8601 형식의 UTC 시간을 KST 시간만 표시
 * @param isoString - ISO 8601 형식
 * @returns KST 시간을 "10:30" 형식으로 반환
 */
export function formatToKSTTime(isoString?: string | null): string {
  if (!isoString) return '-';

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';

    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Seoul',
    });

    const parts = formatter.formatToParts(date);
    const mapped = Object.fromEntries(
      parts.map(({ type, value }) => [type, value])
    );

    return `${mapped.hour}:${mapped.minute}`;
  } catch {
    return '-';
  }
}
