import { useEffect, useRef } from 'react';

interface StreamingOutputProps {
  text: string;
  isStreaming: boolean;
  error?: string | null;
  placeholder?: string;
}

export function StreamingOutput({ text, isStreaming, error, placeholder }: StreamingOutputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && isStreaming) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [text, isStreaming]);

  if (error) {
    return (
      <div className="rounded-xl bg-red-900/20 border border-red-500/30 p-4">
        <p className="text-red-400 text-sm font-medium">⚠️ 오류 발생 / Error</p>
        <p className="text-red-300 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!text && !isStreaming) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-5xl mb-4 opacity-50">✨</div>
        <p className="text-purple-300/60 text-sm">{placeholder || '위 양식을 작성하고 생성 버튼을 눌러주세요.'}</p>
        <p className="text-purple-400/40 text-xs mt-2">Powered by Gemini 2.0 Flash</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-y-auto max-h-[520px] rounded-xl bg-[#070010] border border-[#3a1060] p-5"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Streaming indicator */}
      {isStreaming && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#3a1060]">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f0c040] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#f0c040] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#f0c040] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-[#f0c040] text-xs font-medium">Gemini가 생성 중...</span>
        </div>
      )}

      {/* Text content */}
      <div className={`streaming-text ${isStreaming ? 'cursor-blink' : ''}`}>
        {text}
      </div>

      {/* Done badge */}
      {!isStreaming && text && (
        <div className="mt-4 pt-3 border-t border-[#3a1060] flex items-center justify-between">
          <span className="text-green-400 text-xs">✓ 생성 완료</span>
          <span className="text-purple-400/50 text-xs">Gemini 2.0 Flash</span>
        </div>
      )}
    </div>
  );
}
