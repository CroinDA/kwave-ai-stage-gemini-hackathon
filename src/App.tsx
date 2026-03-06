import { useState } from 'react';
import { KDramaGenerator } from './components/KDramaGenerator';
import { KPopConceptGenerator } from './components/KPopConceptGenerator';
import { StoryArcExpander } from './components/StoryArcExpander';
import { Pricing } from './components/Pricing';

type Tab = 'kdrama' | 'kpop' | 'storyarc';

interface TabConfig {
  id: Tab;
  emoji: string;
  label: string;
  sublabel: string;
  badge?: string;
}

const TABS: TabConfig[] = [
  {
    id: 'kdrama',
    emoji: '🎬',
    label: 'K-드라마 씬',
    sublabel: 'Scene Generator',
    badge: 'LIVE',
  },
  {
    id: 'kpop',
    emoji: '🎤',
    label: 'K-팝 컨셉',
    sublabel: 'Concept Sheet',
  },
  {
    id: 'storyarc',
    emoji: '📖',
    label: '스토리 아크',
    sublabel: 'Arc Expander',
  },
];

function Header() {
  return (
    <header className="relative overflow-hidden border-b border-[#3a1060]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0015] via-[#1a0533] to-[#0a0015]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(240,192,64,0.1)_0%,transparent_60%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f0c040] to-[#c09020] flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(240,192,64,0.4)]">
                🌊
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e040fb] animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                <span className="gold-shimmer">K-WAVE</span>
                <span className="text-white ml-2">AI STAGE</span>
              </h1>
              <p className="text-purple-300/70 text-xs sm:text-sm font-medium mt-0.5">
                AI Co-Creator for K-Drama & K-Pop · Powered by Gemini
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e040fb]/10 border border-[#e040fb]/30">
              <div className="w-2 h-2 rounded-full bg-[#e040fb] animate-pulse" />
              <span className="text-[#e040fb] text-xs font-semibold">Gemini 2.0 Flash</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0c040]/10 border border-[#f0c040]/30">
              <span className="text-[#f0c040] text-xs font-semibold">⚡ Real-time Streaming</span>
            </div>
          </div>
        </div>

        {/* Hero tagline */}
        <div className="mt-4 max-w-2xl">
          <p className="text-white/80 text-sm leading-relaxed">
            한국은 세계 엔터테인먼트의 수도입니다. K-드라마 작가는 여전히 빈 페이지 앞에서 시작합니다.
            <span className="text-[#f0c040] font-semibold"> 지금까지는요.</span>
          </p>
        </div>
      </div>
    </header>
  );
}

function TabNav({ activeTab, onTabChange }: { activeTab: Tab; onTabChange: (tab: Tab) => void }) {
  return (
    <div className="sticky top-0 z-10 bg-[#0a0015]/95 backdrop-blur-sm border-b border-[#3a1060]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'text-[#f0c040] border-[#f0c040]'
                  : 'text-purple-300/70 border-transparent hover:text-purple-100 hover:border-purple-500/50'
              }`}
            >
              <span className="text-base">{tab.emoji}</span>
              <span className="hidden sm:block">
                <span className="block text-sm">{tab.label}</span>
                <span className="block text-xs opacity-60">{tab.sublabel}</span>
              </span>
              <span className="block sm:hidden">{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#3a1060] mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌊</span>
            <div>
              <p className="text-white font-bold text-sm">K-WAVE AI STAGE</p>
              <p className="text-purple-400/60 text-xs">Built for Gemini 3 Seoul Hackathon 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-purple-400/50">
            <span>🇰🇷 Seoul, Korea</span>
            <span>·</span>
            <span>Powered by Gemini 2.0 Flash</span>
            <span>·</span>
            <span>Cloudflare Workers</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[#3a1060]/50">
          <p className="text-center text-purple-400/40 text-xs">
            K-WAVE AI STAGE — AI Co-Creator for K-Drama & K-Pop. Empowering Korea's $12B+ entertainment industry with Gemini AI.
          </p>
        </div>
      </div>
    </footer>
  );
}

function StatsBar() {
  return (
    <div className="bg-[#12002a]/80 border-b border-[#3a1060]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-center gap-6 sm:gap-10 text-xs">
          {[
            { label: 'K-엔터 시장 규모', value: '$12B+' },
            { label: '창작자 생산성 향상', value: '10x' },
            { label: 'AI 모델', value: 'Gemini 2.0 Flash' },
            { label: '응답 지연', value: '실시간 스트리밍' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-[#f0c040] font-bold">{stat.value}</span>
              <span className="text-purple-400/60 hidden sm:block">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('kdrama');

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0015]">
      <Header />
      <StatsBar />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'kdrama' && <KDramaGenerator />}
        {activeTab === 'kpop' && <KPopConceptGenerator />}
        {activeTab === 'storyarc' && <StoryArcExpander />}
        
        <div className="mt-20 pt-20 border-t border-[#3a1060]/50">
          <Pricing />
        </div>
      </main>

      <Footer />
    </div>
  );
}
