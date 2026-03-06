import { useState } from 'react';

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    name: 'Star (무료)',
    price: '₩0',
    description: '기본적인 컨셉 시트 생성 및 맛보기',
    features: [
      '일일 3회 생성 제한',
      '표준 생성 속도',
      '기본 텍스트 리포트',
      '커뮤니티 지원',
    ],
    buttonText: '현재 플랜',
  },
  {
    name: 'Superstar (Pro)',
    price: '₩12,900',
    description: '본격적인 오디션 준비와 컨셉 빌딩',
    features: [
      '무제한 생성 지원',
      '우선 순위 생성 (초고속)',
      '상세 아티스트 세계관 생성',
      '오디션 안무/보컬 가이드 포함',
      '생성 결과물 PDF 다운로드',
    ],
    buttonText: '지금 결제하고 시작하기',
    isPopular: true,
  },
  {
    name: 'Global Icon',
    price: '₩49,000',
    description: '전문가용 맞춤형 브랜딩 솔루션',
    features: [
      'Superstar의 모든 기능',
      'AI 퍼스널 컬러/스타일링 분석',
      '1:1 오디션 포트폴리오 리뷰',
      '글로벌 타겟팅 전략 제안',
      '전용 고객 지원 채널',
    ],
    buttonText: '전문가와 상담하기',
  },
];

export function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (planName: string) => {
    // [그로스 데이터 수집] 실제 결제 의사를 확인하기 위한 클릭 로그
    console.log(`[CONVERSION_EXPERIMENT] User selected plan: ${planName} at ${new Date().toISOString()}`);
    setSelectedPlan(planName);
    
    // 호기심과 실제 의향을 구분하기 위한 2차 팝업 (가상 결제창)
    if (planName !== 'Star (무료)') {
      alert(`[결제 확인] ${planName} 플랜으로 업그레이드하시겠습니까?

이 버튼을 클릭하는 것은 실제 결제 의사가 있음을 의미합니다.`);
      console.log(`[CONVERSION_EXPERIMENT] User confirmed payment intent for: ${planName}`);
    }
  };

  return (
    <section id="pricing" className="py-16 animate-[fadeIn_0.6s_ease-out]">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black mb-4">
          <span className="gold-shimmer uppercase tracking-tighter">Choose Your Stage</span>
        </h2>
        <p className="text-purple-300/70 max-w-2xl mx-auto">
          당신의 꿈을 현실로 만드는 가장 빠른 방법. <br />
          StageAI와 함께 데뷔를 향한 첫 걸음을 떼어보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`kwave-card p-8 flex flex-col relative transition-all duration-300 hover:-translate-y-2 ${
              plan.isPopular ? 'border-[#f0c040] shadow-[0_0_30px_rgba(240,192,64,0.15)]' : ''
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#f0c040] to-[#c09020] text-[#0a0015] text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#f0c040]">{plan.price}</span>
                <span className="text-purple-400/60 text-sm">/ month</span>
              </div>
              <p className="text-purple-300/60 text-xs mt-4 leading-relaxed">
                {plan.description}
              </p>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-white/80">
                  <span className="text-[#f0c040] mt-1 text-xs">✔</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanSelect(plan.name)}
              className={`${
                plan.isPopular ? 'kwave-btn-primary' : 'kwave-btn-secondary w-full py-4 text-base font-bold'
              }`}
              disabled={plan.name === 'Star (무료)'}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-purple-400/40 text-[10px] uppercase tracking-widest">
          No credit card required for free plan · Cancel anytime
        </p>
      </div>
    </section>
  );
}
