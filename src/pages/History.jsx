import { useState, useEffect } from "react";
import { getUserDebateHistory } from "../services/workIQ.js";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => { setHistory(getUserDebateHistory("default")); }, []);

  if (history.length === 0) {
    return (
      <div style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>📊 History</h1>
        <p style={{ color: "var(--text2)", marginBottom: 40, fontSize: 14 }}>Track your debate performance over time.</p>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>No sessions yet</div>
          <div style={{ color: "var(--text2)", fontSize: 14 }}>Complete a coaching session to see your history here.</div>
        </div>
      </div>
    );
  }

  const avg = (history.reduce((s, h) => s + (h.score || 0), 0) / history.length).toFixed(0);
  const best = Math.max(...history.map((h) => h.score || 0));

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>📊 History</h1>
      <p style={{ color: "var(--text2)", marginBottom: 24, fontSize: 14 }}>Your debate coaching sessions.</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Sessions", value: history.length, color: "var(--accent)" },
          { label: "Average Score", value: avg, color: "var(--accent2)" },
          { label: "Best Score", value: best, color: "var(--pro)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Sessions */}
      {history.map((h, i) => {
        const scoreColor = (h.score || 0) >= 75 ? "var(--pro)" : (h.score || 0) >= 50 ? "#fbbf24" : "var(--con)";
        return (
          <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 18, marginBottom: 10, display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", border: `2px solid ${scoreColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: scoreColor }}>{h.score || "—"}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{h.topic}</div>
              <div style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--text2)" }}>
                <span style={{ color: h.side === "pro" ? "var(--pro)" : "var(--con)", fontWeight: 600 }}>{h.side?.toUpperCase()}</span>
                <span>·</span>
                <span>{h.savedAt ? new Date(h.savedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Unknown date"}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
