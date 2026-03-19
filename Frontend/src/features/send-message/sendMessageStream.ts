// import type { SSEEventType } from '@/entities/session'; // TODO: 백엔드 연동 시 주석 해제

export const sendMessageStream = async (
  sessionId: string,
  content: string,
  token: string,
  _onChunk: (chunk: string) => void, // ai_chunk마다 호출
  _onCrisis: (msg: string) => void, // crisis_check 시 호출
  _onDone: () => void // done 시 호출
) => {
  const response = await fetch(`/v1/sessions/${sessionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  const reader = response.body?.getReader();
  if (!reader) return;

  // TODO: 백엔드 연동 시 아래 주석 해제
  // let currentEvent = '' as SSEEventType;
  // const decoder = new TextDecoder();
  // while (true) {
  //   const { done, value } = await reader.read();
  //   if (done) break;
  //
  //   const text = decoder.decode(value);
  //   const lines = text.split('\n');
  //
  //   for (const line of lines) {
  //     if (line.startsWith('event:')) {
  //       currentEvent = line.replace('event:', '').trim() as SSEEventType;
  //     }
  //     if (line.startsWith('data:')) {
  //       const data = JSON.parse(line.replace('data:', '').trim());
  //       if (currentEvent === 'ai_chunk') onChunk(data.content);
  //       if (currentEvent === 'crisis_check') onCrisis(data.content);
  //       if (currentEvent === 'done') onDone();
  //     }
  //   }
  // }
};
