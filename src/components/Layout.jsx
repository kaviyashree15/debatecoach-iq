import { Link, useLocation } from "react-router-dom";
import { DEMO_MODE } from "../services/grokAI.js";

const NAV = [
  { to: "/",         icon: "⚡", label: "Home" },
  { to: "/coach",    icon: "🎯", label: "Coach Me" },
  { to: "/battle",   icon: "⚔️",  label: "Battle" },
  { to: "/research", icon: "🔍", label: "Research" },
  { to: "/history",  icon: "📊", label: "History" },
];

export default function Layout({ children }) {
  const { pathname } = useLocation();
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: "var(--bg2)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "24px 0", position: "fixed", height: "100vh", zIndex: 10 }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 28px" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", letterSpacing: -0.5 }}>
            ⚡ DebateCoach<span style={{ color: "var(--accent)" }}>IQ</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>Azure Foundry + Grok</div>
          {DEMO_MODE && (
            <div style={{ marginTop: 8, padding: "3px 8px", background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 6, fontSize: 11, color: "#f87171" }}>
              Demo Mode
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {NAV.map(({ to, icon, label }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 20px",
                color: active ? "var(--text)" : "var(--text2)",
                background: active ? "rgba(124,110,230,0.12)" : "transparent",
                borderRight: active ? "3px solid var(--accent)" : "3px solid transparent",
                fontSize: 14, fontWeight: active ? 600 : 400, transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 16 }}>{icon}</span> {label}
              </Link>
            );
          })}
        </nav>

        {/* IQ badge */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 8 }}>IQ Layers Active</div>
          {["Work IQ ✓", "Foundry IQ ✓"].map((l) => (
            <div key={l} style={{ fontSize: 11, color: "var(--pro)", padding: "2px 0" }}>{l}</div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 220, flex: 1, padding: "32px", minHeight: "100vh", background: "var(--bg)" }}>
        {children}
      </main>
    </div>
  );
}
