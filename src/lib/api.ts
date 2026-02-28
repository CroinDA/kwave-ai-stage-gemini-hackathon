/**
 * API client for K-WAVE AI STAGE
 * Streams from Cloudflare Workers Gemini proxy
 */

// Worker URL — falls back to relative path for same-origin (Pages + Workers)
const WORKER_BASE_URL = import.meta.env.VITE_WORKER_URL || '';

export type GenerateMode = 'kdrama' | 'kpop' | 'storyarc';

export async function generateStream(
  mode: GenerateMode,
  params: Record<string, string>,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void
): Promise<void> {
  const endpoint = `${WORKER_BASE_URL}/api/generate`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, params }),
    });

    if (!response.ok) {
      let errMsg = `API 오류: ${response.status} ${response.statusText}`;
      try {
        const errJson = await response.json();
        errMsg = errJson.error || errMsg;
      } catch {}
      onError(errMsg);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('스트림을 읽을 수 없습니다.');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              onChunk(parsed.text);
            } else if (parsed.error) {
              onError(parsed.error);
              return;
            }
          } catch {
            // skip
          }
        }
      }
    }
    onDone();
  } catch (err) {
    if (err instanceof Error) {
      onError(`연결 오류: ${err.message}`);
    } else {
      onError('알 수 없는 오류가 발생했습니다.');
    }
  }
}
