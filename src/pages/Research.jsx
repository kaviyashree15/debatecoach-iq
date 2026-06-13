import { useState } from "react";
import { retrieveEvidence } from "../services/foundryIQ.js";
import { generateCounter } from "../agents/debateAgent.js";

export default function Research() {
  const [topic, setTopic]         = useState("");
  const [citations, setCitations] = useState([]);
  const [summary, setSummary]     = useState("");
  const [latency, setLatency]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [counter, setCounter]     = useState(null);
  const [counterLoading, setCounterLoading] = useState(false);
  const [selectedArg, setSelectedArg] = useState("");

  async function handleSearch() {
    if (!topic.trim()) return;
    setLoading(true); setCitations([]); setSummary(""); setCounter(null);
    try {
      const { citations: c, summary: s, latencyMs } = await retrieveEvidence(topic);
      setCitations(c); setSummary(s); setLatency(latencyMs);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleCounter() {
    if (!selectedArg.trim()) return;
    setCounterLoading(true);
    try {
      const { result } = await generateCounter({ topic, argumentToCounter: selectedArg, targetSide: "pro" });
      setCounter(result);
    } catch (e) { console.error(e); }
    finally { setCounterLoading(false); }
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>🔍 Research</h1>
      <p style={{ color: "var(--text2)", marginBottom: 28, fontSize: 14 }}>Find grounded evidence for any debate topic using Foundry IQ + Grok live search.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <input value={topic} onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter a debate topic to research..."
          style={{ flex: 1, padding: "12px 16px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 14, outline: "none" }} />
        <button onClick={handleSearch} disabled={loading || !topic.trim()}
          style={{ padding: "0 24px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {summary && (
        <div style={{ background: "rgba(124,110,230,0.08)", border: "1px solid rgba(124,110,230,0.2)", borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, marginBottom: 6 }}>
            FOUNDRY IQ SUMMARY · {latency}ms · {citations.length} sources
          </div>
          <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{summary}</div>
        </div>
      )}

      {citations.length > 0 && (
        <div>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Evidence Sources</div>
          {citations.map((c) => (
            <div key={c.id} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 11, color: "var(--text2)", marginRight: 8 }}>[{c.id}]</span>
                  <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: 14, color: "var(--accent2)" }}>{c.title}</a>
                </div>
                <div style={{ display: "flex", gap: 8, fontSize: 11 }}>
                  <span style={{ padding: "2px 8px", background: "rgba(52,211,153,0.1)", color: "var(--pro)", borderRadius: 4 }}>
                    {(c.credibilityScore * 100).toFixed(0)}% credible
                  </span>
                  <span style={{ padding: "2px 8px", background: "rgba(91,141,238,0.1)", color: "var(--accent2)", borderRadius: 4 }}>
                    {(c.relevanceScore * 100).toFixed(0)}% relevant
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{c.excerpt}</div>
              <div style={{ fontSize: 11, color: "var(--border)", marginTop: 6 }}>{c.url}</div>
            </div>
          ))}

          {/* Counter generator */}
          <div style={{ marginTop: 24, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>⚡ Generate Counter-Argument</div>
            <textarea value={selectedArg} onChange={(e) => setSelectedArg(e.target.value)}
              placeholder="Paste an argument you want to counter..."
              rows={3} style={{ width: "100%", padding: "10px 14px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", marginBottom: 10 }} />
            <button onClick={handleCounter} disabled={counterLoading || !selectedArg.trim()}
              style={{ padding: "8px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
              {counterLoading ? "Generating…" : "Generate Counter"}
            </button>
            {counter && (
              <div style={{ marginTop: 14, padding: 14, background: "var(--bg3)", borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 10 }}>{counter.counterArgument}</div>
                {counter.keyPoints?.map((p, i) => <div key={i} style={{ fontSize: 13, color: "var(--text2)" }}>• {p}</div>)}
                <div style={{ marginTop: 8, fontSize: 12, color: "var(--accent)" }}>Strength: {counter.strengthRating}/100</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
