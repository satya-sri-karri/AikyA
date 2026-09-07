const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getDepartments: () => request("/departments"),
  getFaculty: () => request("/faculty"),
  getPOIs: () => request("/poi"),
  getBuses: () => request("/buses"),
  getEvents: () => request("/events"),
  sendChatMessage: (message) =>
    request("/chat", { method: "POST", body: JSON.stringify({ message }) }),
  getAnalytics: () => request("/chat/analytics"),
};
