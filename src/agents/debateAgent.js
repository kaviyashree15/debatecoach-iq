/**
 * debateAgent.js — Main Reasoning Agent
 * Wires together: Work IQ → Foundry IQ → Grok AI
 */

import { complete, continueConversation } from "../services/grokAI.js";
import { retrieveEvidence, formatCitationsForPrompt } from "../services/foundryIQ.js";
import { getWorkContext } from "../services/workIQ.js";

const COACH_PROMPT = `You are DebateCoach IQ, an expert AI debate coach built on Azure AI Foundry.
Analyse the user's argument and give structured coaching feedback.
Always respond with valid JSON:
{
  "score": number (0-100),
  "strengths": string[],
  "improvements": string[],
  "tip": string,
  "citationsUsed": string[],
  "overallFeedback": string
}`;

const COUNTER_PROMPT = `You are DebateCoach IQ. Generate a strong, evidence-backed counter-argument.
Respond with valid JSON:
{
  "counterArgument": string,
  "keyPoints": string[],
  "evidenceRefs": string[],
  "strengthRating": number (0-100)
}`;

const BATTLE_PROMPT = `You are moderating a live debate battle on Azure AI Foundry DebateCoach IQ.
Generate the next argument for the specified side using grounded evidence.
Respond with valid JSON:
{
  "argument": string,
  "keyPoints": string[],
  "rebuttal": string,
  "citationsUsed": string[]
}`;

const SCORE_PROMPT = `You are a professional debate judge on DebateCoach IQ (Azure AI Foundry).
Score the full debate on: Clarity (25%), Evidence (25%), Rebuttal (25%), Delivery (25%).
Respond with valid JSON:
{
  "proScore": number,
  "conScore": number,
  "winner": "pro" | "con" | "tie",
  "breakdown": { "clarity": number, "evidence": number, "rebuttal": number, "delivery": number },
  "judgeSummary": string
}`;

async function getFullContext(topic, accessToken) {
  const [{ foundryContext: workCtx }, { citations }] = await Promise.all([
    getWorkContext({ accessToken, topic }),
    retrieveEvidence(topic),
  ]);
  const evidenceCtx = formatCitationsForPrompt(citations);
  return { foundryContext: `${workCtx}\n\n=== FOUNDRY IQ EVIDENCE ===\n${evidenceCtx}`, citations };
}

export async function analyseArgument({ topic, argument, side, accessToken }) {
  const { foundryContext, citations } = await getFullContext(topic, accessToken);
  const { parsed } = await complete({
    systemPrompt: COACH_PROMPT,
    userPrompt: `Topic: "${topic}"\nSide: ${side.toUpperCase()}\nArgument:\n${argument}`,
    foundryContext, temperature: 0.6, maxTokens: 1200, demoKey: "coaching",
  });
  return { result: parsed, citations };
}

export async function generateCounter({ topic, argumentToCounter, targetSide }) {
  const { foundryContext, citations } = await getFullContext(topic, null);
  const { parsed } = await complete({
    systemPrompt: COUNTER_PROMPT,
    userPrompt: `Topic: "${topic}"\nArgue for: ${targetSide.toUpperCase()}\nCounter this:\n${argumentToCounter}`,
    foundryContext, temperature: 0.7, maxTokens: 900, demoKey: "counter",
  });
  return { result: parsed, citations };
}

export async function runBattleRound({ topic, side, history, accessToken }) {
  const { foundryContext } = await getFullContext(topic, accessToken);
  const { parsed, assistantMessage } = await continueConversation({
    systemPrompt: BATTLE_PROMPT,
    history,
    newUserMessage: `Generate the next ${side.toUpperCase()} argument for: "${topic}"`,
    foundryContext, temperature: 0.8, maxTokens: 800, demoKey: "battle",
  });
  return { result: parsed, assistantMessage };
}

export async function scoreDebate({ topic, proArguments, conArguments }) {
  const { parsed } = await complete({
    systemPrompt: SCORE_PROMPT,
    userPrompt: `Topic: "${topic}"\n\nPRO:\n${proArguments.map((a, i) => `${i + 1}. ${a}`).join("\n")}\n\nCON:\n${conArguments.map((a, i) => `${i + 1}. ${a}`).join("\n")}`,
    temperature: 0.4, maxTokens: 800, demoKey: "score",
  });
  return parsed;
}
