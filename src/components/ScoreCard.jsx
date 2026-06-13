export default function ScoreCard({ result, citations = [] }) {
  if (!result) return null;
  const { score, strengths = [], improvements = [], tip, overallFeedback } = result;

  const color = score >= 75 ? "var(--pro)" : score >= 50 ? "#fbbf24" : "var(--con)";

  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, marginTop: 20 }}>
      {/* Score */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", border: `3px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ fontSize: 26, fontWeight: 800, color }}>{score}</div>
          <div style={{ fontSize: 10, color: "var(--text2)" }}>/ 100</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Coaching Feedback</div>
          <div style={{ color: "var(--text2)", fontSize: 13, marginTop: 4 }}>{overallFeedback}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Strengths */}
        <div style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 8, padding: 16 }}>
          <div style={{ fontWeight: 600, color: "var(--pro)", marginBottom: 8, fontSize: 13 }}>✓ Strengths</div>
          {strengths.map((s, i) => <div key={i} style={{ fontSize: 13, color: "var(--text2)", padding: "3px 0" }}>• {s}</div>)}
        </div>
        {/* Improvements */}
        <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: 16 }}>
          <div style={{ fontWeight: 600, color: "var(--con)", marginBottom: 8, fontSize: 13 }}>↑ Improve</div>
          {improvements.map((s, i) => <div key={i} style={{ fontSize: 13, color: "var(--text2)", padding: "3px 0" }}>• {s}</div>)}
        </div>
      </div>

      {/* Tip */}
      {tip && (
        <div style={{ background: "rgba(124,110,230,0.1)", border: "1px solid rgba(124,110,230,0.2)", borderRadius: 8, padding: 12, fontSize: 13 }}>
          💡 <strong>Coach tip:</strong> {tip}
        </div>
      )}

      {/* Citations */}
      {citations.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8, fontWeight: 600 }}>📚 Evidence Sources (Foundry IQ)</div>
          {citations.slice(0, 3).map((c) => (
            <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer"
              style={{ display: "block", fontSize: 12, color: "var(--accent2)", padding: "2px 0" }}>
              [{c.id}] {c.title} — {(c.credibilityScore * 100).toFixed(0)}% credibility
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
