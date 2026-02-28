/**
 * K-WAVE AI STAGE — Cloudflare Worker
 * Gemini 2.0 Flash API Proxy with Streaming SSE
 */

export interface Env {
  GEMINI_API_KEY: string;
  ALLOWED_ORIGIN?: string;
}

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const MODEL = "gemini-2.0-flash";

function corsHeaders(origin: string, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": allowed === "*" ? "*" : (origin || "*"),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

// System prompts for each mode
const SYSTEM_PROMPTS: Record<string, string> = {
  kdrama: `You are a world-class K-Drama creative director and screenwriter. 
You specialize in crafting emotionally rich, cinematic Korean drama scenes with authentic dialogue, 
precise stage directions, and compelling character dynamics.
Write in a mix of Korean and English (Konglish style for authenticity).
Format your output clearly with character names in CAPS, followed by their dialogue.
Include directorial notes in [brackets].
Make it dramatic, emotionally resonant, and true to K-Drama conventions.`,

  kpop: `You are a top-tier K-Pop creative director and A&R executive at a major Korean entertainment agency.
You craft detailed concept sheets for K-Pop artists and groups, including visual identity, musical direction,
narrative arcs, and marketing hooks.
Use industry terminology. Be specific and evocative.
Mix Korean cultural references with global appeal.
Format with clear sections: GROUP CONCEPT, VISUAL IDENTITY, MUSICAL DIRECTION, TITLE TRACK CONCEPT, MARKETING ANGLE.`,

  storyarc: `You are a veteran K-Drama showrunner with experience writing hit series for Netflix Korea.
You excel at expanding single scenes into full episode arcs, creating narrative tension, 
character development beats, and cliffhangers that keep audiences hooked.
Format with: EPISODE STRUCTURE, KEY TURNING POINTS, CHARACTER ARCS, EPISODE HOOKS (per episode).
Be specific about emotional beats and plot mechanics.`,
};

// Prompt builders
function buildKDramaPrompt(params: Record<string, string>): string {
  const { genre, mood, characters, conflict } = params;
  return `Create a compelling K-Drama scene with the following parameters:

GENRE: ${genre || "로맨틱 멜로드라마 (Romantic Melodrama)"}
MOOD/ATMOSPHERE: ${mood || "긴장감과 설렘 (Tension and Excitement)"}
NUMBER OF CHARACTERS: ${characters || "2"}
CONFLICT TYPE: ${conflict || "오해와 재회 (Misunderstanding and Reunion)"}

Write a complete scene (approximately 400-600 words) with:
- Rich stage directions describing the setting, lighting, and atmosphere
- Authentic Korean drama dialogue with emotional depth
- A clear dramatic arc within this single scene (setup → escalation → emotional peak → cliffhanger/resolution)
- Character motivations that feel real and relatable

Start with the scene heading (INT./EXT., LOCATION, TIME) and make it cinematic.`;
}

function buildKPopPrompt(params: Record<string, string>): string {
  const { concept, emotion, season, members } = params;
  return `Create a detailed K-Pop concept sheet with these parameters:

GROUP CONCEPT: ${concept || "다크 판타지 (Dark Fantasy)"}
TARGET EMOTION: ${emotion || "강렬한 갈망 (Intense Longing)"}
SEASON/ERA: ${season || "윈터 컬렉션 2026 (Winter Collection 2026)"}
GROUP SIZE: ${members || "5인조 (5-member group)"}

Develop a comprehensive concept sheet including:
1. GROUP CONCEPT & NARRATIVE — The overarching story and identity
2. VISUAL IDENTITY — Color palette, fashion direction, hair/makeup concepts, set aesthetics
3. MUSICAL DIRECTION — Genre blend, tempo, instrumentation, vocal distribution
4. TITLE TRACK CONCEPT — Song theme, choreography mood, MV concept
5. ALBUM ARCHITECTURE — Track listing concept, interludes, storytelling through sequencing
6. MARKETING ANGLE — Unique hooks for global & Korean market, fan engagement strategy

Be specific, evocative, and commercially viable.`;
}

function buildStoryArcPrompt(params: Record<string, string>): string {
  const { scene, episodes, theme } = params;
  return `Expand this K-Drama scene/concept into a full story arc:

SCENE/CONCEPT: ${scene || "두 사람이 처음 만나는 장면 (Scene of two characters meeting for the first time)"}
NUMBER OF EPISODES: ${episodes || "16"}
CENTRAL THEME: ${theme || "운명적 사랑과 장벽 극복 (Destined Love Overcoming Obstacles)"}

Create a detailed story arc including:
1. SERIES PREMISE — The hook in one compelling sentence
2. EPISODE STRUCTURE — Act breaks and key plot points per quarter (eps 1-4, 5-8, 9-12, 13-16)
3. MAIN CHARACTER ARCS — How each lead character transforms
4. KEY DRAMATIC MOMENTS — The 5 most important scenes in the series
5. EPISODE HOOKS — Cliffhangers for episodes 1, 4, 8, 12, 15, and the finale
6. THEMATIC RESONANCE — How the theme is woven through the story

Make it emotionally compelling and binge-worthy.`;
}

async function handleGenerate(request: Request, env: Env): Promise<Response> {
  if (!env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { mode: string; params: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { mode, params } = body;

  if (!["kdrama", "kpop", "storyarc"].includes(mode)) {
    return new Response(JSON.stringify({ error: "Invalid mode. Use: kdrama, kpop, storyarc" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Build prompt
  let userPrompt: string;
  if (mode === "kdrama") userPrompt = buildKDramaPrompt(params);
  else if (mode === "kpop") userPrompt = buildKPopPrompt(params);
  else userPrompt = buildStoryArcPrompt(params);

  const systemPrompt = SYSTEM_PROMPTS[mode];

  // Call Gemini API with streaming
  const geminiUrl = `${GEMINI_API_BASE}/models/${MODEL}:streamGenerateContent?key=${env.GEMINI_API_KEY}&alt=sse`;

  const geminiBody = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  const origin = request.headers.get("Origin") || "*";

  try {
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      return new Response(JSON.stringify({ error: `Gemini API error: ${geminiResponse.status}`, detail: errText }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin, env) },
      });
    }

    // Stream the response through as SSE
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Process the Gemini SSE stream
    (async () => {
      const reader = geminiResponse.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === "[DONE]") {
                await writer.write(encoder.encode("data: [DONE]\n\n"));
                continue;
              }
              try {
                const parsed = JSON.parse(jsonStr);
                const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  const chunk = JSON.stringify({ text });
                  await writer.write(encoder.encode(`data: ${chunk}\n\n`));
                }
              } catch {
                // Skip unparseable lines
              }
            }
          }
        }
        // Send done signal
        await writer.write(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`));
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        ...corsHeaders(origin, env),
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin, env) },
    });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "*";

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin, env),
      });
    }

    // Health check
    if (url.pathname === "/health" || url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "ok", model: MODEL, timestamp: new Date().toISOString() }), {
        headers: { "Content-Type": "application/json", ...corsHeaders(origin, env) },
      });
    }

    // Generate endpoint
    if (url.pathname === "/api/generate" && request.method === "POST") {
      return handleGenerate(request, env);
    }

    return new Response(JSON.stringify({ error: "Not found", routes: ["/health", "/api/generate"] }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin, env) },
    });
  },
};
