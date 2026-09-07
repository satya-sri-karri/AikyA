# CampusX — AI-Powered Smart Campus Assistant

Your Campus. Mapped. Connected. Intelligent.

## What's in this repo

```
campusx/
├── server/     Express + MongoDB backend, xAI Grok API-powered chat assistant
└── client/     React + Vite frontend
```

## Prerequisites

- Node.js 18+
- A MongoDB connection string — either:
  - Local MongoDB (`mongodb://localhost:27017/campusx`), or
  - Free MongoDB Atlas cluster (recommended — no local install needed): https://www.mongodb.com/cloud/atlas/register
- A Groq API key (free, used for the chat assistant): https://console.groq.com

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
# edit .env and fill in MONGODB_URI and AI_API_KEY (get it at https://console.groq.com)
npm run seed     # loads demo campus data into your database
npm run dev      # starts the server on http://localhost:5000
```

Verify it's running: open http://localhost:5000/api/health — should return `{"status":"ok"}`.

## 2. Frontend setup

Open a second terminal:

```bash
cd client
npm install
npm run dev      # starts the app on http://localhost:5173
```

Open http://localhost:5173 in your browser.

## 3. Replacing demo data with your real college data

Edit `server/src/seed/seed.js` — every block, faculty member, shop, hostel, bus route,
and event is a plain JS object in there. Update the values, re-run `npm run seed`,
and the whole app (map, directories, AI assistant) reflects the new data immediately —
nothing is hardcoded in the frontend.

## 4. How the AI assistant works

The chat pipeline lives in `server/src/services/`. `campusDataService.js` does intent /
query understanding and retrieves the relevant records from MongoDB, then
`aiService.js` sends that context to the Groq API (a free Qwen model) along with the
student's question and a grounding-aware system prompt. This intent-based retrieval
keeps the prompt focused on the relevant campus data. If the dataset grows much
larger, look into MongoDB Atlas Vector Search for proper retrieval instead of the
current keyword-based intent matching.

## 5. What's built vs. what's roadmap

**Built (Day 1–2 MVP):**
- Campus map with clickable pins (departments, hostels, shops, library, grounds)
- Faculty & department directories
- Canteen/shop menus with live open/closed + item availability flags
- Hostel occupancy, bus routes & timings, events
- AI chat assistant grounded in real campus data, with escalation flagging
- Full CRUD API on every collection (ready for an admin panel)

**Roadmap (mention in the pitch, don't try to build under time pressure):**
- Live GPS bus tracking and turn-by-turn navigation (Google Maps Directions API)
- Role-based auth (student/faculty/staff/admin/security) with JWT
- Faculty appointment booking workflow
- Vector search once the knowledge base grows
- QR codes, AR navigation, IoT sensor integration

## 6. Admin panel

An admin panel lives at http://localhost:5173/admin (link in the sidebar). It lets
you add, edit and delete records for every collection (blocks & places, departments,
faculty, buses, events) with no code changes.

- **Credentials:** set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `server/.env`
  (there are no defaults, so change them and restart the server).
- **How it works:** the admin signs in and receives a JWT. The token is stored in
  the browser and sent as a `Bearer` header. Writes (`POST`, `PUT`, `DELETE`) are
  protected server-side by `requireAuth`, while all reads stay public — so the
  public app, map and chat keep working for visitors.
- **Security:** `JWT_SECRET` signs the tokens; set it to a long random string.
  The auth middleware is `server/src/middleware/auth.js`, the routes are
  `server/src/routes/auth.js`, and the UI is `client/src/pages/Admin.jsx`.
