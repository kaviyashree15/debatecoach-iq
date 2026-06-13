# ⚡ DebateCoach IQ
> **Agents League Hackathon 2026** | 🧠 Reasoning Agents Track

An AI-powered debate coaching agent built on **Azure AI Foundry + Groq (Llama 3.3) + Microsoft Work IQ**.

---

## 🎯 What It Does

DebateCoach IQ helps students and professionals become better debaters using AI:

- **🎯 Coach Me** — Submit your argument, get instant AI feedback with score, strengths, improvements, and evidence citations
- **⚔️ Battle Mode** — Debate live against the AI in 3 rounds, then get judged automatically
- **🔍 Research** — Find grounded, credible evidence for any debate topic using Foundry IQ
- **📊 History** — Track your scores and improvement over time

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│            Azure AI Foundry (debatecoach project)       │
│                    Central India                        │
│                                                         │
│  ┌─────────────┐   ┌──────────────┐   ┌─────────────┐  │
│  │  workIQ.js  │   │ foundryIQ.js │   │  grokAI.js  │  │
│  │             │   │              │   │             │  │
│  │ Work IQ     │   │ Foundry IQ   │   │ Groq LLM   │  │
│  │ M365 Graph  │   │ Live search  │   │ Llama 3.3  │  │
│  │ user context│   │  grounding   │   │            │  │
│  └──────┬──────┘   └──────┬───────┘   └──────┬──────┘  │
│         │                 │                  │          │
│         └────────┬────────┘                  │          │
│              foundryContext              completions    │
│                  └───────────────────────────┘          │
│                          │                              │
│                  ┌───────▼────────┐                     │
│                  │ debateAgent.js │                     │
│                  │ reasoning agent│                     │
│                  └────────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Project** | Azure AI Foundry | Project management, agent framework, IQ layer |
| **LLM** | Groq — Llama 3.3 70B | Azure OpenAI unavailable in Central India |
| **Work IQ** | Microsoft 365 Graph API | User context, emails, calendar personalisation |
| **Foundry IQ** | Groq live search | Grounded evidence retrieval |
| **Frontend** | React + Vite | Fast, modern UI |

> **Note:** Azure OpenAI is not available in the Central India region on student subscriptions. Groq (Llama 3.3 70B) is used as an OpenAI-compatible LLM replacement. The Microsoft IQ requirement is met through **Work IQ** (Microsoft Graph API).

---

## ✅ Microsoft IQ Compliance

| IQ Layer | File | Implementation |
|----------|------|----------------|
| **Work IQ** | `src/services/workIQ.js` | Microsoft Graph API — pulls M365 user profile, emails, calendar and injects as grounding context |
| **Foundry IQ** | `src/services/foundryIQ.js` | Same exported API as native Foundry IQ; Groq live search as backend |

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/kaviyashree15/debatecoach-iq.git
cd debatecoach-iq

# 2. Install dependencies
npm install
npm install vite@5.3.1 @vitejs/plugin-react@4.3.1 --save-dev

# 3. Set up environment
cp .env.example .env
# Add your Groq API key (free at https://console.groq.com)
# VITE_GROQ_API_KEY=gsk_...

# 4. Run
npm run dev
```

Open `http://localhost:5173` in your browser.

> **Demo mode:** Set `VITE_DEMO_MODE=true` to run without any API keys.

---

## 📁 Project Structure

```
src/
├── agents/
│   └── debateAgent.js      # Main reasoning agent
├── services/
│   ├── config.js           # Central configuration
│   ├── grokAI.js           # Groq LLM client
│   ├── foundryIQ.js        # Foundry IQ grounding layer
│   └── workIQ.js           # Microsoft Work IQ (Graph API)
├── components/
│   ├── Layout.jsx           # Sidebar navigation
│   └── ScoreCard.jsx        # Feedback display
└── pages/
    ├── Home.jsx             # Landing page
    ├── Coach.jsx            # Argument coaching
    ├── Battle.jsx           # Live debate battle
    ├── Research.jsx         # Evidence research
    └── History.jsx          # Session history
```

---

## 🌐 Environment Variables

```env
VITE_GROQ_API_KEY=          # From https://console.groq.com (free)
VITE_GROQ_MODEL=            # llama-3.3-70b-versatile
VITE_FOUNDRY_ENDPOINT=      # From ai.azure.com
VITE_FOUNDRY_API_KEY=       # From ai.azure.com
VITE_M365_CLIENT_ID=        # From portal.azure.com (optional)
VITE_DEMO_MODE=             # true/false
```

---

## 👩‍💻 Built By

**Kaviya Shree R.P** — Agents League Hackathon 2026

---

## 📄 License

MIT
