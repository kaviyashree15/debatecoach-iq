import { useState } from "react";
import { analyseArgument } from "../agents/debateAgent.js";
import { saveDebateHistory } from "../services/workIQ.js";
import ScoreCard from "../components/ScoreCard.jsx";

const SAMPLE_TOPICS = [
  "Artificial Intelligence should be regulated by governments",
  "Social media does more harm than good",
  "Remote work is better than office work",
  "Electric vehicles are the future of transport",
  "Space exploration funding should be increased",
];

export default function Coach() {
  const [topic, setTopic]       = useState("");
  const [argument, setArgument] = useState("");
  const [side, setSide]         = useState("pro");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [citations, setCitations] = useState([]);
  const [error, setError]       = useState("");

  async function handleSubmit() {
    if (!topic.trim() || !argument.trim()) { setError("Please fill in both topic and argument."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const { result: r, citations: c } = await analyseArgument({ topic, argument, side, accessToken: null });
      setResult(r); setCitations(c);
      saveDebateHistory("default", { topic, argument, side, score: r?.score });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>🎯 Coach Me</h1>
      <p style={{ color: "var(--text2)", marginBottom: 28, fontSize: 14 }}>Submit your argument and get AI-powered coaching with grounded evidence.</p>

      {/* Topic */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Debate Topic</label>
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. AI should be regulated by governments"
          style={{ width: "100%", padding: "12px 16px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 14, outline: "none" }} />
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {SAMPLE_TOPICS.map((t) => (
            <button key={t} onClick={() => setTopic(t)}
              style={{ fontSize: 11, padding: "4px 10px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text2)" }}>
              {t.slice(0, 30)}…
            </button>
          ))}
        </div>
      </div>

      {/* Side */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Your Side</label>
        <div style={{ display: "flex", gap: 10 }}>
          {["pro", "con"].map((s) => (
            <button key={s} onClick={() => setSide(s)} style={{
              padding: "8px 24px", borderRadius: 8, fontWeight: 600, fontSize: 13,
              background: side === s ? (s === "pro" ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)") : "var(--bg2)",
              border: `1px solid ${side === s ? (s === "pro" ? "var(--pro)" : "var(--con)") : "var(--border)"}`,
              color: side === s ? (s === "pro" ? "var(--pro)" : "var(--con)") : "var(--text2)",
            }}>
              {s === "pro" ? "✓ PRO" : "✗ CON"}
            </button>
          ))}
        </div>
      </div>

      {/* Argument */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Your Argument</label>
        <textarea value={argument} onChange={(e) => setArgument(e.target.value)}
          placeholder="Write your argument here. The AI will analyse your logic, evidence use, and delivery..."
          rows={6} style={{ width: "100%", padding: "12px 16px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit" }} />
      </div>

      {error && <div style={{ color: "var(--con)", fontSize: 13, marginBottom: 12 }}>{error}</div>}

      <button onClick={handleSubmit} disabled={loading} style={{
        padding: "12px 32px", background: loading ? "var(--bg3)" : "var(--accent)", color: "#fff",
        border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, transition: "opacity 0.15s",
      }}>
        {loading ? "Analysing with Grok + Foundry IQ…" : "Analyse My Argument →"}
      </button>

      <ScoreCard result={result} citations={citations} />
    </div>
  );
}
