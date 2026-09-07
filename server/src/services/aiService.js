const OpenAI = require("openai");

// Base URL for the LLM provider. Defaults to the Groq + OpenAI-compatible
// endpoint, but can be overridden in .env (e.g. for a local Ollama server).
const BASE_URL = process.env.AI_BASE_URL || "https://api.groq.com/openai/v1";

// Friendly message returned to the frontend whenever the model cannot be
// reached. We never leak API keys or internal stack traces in this message.
const FALLBACK_MESSAGE =
  "Sorry, I'm unable to process your request right now. Please try again in a moment.";

// Groq exposes an OpenAI-compatible API, so the official openai SDK is used
// with Groq's base URL. The API key lives only in process.env (backend .env)
// and never leaves this service.
//
// We only construct the client once a key is present. Constructing with an
// empty key throws, which would prevent the server from booting; instead we
// lazily build it so /api/chat can return a friendly fallback when the key is
// missing. The provider is chosen purely from env vars, so switching providers
// (Groq / Ollama / xAI Grok / OpenRouter) needs no code changes.
let client = null;

function getClient() {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return null;
  if (!client) {
    client = new OpenAI({
      apiKey,
      baseURL: BASE_URL,
      timeout: 60000,
    });
  }
  return client;
}

function modelName() {
  return process.env.AI_MODEL || "qwen/qwen3.8-27b";
}

function buildSystemPrompt(context) {
  const data =
    (context || "").trim().length > 0
      ? context
      : "(No campus data matched this query.)";

  return `You are Campus AI, the official AI assistant for AIKYA — the digital twin of Aditya University, Surampalem (East Godavari, Andhra Pradesh).

The CAMPUS DATA section below was retrieved live from the Aditya University MongoDB database. It is the only authoritative source of information you have about this specific campus.

Grounding rules (follow strictly):
1. Answer campus questions using the retrieved campus data first. Prefer database information over your general knowledge; when they conflict, the database wins.
2. Never invent or guess campus locations, buildings, rooms, departments, faculty, timings, prices, menus, rules, bus routes, events, or availability. If a fact is not in the campus data, do not make it up.
3. If the requested information is not present in the campus data, explicitly say: "This information is not currently available." You may suggest a relevant department or office to contact only if that contact exists in the data.
4. Be concise and actionable: a few short lines, not long paragraphs. Use bullet points when it helps readability.
5. When a location is part of the answer, mention the building/block, floor, and room or cabin number whenever the data includes them.
6. Respect access restrictions and campus rules provided in the data. If a place has an access policy, answer based only on that policy.
7. If the user asks about a restricted location, explain the restriction using only the campus policy provided. Do not add your own judgments or assumptions.
8. Do not claim real-time or live information (open/closed status, "right now", wait times) unless the campus data explicitly provides it.
9. If the user's request is ambiguous or could reasonably match several records, ask one short clarifying question instead of guessing.
10. You may answer general (non-campus) questions briefly, but for anything campus-specific always rely on the retrieved data.
11. When introducing the campus or listing campus data, always call the institution "Aditya University, Surampalem" — never "CampusX" or any other placeholder name.

CAMPUS DATA:
${data}`;
}

// Sends the user's question together with the retrieved campus context to the
// LLM and returns the generated answer text. Throws on failure so the caller
// can map it to the friendly fallback. Never returns the API key or raw error
// data.
async function answerCampusQuestion({ question, context }) {
  const activeClient = getClient();
  if (!activeClient) {
    const err = new Error("AI_API_KEY is not configured on the server.");
    err.code = "AI_MISSING_API_KEY";
    throw err;
  }

  const response = await activeClient.chat.completions.create({
    model: modelName(),
    max_tokens: 400,
    temperature: 0.3,
    messages: [
      { role: "system", content: buildSystemPrompt(context) },
      { role: "user", content: question },
    ],
  });

  const answer = (response.choices?.[0]?.message?.content || "").trim();
  if (!answer) {
    const err = new Error("AI service returned an empty response.");
    err.code = "AI_EMPTY_RESPONSE";
    throw err;
  }

  return answer;
}

module.exports = { answerCampusQuestion, buildSystemPrompt, FALLBACK_MESSAGE };