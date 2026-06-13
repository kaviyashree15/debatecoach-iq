/**
 * foundryIQ.js — Foundry IQ grounding layer
 * Uses Grok live-search as the backend (Azure AI Search unavailable in Central India).
 * Same exported API as the original foundryIQ.js.
 */

import { GROK, DEMO_MODE } from "./config.js";

const DEMO_CITATIONS = [
  { id: "cite_001", title: "Technology in Education: A 2024 UNESCO Report", url: "https://unesco.org/reports/tech-education-2024", excerpt: "Studies show technology integration improves student outcomes by 23% when used effectively in structured environments.", relevanceScore: 0.95, credibilityScore: 0.95, source: "foundry_iq_grok" },
  { id: "cite_002", title: "Digital Divide in Developing Nations — WHO 2024", url: "https://who.int/reports/digital-divide-2024", excerpt: "Over 2.7 billion people lack reliable internet access, raising serious equity concerns about digital-first policies.", relevanceScore: 0.88, credibilityScore: 0.95, source: "foundry_iq_grok" },
  { id: "cite_003", title: "AI Policy Implications: Brookings Institution", url: "https://brookings.edu/ai-policy-2024", excerpt: "Regulatory frameworks must balance innovation with ethical safeguards to prevent misuse of AI systems.", relevanceScore: 0.82, credibilityScore: 0.9, source: "foundry_iq_grok" },
];

const HIGH_CREDIBILITY = ["nature.com","science.org","pubmed.ncbi.nlm.nih.gov","bbc.com","reuters.com","apnews.com","brookings.edu","pewresearch.org","who.int","un.org","whitehouse.gov","congress.gov","thehindu.com","ndtv.com","indianexpress.com","pib.gov.in"];
const BLOCKED = ["infowars.com","breitbart.com","theonion.com"];

function domainScore(url) {
  try {
    const h = new URL(url).hostname.replace("www.", "");
    if (BLOCKED.some((d) => h.includes(d))) return 0;
    if (HIGH_CREDIBILITY.some((d) => h.includes(d))) return 0.95;
    if (h.endsWith(".edu")) return 0.9;
    if (h.endsWith(".gov") || h.endsWith(".gov.in")) return 0.92;
    if (h.endsWith(".org")) return 0.75;
    return 0.6;
  } catch { return 0.5; }
}

async function grokLiveSearch(query) {
  if (!GROK.apiKey) return [];
  try {
    const res = await fetch(GROK.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROK.apiKey}` },
      body: JSON.stringify({
        model: GROK.model,
        messages: [
          { role: "system", content: "You are a research assistant for an Azure AI Foundry debate coaching agent. Search the web and return a JSON array of the most relevant, credible sources. Each object: { title, url, excerpt (≤300 chars) }. Prefer academic, government, established news. Return ONLY the JSON array." },
          { role: "user", content: `Research query: ${query}` },
        ],
        max_tokens: 1500, temperature: 0.2,
        search_parameters: { mode: "on", return_citations: true, max_search_results: 5 },
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const grokCites = data.citations || [];
    if (grokCites.length > 0) return grokCites.map((c, i) => ({ title: c.title || "Untitled", url: c.url || "#", excerpt: c.snippet || c.text?.slice(0, 300) || "", _rank: i }));
    const content = data.choices?.[0]?.message?.content || "[]";
    const parsed = JSON.parse(content.replace(/```json\n?|```\n?/g, "").trim());
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function mergeAndRank(allResults) {
  const seen = new Set(), deduped = [];
  for (const rs of allResults) for (const item of rs) {
    if (!item.url || seen.has(item.url)) continue;
    seen.add(item.url); deduped.push(item);
  }
  return deduped
    .map((c, idx) => { const r = Math.max(0.4, 1 - idx * 0.06), cr = domainScore(c.url); return { ...c, r, cr, comp: r * 0.6 + cr * 0.4 }; })
    .sort((a, b) => b.comp - a.comp)
    .slice(0, 8)
    .map((c, idx) => ({ id: `cite_${String(idx + 1).padStart(3, "0")}`, title: c.title, url: c.url, excerpt: c.excerpt, relevanceScore: parseFloat(c.r.toFixed(3)), credibilityScore: parseFloat(c.cr.toFixed(3)), source: "foundry_iq_grok" }));
}

export async function retrieveEvidence(topic) {
  if (DEMO_MODE) return { citations: DEMO_CITATIONS, summary: DEMO_CITATIONS.map((c) => c.excerpt).join(" | ").slice(0, 500), queryCount: 3, latencyMs: 80 };
  const start = Date.now();
  const results = await Promise.all([topic, `arguments supporting: ${topic}`, `arguments against: ${topic}`].map(grokLiveSearch));
  const citations = mergeAndRank(results);
  return { citations, summary: citations.slice(0, 3).map((c) => c.excerpt).join(" | ").slice(0, 500), queryCount: 3, latencyMs: Date.now() - start };
}

export function getCitationById(citations, id) { return citations.find((c) => c.id === id) ?? null; }

export function formatCitationsForPrompt(citations) {
  return citations.map((c) => `[${c.id}] "${c.title}"\n  Excerpt: ${c.excerpt}\n  URL: ${c.url}\n  Credibility: ${(c.credibilityScore * 100).toFixed(0)}%`).join("\n\n");
}
