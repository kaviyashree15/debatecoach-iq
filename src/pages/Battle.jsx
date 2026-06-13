import { useState } from "react";
import { runBattleRound, scoreDebate } from "../agents/debateAgent.js";

export default function Battle() {
  const [topic, setTopic]       = useState("");
  const [userSide, setUserSide] = useState("pro");
  const [started, setStarted]   = useState(false);
  const [messages, setMessages] = useState([]);
  const [history, setHistory]   = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [round, setRound]       = useState(0);

  const aiSide = userSide === "pro" ? "con" : "pro";

  function startBattle() {
    if (!topic.trim()) return;
    setStarted(true); setMessages([]); setHistory([]); setRound(0); setScoreResult(null);
  }

  async function sendArgument() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim(); setInput("");
    const newRound = round + 1;
    setRound(newRound);

    const userEntry = { role: "user", content: userMsg, side: userSide, round: newRound };
    const updatedMessages = [...messages, userEntry];
    setMessages(updatedMessages);

    const newHistory = [...history, { role: "user", content: userMsg }];
    setHistory(newHistory);
    setLoading(true);

    try {
      const { result, assistantMessage } = await runBattleRound({ topic, side: aiSide, history: newHistory, accessToken: null });
      const aiText = result?.argument || "The opposition presents: " + (result?.keyPoints?.join(". ") || "No argument generated.");
      const aiEntry = { role: "assistant", content: aiText, side: aiSide, round: newRound, keyPoints: result?.keyPoints };
      setMessages([...updatedMessages, aiEntry]);
      setHistory([...newHistory, assistantMessage]);

      // Auto-score after 3 rounds
      if (newRound >= 3) {
        const proArgs = [...updatedMessages, aiEntry].filter((m) => m.side === "pro").map((m) => m.content);
        const conArgs = [...updatedMessages, aiEntry].filter((m) => m.side === "con").map((m) => m.content);
        const sc = await scoreDebate({ topic, proArguments: proArgs, conArguments: conArgs });
        setScoreResult(sc);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: "error", content: e.message }]);
    } finally {
      setLoading(false);
    }
  }

  if (!started) {
    return (
      <div style={{ maxWidth: 600 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>⚔️ Battle Mode</h1>
        <p style={{ color: "var(--text2)", marginBottom: 28, fontSize: 14 }}>Debate live against the AI. 3 rounds, then a judge scores you both.</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Debate Topic</label>
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter a debate topic..."
            style={{ width: "100%", padding: "12px 16px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 14, outline: "none" }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>I will argue</label>
          <div style={{ display: "flex", gap: 10 }}>
            {["pro", "con"].map((s) => (
              <button key={s} onClick={() => setUserSide(s)} style={{
                padding: "10px 32px", borderRadius: 8, fontWeight: 700, fontSize: 14,
                background: userSide === s ? (s === "pro" ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)") : "var(--bg2)",
                border: `2px solid ${userSide === s ? (s === "pro" ? "var(--pro)" : "var(--con)") : "var(--border)"}`,
                color: userSide === s ? (s === "pro" ? "var(--pro)" : "var(--con)") : "var(--text2)",
              }}>
                {s === "pro" ? "✓ FOR" : "✗ AGAINST"}
              </button>
            ))}
          </div>
        </div>

        <button onClick={startBattle} disabled={!topic.trim()} style={{ padding: "12px 32px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15 }}>
          Start Battle ⚔️
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>⚔️ Live Battle</h1>
          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>"{topic}"</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
          <span style={{ color: "var(--pro)" }}>You: {userSide.toUpperCase()}</span>
          <span style={{ color: "var(--con)" }}>AI: {aiSide.toUpperCase()}</span>
          <span style={{ color: "var(--text2)" }}>Round {round}/3</span>
        </div>
      </div>

      {/* Chat */}
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, minHeight: 300, maxHeight: 480, overflowY: "auto", marginBottom: 16 }}>
        {messages.length === 0 && (
          <div style={{ color: "var(--text2)", fontSize: 14, textAlign: "center", marginTop: 60 }}>
            Make your opening argument below to begin the battle!
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 16, display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 4 }}>
              {m.role === "user" ? `You (${userSide.toUpperCase()})` : m.role === "error" ? "Error" : `AI (${aiSide.toUpperCase()})`} · Round {m.round}
            </div>
            <div style={{
              maxWidth: "80%", padding: "12px 16px", borderRadius: 10, fontSize: 14, lineHeight: 1.6,
              background: m.role === "user" ? "rgba(124,110,230,0.15)" : m.role === "error" ? "rgba(248,113,113,0.1)" : "var(--bg3)",
              border: `1px solid ${m.role === "user" ? "rgba(124,110,230,0.3)" : m.role === "error" ? "rgba(248,113,113,0.3)" : "var(--border)"}`,
            }}>
              {m.content}
              {m.keyPoints?.length > 0 && (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                  {m.keyPoints.map((p, j) => <div key={j} style={{ fontSize: 12, color: "var(--text2)" }}>• {p}</div>)}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ color: "var(--text2)", fontSize: 13, padding: "8px 0" }}>AI is formulating response…</div>
        )}
      </div>

      {/* Score result */}
      {scoreResult && (
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 16 }}>🏆 Battle Result</div>
          <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "var(--pro)" }}>{scoreResult.proScore}</div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>PRO</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", color: "var(--text2)" }}>vs</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "var(--con)" }}>{scoreResult.conScore}</div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>CON</div>
            </div>
            <div style={{ flex: 1, paddingLeft: 16, borderLeft: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 600, color: "var(--accent)", marginBottom: 4 }}>
                Winner: {scoreResult.winner?.toUpperCase()}
                {scoreResult.winner === userSide ? " 🎉 That's you!" : ""}
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>{scoreResult.judgeSummary}</div>
            </div>
          </div>
          <button onClick={() => { setStarted(false); setMessages([]); setScoreResult(null); }}
            style={{ padding: "8px 20px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13, fontWeight: 600 }}>
            New Battle
          </button>
        </div>
      )}

      {/* Input */}
      {!scoreResult && round < 3 && (
        <div style={{ display: "flex", gap: 10 }}>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendArgument(); } }}
            placeholder={`Make your ${userSide.toUpperCase()} argument… (Enter to send)`}
            rows={3} style={{ flex: 1, padding: "12px 16px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit" }} />
          <button onClick={sendArgument} disabled={loading || !input.trim()}
            style={{ padding: "0 24px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
            Send
          </button>
        </div>
      )}
    </div>
  );
}
