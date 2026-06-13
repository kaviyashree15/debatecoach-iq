# ⚡ DebateCoach IQ
> Agents League Hackathon 2026 | 🧠 Reasoning Agents Track

AI debate coaching agent built on **Azure AI Foundry + xAI Grok + Microsoft Work IQ**.

## Quick Start

```bash
npm install
cp .env.example .env
# Add your xAI key: VITE_XAI_API_KEY=xai-...  (free at console.x.ai)
# Add Foundry keys from ai.azure.com
npm run dev
```

## Pages
- **Home** — overview and stack info
- **Coach Me** — submit argument, get AI feedback + evidence citations
- **Battle Mode** — 3-round live debate vs AI, auto-scored by judge
- **Research** — search evidence with Foundry IQ, generate counters
- **History** — track your scores over time

## Architecture
```
Work IQ (M365 Graph) + Foundry IQ (Grok search)
              ↓  foundryContext
         grokAI.js (xAI Grok)
              ↓
         debateAgent.js
              ↓
         React UI (5 pages)
```

## Why Grok?
Azure OpenAI is unavailable in Central India student subscriptions.
xAI Grok is OpenAI-compatible and globally accessible.
Microsoft IQ compliance is met via Work IQ (Graph API).

## IQ Layers
| Layer | File | Status |
|-------|------|--------|
| Work IQ | `src/services/workIQ.js` | ✅ Microsoft Graph API |
| Foundry IQ | `src/services/foundryIQ.js` | ✅ Grok live search backend |
