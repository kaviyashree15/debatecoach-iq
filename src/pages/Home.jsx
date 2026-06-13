import { Link } from "react-router-dom";
import { DEMO_MODE } from "../services/grokAI.js";

const FEATURES = [
  { icon: "🎯", title: "Coach Me", desc: "Submit your argument and get AI-powered feedback with evidence citations.", to: "/coach", color: "var(--accent)" },
  { icon: "⚔️",  title: "Battle Mode", desc: "Go head-to-head in a live debate battle against the AI.", to: "/battle", color: "#5b8dee" },
  { icon: "🔍", title: "Research", desc: "Find grounded evidence for any debate topic using Foundry IQ.", to: "/research", color: "var(--pro)" },
  { icon: "📊", title: "History", desc: "Review your past sessions and track your improvement over time.", to: "/history", color: "#fbbf24" },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 900 }}>
      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span className="badge">Azure AI Foundry</span>
          <span className="badge">xAI Grok</span>
          <span className="badge">Work IQ</span>
          {DEMO_MODE && <span style={{ fontSize: 12, color: "#f87171", padding: "2px 8px", background: "rgba(248,113,113,0.1)", borderRadius: 6, border: "1px solid rgba(248,113,113,0.3)" }}>Demo Mode — Add VITE_XAI_API_KEY to .env</span>}
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 16 }}>
          Become a better<br />
          <span style={{ background: "linear-gradient(135deg, var(--accent), var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>debater with AI</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text2)", maxWidth: 560, lineHeight: 1.6 }}>
          DebateCoach IQ uses Azure AI Foundry + xAI Grok + Microsoft Work IQ to give you
          real-time coaching, grounded evidence, and live battle practice.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <Link to="/coach" style={{ padding: "12px 28px", background: "var(--accent)", color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: 15 }}>
            Start Coaching →
          </Link>
          <Link to="/battle" style={{ padding: "12px 28px", background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 8, fontWeight: 600, fontSize: 15 }}>
            ⚔️ Battle Mode
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {FEATURES.map(({ icon, title, desc, to, color }) => (
          <Link key={to} to={to} style={{
            background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
            padding: 24, display: "block", transition: "border-color 0.15s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = color}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color }}>{title}</div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>{desc}</div>
          </Link>
        ))}
      </div>

      {/* Stack */}
      <div style={{ marginTop: 40, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, color: "var(--text2)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Tech Stack — Agents League 2026</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[
            { label: "LLM", value: "xAI Grok 3", note: "Azure OpenAI unavailable in Central India" },
            { label: "Work IQ", value: "Microsoft 365 Graph", note: "User context, emails, calendar" },
            { label: "Foundry IQ", value: "Grok Live Search", note: "Grounded evidence retrieval" },
          ].map(({ label, value, note }) => (
            <div key={label} style={{ background: "var(--bg3)", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 4 }}>{label}</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{value}</div>
              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>{note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
