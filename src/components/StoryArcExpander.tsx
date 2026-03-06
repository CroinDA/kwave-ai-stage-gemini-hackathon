import { useState } from 'react';
import { generateStream } from '../lib/api';
import { StreamingOutput } from './StreamingOutput';

const EPISODE_OPTIONS = ['8', '12', '16', '20', '24'];

const THEMES = [
  '운명적 사랑과 장벽 극복 (Destined Love Overcoming Obstacles)',
  '복수와 용서 (Revenge & Forgiveness)',
  '성장과 자아 발견 (Growth & Self-Discovery)',
  '가족의 비밀과 화해 (Family Secrets & Reconciliation)',
  '신분 상승의 꿈 (Social Ascent & Dreams)',
  '전생의 인연 (Past Life Connection)',
  '진실을 향한 투쟁 (Fight for Truth)',
  '기억 상실과 회복 (Amnesia & Recovery)',
  '시간 여행과 운명 (Time Travel & Fate)',
  '회사 내 로맨스와 생존 (Office Romance & Survival)',
];

export function StoryArcExpander() {
  const [scene, setScene] = useState('');
  const [episodes, setEpisodes] = useState('16');
  const [theme, setTheme] = useState('');
  const [output, setOutput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (isStreaming) return;
    setOutput('');
    setError(null);
    setIsStreaming(true);

    try {
      await generateStream(
        'storyarc',
        { scene, episodes, theme },
        (chunk) => setOutput((prev) => prev + chunk),
        () => setIsStreaming(false),
        (err) => {
          setError(err);
          setIsStreaming(false);
        }
      );
    } catch (err) {
      setError(String(err));
      setIsStreaming(false);
    }
  };

  const handleCopy = () => { if (output) navigator.clipboard.writeText(output); };
  const handleReset = () => { setOutput(''); setError(null); };

  const EXAMPLE_SCENES = [
    '재벌 2세와 평범한 여자가 엘리베이터 안에서 갇히는 장면',
    '복수를 위해 접근했지만 진짜 사랑에 빠진 남자의 독백 씬',
    '기억을 잃은 남자가 자신을 사랑하는 여자를 처음 보는 장면',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-[fadeIn_0.4s_ease-out]">
      {/* Input Panel */}
      <div className="kwave-card p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">스토리 아크 확장기</h2>
          <p className="text-purple-300/70 text-sm">씬 또는 컨셉을 입력하면 Gemini가 전체 시리즈 아크를 구성합니다.</p>
        </div>

        {/* Scene Input */}
        <div>
          <label className="block text-xs font-semibold text-[#f0c040] uppercase tracking-widest mb-2">
            씬 / 컨셉 Scene or Concept
          </label>
          <textarea
            value={scene}
            onChange={(e) => setScene(e.target.value)}
            placeholder="씬을 묘사하거나 스토리 컨셉을 입력하세요&#10;예: 재벌 2세와 평범한 여자가 엘리베이터 안에 갇히는 장면"
            rows={4}
            className="kwave-input resize-none"
          />
          {/* Quick scene examples */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {EXAMPLE_SCENES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setScene(ex)}
                className="text-xs px-2 py-1 rounded-md bg-[#2d0a5e]/40 border border-[#3a1060] text-purple-400 hover:text-[#f0c040] hover:border-[#f0c040]/40 transition-all truncate max-w-[200px]"
                title={ex}
              >
                {ex.length > 20 ? ex.slice(0, 20) + '…' : ex}
              </button>
            ))}
          </div>
        </div>

        {/* Episode Count */}
        <div>
          <label className="block text-xs font-semibold text-[#f0c040] uppercase tracking-widest mb-2">
            에피소드 수 Episodes
          </label>
          <div className="flex gap-2">
            {EPISODE_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setEpisodes(n)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  episodes === n
                    ? 'bg-[#f0c040] text-[#0a0015] border-[#f0c040]'
                    : 'bg-transparent text-purple-300 border-[#3a1060] hover:border-[#f0c040]/50'
                }`}
              >
                {n}부
              </button>
            ))}
          </div>
        </div>

        {/* Central Theme */}
        <div>
          <label className="block text-xs font-semibold text-[#f0c040] uppercase tracking-widest mb-2">
            중심 테마 Central Theme
          </label>
          <div className="relative">
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="kwave-select">
              <option value="">테마를 선택하세요...</option>
              {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#f0c040]">▾</div>
          </div>
        </div>

        {/* Generate */}
        <button onClick={handleGenerate} disabled={isStreaming} className="kwave-btn-primary flex items-center justify-center gap-2">
          {isStreaming ? (
            <>
              <span className="w-4 h-4 border-2 border-[#0a0015]/30 border-t-[#0a0015] rounded-full animate-spin" />
              스토리 아크 구성 중...
            </>
          ) : (
            <>📖 스토리 아크 생성하기</>
          )}
        </button>

        {/* Info Box */}
        <div className="bg-[#2d0a5e]/30 border border-[#3a1060] rounded-xl p-3">
          <p className="text-purple-300/80 text-xs leading-relaxed">
            💡 <strong className="text-[#f0c040]">TIP:</strong> K-드라마 씬 생성기에서 만든 씬을 복사하여 붙여넣으면, 해당 씬 기반의 전체 시리즈 아크를 구성할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Output Panel */}
      <div className="kwave-card p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#f0c040] uppercase tracking-widest">
            📚 스토리 아크 Story Arc
          </h3>
          {output && !isStreaming && (
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  console.log(`[CONVERSION_EXPERIMENT] User clicked Export PDF (Pro feature) in StoryArcExpander at ${new Date().toISOString()}`);
                  alert('성공적인 스토리 구성을 위한 [상세 스토리 아크 PDF 리포트]는 Superstar(Pro) 플랜에서만 제공됩니다.\n\n지금 업그레이드하고 당신의 걸작을 완성하세요!');
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="kwave-btn-secondary text-xs border-[#f0c040]/40 text-[#f0c040]/80 hover:bg-[#f0c040]/10"
              >
                📥 PDF 내보내기
              </button>
              <button onClick={handleCopy} className="kwave-btn-secondary text-xs">📋 복사</button>
              <button onClick={handleReset} className="kwave-btn-secondary text-xs">🔄 초기화</button>
            </div>
          )}
        </div>
        <StreamingOutput
          text={output}
          isStreaming={isStreaming}
          error={error}
          placeholder="씬/컨셉, 에피소드 수, 중심 테마를 입력하고 생성 버튼을 누르세요. Gemini가 전체 시리즈 아크를 실시간으로 구성합니다."
        />
      </div>
    </div>
  );
}
