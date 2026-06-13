export const GROK = {
  apiKey:  import.meta.env.VITE_GROQ_API_KEY,
  model:   import.meta.env.VITE_GROQ_MODEL || "llama-3.3-70b-versatile",
  baseUrl: "https://api.groq.com/openai/v1/chat/completions",
};

export const FOUNDRY = {
  endpoint: import.meta.env.VITE_FOUNDRY_ENDPOINT,
  apiKey:   import.meta.env.VITE_FOUNDRY_API_KEY,
  project:  "debatecoach",
  region:   "centralindia",
};

export const WORK_IQ = {
  clientId: import.meta.env.VITE_M365_CLIENT_ID,
  tenantId: import.meta.env.VITE_M365_TENANT_ID || "common",
  scopes:   ["User.Read", "Mail.Read", "Calendars.Read"],
};

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true" || !import.meta.env.VITE_GROQ_API_KEY;
