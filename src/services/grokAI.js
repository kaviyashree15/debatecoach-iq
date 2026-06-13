/**
 * grokAI.js — xAI Grok LLM client
 * Azure OpenAI is unavailable in Central India; Grok is the drop-in replacement.
 * foundryContext (from Work IQ / foundryIQ.js) is injected into every system prompt.
 */

import { GROK, DEMO_MODE } from "./config.js";

const DEMO_RESPONSES = {
  coaching: JSON.stringify({
    score: 78,
    strengths: ["Clear opening statement", "Good use of examples", "Confident tone"],
    improvements: ["Add more statistics", "Address counterarguments directly", "Strengthen conclusion"],
    tip: "Use the PEEL method: Point → Evidence → Explain → Link back.",
    citationsUsed: ["cite_001", "cite_002"],
    overallFeedback: "Solid argument with good structure. Work on backing claims with data.",
  }),
  counter: JSON.stringify({
    counterArgument: "While proponents argue for technological advancement, studies show a 34% increase in social isolation among heavy tech users.",
    keyPoints: ["Social isolation data", "Mental health impacts", "Digital divide concerns"],
    evidenceRefs: ["cite_001"],
    strengthRating: 82,
  }),
  battle: JSON.stringify({
    argument: "Technology in education has demonstrably improved learning outcomes, with a 2024 UNESCO study showing 23% better retention rates in tech-enabled classrooms.",
    keyPoints: ["UNESCO study 2024", "23% better retention", "Personalised learning paths"],
    rebuttal: "The opposition ignores infrastructure inequality that makes this benefit unequal.",
    citationsUsed: ["cite_001"],
  }),
  score: JSON.stringify({
    proScore: 74,
    conScore: 68,
    winner: "pro",
    breakdown: { clarity: 80, evidence: 72, rebuttal: 70, delivery: 75 },
    judgeSummary: "PRO presented stronger evidence-backed arguments. CON had good rebuttals but lacked cited sources.",
  }),
};

function buildHeaders() {
  if (!GROK.apiKey && !DEMO_MODE) throw new Error("VITE_GROQ_API_KEY missing. Get a free key at https://console.x.ai");
  return { "Content-Type": "application/json", Authorization: `Bearer ${GROK.apiKey}` };
}

function safeParseJSON(text) {
  try { return JSON.parse(text.replace(/```json\n?|```\n?/g, "").trim()); }
  catch { return null; }
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function injectContext(systemPrompt, foundryContext) {
  if (!foundryContext) return systemPrompt;
  return `=== AZURE FOUNDRY IQ GROUNDING CONTEXT ===\n${foundryContext}\n=== END CONTEXT ===\n\n${systemPrompt}`;
}

export async function complete({ systemPrompt, userPrompt, foundryContext = null, temperature = 0.7, maxTokens = 2000, retries = 3, demoKey = "coaching" }) {
  if (DEMO_MODE) {
    const text = DEMO_RESPONSES[demoKey] || DEMO_RESPONSES.coaching;
    return { text, usage: null, parsed: safeParseJSON(text) };
  }

  const body = {
    model: GROK.model,
    messages: [
      { role: "system", content: injectContext(systemPrompt, foundryContext) },
      { role: "user", content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
    response_format: { type: "json_object" },
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(GROK.baseUrl, { method: "POST", headers: buildHeaders(), body: JSON.stringify(body) });
      if (!res.ok) {
        const err = await res.text();
        if (res.status === 429 && attempt < retries) { await sleep(1000 * attempt); continue; }
        throw new Error(`Grok ${res.status}: ${err}`);
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      return { text: content, usage: data.usage ?? null, parsed: safeParseJSON(content) };
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(500 * attempt);
    }
  }
}

export async function* completeStream({ systemPrompt, userPrompt, foundryContext = null, conversationHistory = [], temperature = 0.7, maxTokens = 1500 }) {
  if (DEMO_MODE) {
    const words = "This is a demo streaming response. Add your xAI API key to enable live AI responses.".split(" ");
    for (const w of words) { yield w + " "; await sleep(60); }
    return;
  }

  const res = await fetch(GROK.baseUrl, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      model: GROK.model,
      messages: [
        { role: "system", content: injectContext(systemPrompt, foundryContext) },
        ...conversationHistory,
        { role: "user", content: userPrompt },
      ],
      temperature, max_tokens: maxTokens, stream: true,
    }),
  });

  if (!res.ok) throw new Error(`Grok stream ${res.status}: ${await res.text()}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") return;
      try { const t = JSON.parse(json).choices?.[0]?.delta?.content; if (t) yield t; } catch { }
    }
  }
}

export async function continueConversation({ systemPrompt, history, newUserMessage, foundryContext = null, temperature = 0.8, maxTokens = 1000, demoKey = "battle" }) {
  if (DEMO_MODE) {
    const text = DEMO_RESPONSES[demoKey] || DEMO_RESPONSES.battle;
    return { text, parsed: safeParseJSON(text), assistantMessage: { role: "assistant", content: text } };
  }

  const res = await fetch(GROK.baseUrl, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      model: GROK.model,
      messages: [
        { role: "system", content: injectContext(systemPrompt, foundryContext) },
        ...history,
        { role: "user", content: newUserMessage },
      ],
      temperature, max_tokens: maxTokens, response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) throw new Error(`Grok ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  return { text: content, parsed: safeParseJSON(content), assistantMessage: { role: "assistant", content } };
}

export { DEMO_MODE };
