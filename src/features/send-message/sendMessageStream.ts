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

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    const lines = text.split('\n');

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
};
