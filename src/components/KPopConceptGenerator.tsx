import { useState } from 'react';
import { generateStream } from '../lib/api';
import { StreamingOutput } from './StreamingOutput';

const CONCEPTS = [
  '다크 판타지 (Dark Fantasy)',
  '사이버펑크 (Cyberpunk)',
  '청순 걸그룹 (Pure Girl Group)',
  '하이틴 서머 (High-teen Summer)',
  '미니멀 아방가르드 (Minimal Avant-garde)',
  '네오 트로트 퓨전 (Neo Trot Fusion)',
  '오리엔탈 미스터리 (Oriental Mystery)',
  '스트리트 힙합 (Street Hip-hop)',
  '왕자 / 귀족 로맨스 (Royalty Romance)',
  '포스트 아포칼립스 (Post-Apocalyptic)',
];

const EMOTIONS = [
  '강렬한 갈망 (Intense Longing)',
  '자신감과 파워 (Confidence & Power)',
  '달콤한 설렘 (Sweet Excitement)',
  '우울한 아름다움 (Melancholic Beauty)',
  '반항과 자유 (Rebellion & Freedom)',
  '그리움과 향수 (Nostalgia & Longing)',
  '위로와 치유 (Comfort & Healing)',
  '화려한 황홀감 (Dazzling Euphoria)',
];

const SEASONS = [
  '윈터 컬렉션 2026 (Winter 2026)',
  '스프링 컴백 2026 (Spring Comeback 2026)',
  '서머 미니앨범 (Summer Mini Album)',
  '폴 리패키지 (Fall Repackage)',
  '데뷔 앨범 (Debut Album)',
  '정규 2집 (2nd Full Album)',
  '월드투어 에디션 (World Tour Edition)',
];

const GROUP_TYPES = [
  '걸그룹 5인 (5-member Girl Group)',
  '보이그룹 7인 (7-member Boy Group)',
  '혼성 그룹 6인 (6-member Mixed Group)',
  '솔로이스트 (Solo Artist)',
  '듀오 (Duo)',
  '걸그룹 4인 (4-member Girl Group)',
  '보이그룹 5인 (5-member Boy Group)',
];

export function KPopConceptGenerator() {
  const [concept, setConcept] = useState('');
  const [emotion, setEmotion] = useState('');
  const [season, setSeason] = useState('');
  const [members, setMembers] = useState('');
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
        'kpop',
        { concept, emotion, season, members },
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-[fadeIn_0.4s_ease-out]">
      {/* Input Panel */}
      <div className="kwave-card p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">K-팝 컨셉 시트 생성기</h2>
          <p className="text-purple-300/70 text-sm">그룹 컨셉, 감정, 시즌을 설정하면 Gemini가 완전한 컨셉 시트를 작성합니다.</p>
        </div>

        {/* Group Concept */}
        <div>
          <label className="block text-xs font-semibold text-[#f0c040] uppercase tracking-widest mb-2">
            그룹 컨셉 Group Concept
          </label>
          <div className="relative">
            <select value={concept} onChange={(e) => setConcept(e.target.value)} className="kwave-select">
              <option value="">컨셉을 선택하세요...</option>
              {CONCEPTS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#f0c040]">▾</div>
          </div>
        </div>

        {/* Target Emotion */}
        <div>
          <label className="block text-xs font-semibold text-[#f0c040] uppercase tracking-widest mb-2">
            타겟 감정 Target Emotion
          </label>
          <div className="relative">
            <select value={emotion} onChange={(e) => setEmotion(e.target.value)} className="kwave-select">
              <option value="">감정을 선택하세요...</option>
              {EMOTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#f0c040]">▾</div>
          </div>
        </div>

        {/* Season / Era */}
        <div>
          <label className="block text-xs font-semibold text-[#f0c040] uppercase tracking-widest mb-2">
            시즌 / 에라 Season / Era
          </label>
          <div className="relative">
            <select value={season} onChange={(e) => setSeason(e.target.value)} className="kwave-select">
              <option value="">시즌을 선택하세요...</option>
              {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#f0c040]">▾</div>
          </div>
        </div>

        {/* Group Type */}
        <div>
          <label className="block text-xs font-semibold text-[#f0c040] uppercase tracking-widest mb-2">
            그룹 구성 Group Structure
          </label>
          <div className="relative">
            <select value={members} onChange={(e) => setMembers(e.target.value)} className="kwave-select">
              <option value="">그룹 구성을 선택하세요...</option>
              {GROUP_TYPES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#f0c040]">▾</div>
          </div>
        </div>

        {/* Generate */}
        <button onClick={handleGenerate} disabled={isStreaming} className="kwave-btn-primary flex items-center justify-center gap-2">
          {isStreaming ? (
            <>
              <span className="w-4 h-4 border-2 border-[#0a0015]/30 border-t-[#0a0015] rounded-full animate-spin" />
              컨셉 시트 작성 중...
            </>
          ) : (
            <>🎤 K-팝 컨셉 시트 생성하기</>
          )}
        </button>

        {/* Quick Presets */}
        <div className="pt-1">
          <p className="text-xs text-purple-400/60 mb-2">빠른 예시:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { concept: '다크 판타지 (Dark Fantasy)', emotion: '강렬한 갈망 (Intense Longing)', season: '윈터 컬렉션 2026 (Winter 2026)', members: '걸그룹 5인 (5-member Girl Group)' },
              { concept: '사이버펑크 (Cyberpunk)', emotion: '반항과 자유 (Rebellion & Freedom)', season: '데뷔 앨범 (Debut Album)', members: '보이그룹 7인 (7-member Boy Group)' },
            ].map((preset, i) => (
              <button
                key={i}
                onClick={() => { setConcept(preset.concept); setEmotion(preset.emotion); setSeason(preset.season); setMembers(preset.members); }}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#2d0a5e]/50 border border-[#3a1060] text-purple-300 hover:border-[#f0c040]/50 hover:text-[#f0c040] transition-all"
              >
                {i === 0 ? '🌙 다크 판타지' : '⚡ 사이버펑크'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output Panel */}
      <div className="kwave-card p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#f0c040] uppercase tracking-widest">
            🎵 컨셉 시트 Concept Sheet
          </h3>
          {output && !isStreaming && (
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  console.log(`[CONVERSION_EXPERIMENT] User clicked Export PDF (Pro feature) at ${new Date().toISOString()}`);
                  alert('성공적인 오디션을 위한 [상세 컨셉 리포트 PDF]는 Superstar(Pro) 플랜에서만 제공됩니다.\n\n지금 업그레이드하고 당신의 무대를 완성하세요!');
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
          placeholder="그룹 컨셉, 타겟 감정, 시즌을 선택하고 생성 버튼을 누르세요. Gemini가 완전한 K-팝 컨셉 시트를 작성합니다."
        />
      </div>
    </div>
  );
}
