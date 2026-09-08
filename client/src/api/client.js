const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "aikya_token";

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `Request failed: ${res.status}`);
    err.status = res.status;
    throw err;
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

  // Auth
  login: (username, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  me: () => request("/auth/me"),

  // Faculty self-service (timetable + free time)
  getFacultyTimetable: (id) => request(`/faculty/${id}/timetable`),
  updateFacultyTimetable: (id, timetable, onLeave) =>
    request(`/faculty/${id}/timetable`, { method: "PUT", body: JSON.stringify({ timetable, onLeave }) }),

  // Admin mutations (writes require admin token)
  create: (resource, data) =>
    request(`/${resource}`, { method: "POST", body: JSON.stringify(data) }),
  update: (resource, id, data) =>
    request(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (resource, id) => request(`/${resource}/${id}`, { method: "DELETE" }),
};