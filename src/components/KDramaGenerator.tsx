import { useState } from 'react';
import { generateStream } from '../lib/api';
import { StreamingOutput } from './StreamingOutput';

const GENRES = [
  '로맨틱 멜로드라마 (Romantic Melodrama)',
  '재벌 로맨스 (Chaebol Romance)',
  '복수극 (Revenge Thriller)',
  '의학 드라마 (Medical Drama)',
  '수사 스릴러 (Crime Thriller)',
  '판타지 로맨스 (Fantasy Romance)',
  '시대극 (Historical Drama)',
  '학원물 (School Drama)',
  '가족 드라마 (Family Drama)',
  '좀비 / 아포칼립스 (Zombie / Apocalypse)',
];

const MOODS = [
  '긴장감과 설렘 (Tension & Excitement)',
  '달콤쌉싸름한 이별 (Bittersweet Farewell)',
  '폭풍 전야 (Calm Before the Storm)',
  '재회의 떨림 (Trembling Reunion)',
  '오해와 갈등 (Misunderstanding & Conflict)',
  '운명적인 첫 만남 (Fateful First Meeting)',
  '복수의 냉기 (Cold Vengeance)',
  '절박한 고백 (Desperate Confession)',
];

const CONFLICTS = [
  '오해와 재회 (Misunderstanding & Reunion)',
  '신분 차이의 벽 (Class Divide)',
  '과거의 비밀 (Hidden Past)',
  '경쟁에서 사랑으로 (Rivals to Lovers)',
  '삼각관계의 선택 (Love Triangle)',
  '가족의 반대 (Family Opposition)',
  '기억 상실 (Memory Loss)',
  '계략과 배신 (Scheme & Betrayal)',
];

export function KDramaGenerator() {
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [characters, setCharacters] = useState('2');
  const [conflict, setConflict] = useState('');
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
        'kdrama',
        { genre, mood, characters, conflict },
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

  const handleCopy = () => {
    if (output) navigator.clipboard.writeText(output);
  };

  const handleReset = () => {
    setOutput('');
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-[fadeIn_0.4s_ease-out]">
      {/* Input Panel */}
      <div className="kwave-card p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">K-드라마 씬 생성기</h2>
          <p className="text-purple-300/70 text-sm">장르·분위기·캐릭터·갈등을 설정하면 Gemini가 실시간으로 씬을 작성합니다.</p>
        </div>

        {/* Genre */}
        <div>
          <label className="block text-xs font-semibold text-[#f0c040] uppercase tracking-widest mb-2">
            장르 Genre
          </label>
          <div className="relative">
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="kwave-select"
            >
              <option value="">장르를 선택하세요...</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#f0c040]">▾</div>
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className="block text-xs font-semibold text-[#f0c040] uppercase tracking-widest mb-2">
            분위기 Mood
          </label>
          <div className="relative">
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="kwave-select"
            >
              <option value="">분위기를 선택하세요...</option>
              {MOODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#f0c040]">▾</div>
          </div>
        </div>

        {/* Characters count */}
        <div>
          <label className="block text-xs font-semibold text-[#f0c040] uppercase tracking-widest mb-2">
            등장인물 수 Characters
          </label>
          <div className="flex gap-3">
            {['2', '3', '4', '5+'].map((n) => (
              <button
                key={n}
                onClick={() => setCharacters(n)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  characters === n
                    ? 'bg-[#f0c040] text-[#0a0015] border-[#f0c040]'
                    : 'bg-transparent text-purple-300 border-[#3a1060] hover:border-[#f0c040]/50'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Conflict */}
        <div>
          <label className="block text-xs font-semibold text-[#f0c040] uppercase tracking-widest mb-2">
            갈등 유형 Conflict Type
          </label>
          <div className="relative">
            <select
              value={conflict}
              onChange={(e) => setConflict(e.target.value)}
              className="kwave-select"
            >
              <option value="">갈등 유형을 선택하세요...</option>
              {CONFLICTS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#f0c040]">▾</div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isStreaming}
          className="kwave-btn-primary flex items-center justify-center gap-2"
        >
          {isStreaming ? (
            <>
              <span className="w-4 h-4 border-2 border-[#0a0015]/30 border-t-[#0a0015] rounded-full animate-spin" />
              Gemini가 씬을 작성 중...
            </>
          ) : (
            <>
              ✨ K-드라마 씬 생성하기
            </>
          )}
        </button>

        {/* Example Prompts */}
        <div className="pt-1">
          <p className="text-xs text-purple-400/60 mb-2">빠른 예시:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { genre: '재벌 로맨스 (Chaebol Romance)', mood: '재회의 떨림 (Trembling Reunion)', conflict: '신분 차이의 벽 (Class Divide)' },
              { genre: '복수극 (Revenge Thriller)', mood: '복수의 냉기 (Cold Vengeance)', conflict: '과거의 비밀 (Hidden Past)' },
            ].map((preset, i) => (
              <button
                key={i}
                onClick={() => {
                  setGenre(preset.genre);
                  setMood(preset.mood);
                  setConflict(preset.conflict);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#2d0a5e]/50 border border-[#3a1060] text-purple-300 hover:border-[#f0c040]/50 hover:text-[#f0c040] transition-all"
              >
                {i === 0 ? '💼 재벌 로맨스' : '🗡️ 복수극'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output Panel */}
      <div className="kwave-card p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#f0c040] uppercase tracking-widest">
            📺 생성된 씬 Scene Output
          </h3>
          {output && !isStreaming && (
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  console.log(`[CONVERSION_EXPERIMENT] User clicked Export PDF (Pro feature) in KDramaGenerator at ${new Date().toISOString()}`);
                  alert('전문가용 [K-드라마 대본 포맷 PDF]는 Superstar(Pro) 플랜에서만 제공됩니다.\n\n지금 업그레이드하고 당신의 시나리오를 완성하세요!');
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
          placeholder="장르, 분위기, 캐릭터, 갈등 유형을 선택하고 생성 버튼을 누르세요. Gemini가 실시간으로 K-드라마 씬을 작성합니다."
        />
      </div>
    </div>
  );
}
