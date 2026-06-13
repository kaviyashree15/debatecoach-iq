/**
 * workIQ.js — Microsoft Work IQ
 * Pulls M365 context via Graph API and injects it as foundryContext into Grok completions.
 * This is the primary Microsoft IQ compliance layer for the hackathon.
 */

import { DEMO_MODE } from "./config.js";

const GRAPH = "https://graph.microsoft.com/v1.0";

const DEMO_CTX = {
  userProfile: { name: "Kaviya Shree R.P", title: "Student", department: "Engineering", location: "Central India" },
  recentTopics: ["AI in Education", "Climate Policy", "Digital India Initiative", "Tech Ethics"],
  upcomingEvents: [{ title: "Inter-college Debate Competition", start: new Date(Date.now() + 86400000 * 2).toISOString() }],
  foundryContext: "=== Microsoft Work IQ (M365 Graph) ===\nUser: Kaviya Shree R.P | Role: Student | Dept: Engineering\nRecent topics: AI in Education, Climate Policy, Digital India\nUpcoming: Inter-college Debate Competition\n=== End Work IQ ===",
};

async function graphGet(path, token) {
  try {
    const res = await fetch(`${GRAPH}${path}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function getWorkContext({ accessToken, topic = "" }) {
  if (DEMO_MODE || !accessToken) return DEMO_CTX;

  const [profileData, mailData, calData] = await Promise.all([
    graphGet("/me?$select=displayName,jobTitle,department,officeLocation", accessToken),
    graphGet("/me/messages?$top=8&$select=subject&$orderby=receivedDateTime desc", accessToken),
    graphGet(`/me/calendarView?startDateTime=${new Date().toISOString()}&endDateTime=${new Date(Date.now() + 7 * 86400000).toISOString()}&$top=5&$select=subject,start`, accessToken),
  ]);

  const userProfile = profileData ? { name: profileData.displayName, title: profileData.jobTitle || "Student", department: profileData.department || "N/A", location: profileData.officeLocation || "India" } : null;
  const recentTopics = mailData?.value?.map((m) => m.subject).filter(Boolean) || [];
  const upcomingEvents = calData?.value?.map((e) => ({ title: e.subject, start: e.start?.dateTime })) || [];

  const lines = ["=== Microsoft Work IQ (M365 Graph API) ===", `Azure Foundry Project: debatecoach`];
  if (userProfile) lines.push(`User: ${userProfile.name} | Role: ${userProfile.title} | Dept: ${userProfile.department}`);
  if (recentTopics.length) { lines.push("\nRecent email topics:"); recentTopics.slice(0, 4).forEach((t) => lines.push(`  • ${t}`)); }
  if (upcomingEvents.length) { lines.push("\nUpcoming events:"); upcomingEvents.forEach((e) => lines.push(`  • ${e.title}`)); }
  if (topic) lines.push(`\nCurrent debate topic: "${topic}"\nPersonalise coaching using the above work context.`);
  lines.push("=== End Work IQ ===");

  return { userProfile, recentTopics, upcomingEvents, foundryContext: lines.join("\n") };
}

const KEY = "debatecoach_iq_history";
export function getUserDebateHistory(userId = "default") {
  try { return JSON.parse(localStorage.getItem(`${KEY}_${userId}`) || "[]"); } catch { return []; }
}
export function saveDebateHistory(userId = "default", entry) {
  try {
    const h = getUserDebateHistory(userId);
    h.unshift({ ...entry, savedAt: new Date().toISOString() });
    localStorage.setItem(`${KEY}_${userId}`, JSON.stringify(h.slice(0, 30)));
  } catch { }
}
