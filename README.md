# 🌊 K-WAVE AI STAGE

> AI Co-Creator for K-Drama & K-Pop — Powered by Gemini 3

**Gemini 3 Seoul Hackathon 2026 | Entertainment Track**

---

## 🎯 What is K-WAVE AI STAGE?

K-WAVE AI STAGE is an interactive AI creative platform that uses **Gemini 2.0 Flash** as your co-creator for Korean entertainment content.

- **K-Drama Scene Generator** — Input genre, mood, character count, and conflict type → Get real-time streaming drama scenes with authentic dialogue and directorial notes
- **K-Pop Concept Sheet Generator** — Input group concept, target emotion, and season → Get complete concept sheets with visual identity, musical direction, and title track concepts
- **Story Arc Expander** — Input a scene or concept → Get full episode-by-episode series arcs with character development and cliffhangers

## 🌟 Why K-WAVE?

Korea's entertainment industry generates **$12B+** annually. K-drama writers and K-pop creative directors face repetitive creative blocks in early production. K-WAVE AI STAGE removes the blank page problem, boosting creator productivity by **10x**.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS |
| AI Backend | Cloudflare Workers (Gemini API Proxy with SSE Streaming) |
| AI Model | Gemini 2.0 Flash (`gemini-2.0-flash`) |
| Deployment | Cloudflare Pages + Workers |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# Run frontend (port 3000)
npm run dev

# Run worker locally (port 8787, in another terminal)
npm run dev:worker
# Set worker secret: npx wrangler secret put GEMINI_API_KEY
```

## 📦 Deploy to Cloudflare

```bash
# 1. Set Gemini API Key as Workers secret
npx wrangler secret put GEMINI_API_KEY

# 2. Deploy Worker
npm run deploy:worker

# 3. Deploy Pages (update VITE_WORKER_URL in .env first)
npm run deploy:pages
```

## 🎬 Demo Features

### K-Drama Scene Generator
- 10 genre options (Romantic Melodrama, Chaebol Romance, Revenge Thriller...)
- 8 mood options (Tension & Excitement, Bittersweet Farewell...)
- Character count selector (2-5+)
- 8 conflict types (Misunderstanding & Reunion, Class Divide...)

### K-Pop Concept Sheet Generator
- 10 concept options (Dark Fantasy, Cyberpunk, High-teen Summer...)
- 8 target emotions
- Season/era selector
- Group structure options (Girl Group, Boy Group, Solo, Duo...)

### Story Arc Expander
- Free-text scene/concept input
- Episode count (8, 12, 16, 20, 24 episodes)
- 10 central themes
- Generates full series arc with cliffhangers

## 🏆 Hackathon Details

- **Event:** Gemini 3 Seoul Hackathon 2026
- **Track:** Gemini in Entertainment
- **Team:** CroinDA
- **Built in:** ~60 minutes

---

*K-WAVE AI STAGE — Gemini가 당신의 공동 크리에이터입니다.*
