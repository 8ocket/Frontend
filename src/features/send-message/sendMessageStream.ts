import type { SSEEventType } from '@/entities/session';
import { mockSendMessageStream } from '@/mocks/session';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

export const sendMessageStream = async (
  sessionId: string,
  content: string,
  token: string,
  onChunk: (chunk: string) => void,
  onCrisis: (msg: string) => void,
  onDone: () => void
) => {
  if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
    return mockSendMessageStream(onChunk, onCrisis, onDone);
  }

  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const reader = response.body?.getReader();
  if (!reader) return;

  let currentEvent = '' as SSEEventType;
  const decoder = new TextDecoder();
  // SSE는 이벤트가 chunk 경계에서 잘릴 수 있으므로, 완성되지 않은 마지막 조각을 버퍼에 보관합니다.
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      buffer += decoder.decode();
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const eventBlock of events) {
      const lines = eventBlock.split('\n');

      for (const line of lines) {
        if (line.startsWith('event:')) {
          currentEvent = line.replace('event:', '').trim() as SSEEventType;
        }
        if (line.startsWith('data:')) {
          const raw = line.replace('data:', '').trim();
          if (!raw) continue;
          try {
            const data = JSON.parse(raw);
            if (currentEvent === 'ai_chunk') onChunk(data.content);
            if (currentEvent === 'crisis_check') onCrisis(data.content);
            if (currentEvent === 'done') {
              onDone();
              reader.cancel();
              return;
            }
          } catch {
            // malformed JSON 무시
          }
        }
      }
    }
  }
};
