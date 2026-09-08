import { MapPin, Clock, Navigation, CalendarDays, GraduationCap } from "lucide-react";
import { formatPrice } from "./ui.jsx";

/* Turns an AI question into an actionable entity card using the *real*
   campus collections. Returns null when nothing matches confidently —
   the plain text answer is then shown instead. Keeps every card honest. */

function includesAll(q, words) {
  return words.every((w) => q.includes(w));
}

function normalize(s) {
  return (s || "").replace(/\s+/g, " ").trim().toLowerCase();
}

export function buildResult(query, data) {
  const q = " " + normalize(query) + " ";
  const pois = data.pois || [];
  const faculty = data.faculty || [];
  const buses = data.buses || [];
  const events = data.events || [];

  /* 1) Direct name mentions (faculty, POIs, events, routes). */
  const prof = faculty.find((f) => q.includes(normalize(f.name).slice(0, 12)));
  if (prof) return { kind: "faculty", item: prof };

  const poi =
    pois.find((p) => normalize(p.name) && q.includes(normalize(p.name).slice(0, 10))) ||
    pois.find((p) => p.block && normalize(p.block).length > 3 && q.includes(normalize(p.block).slice(0, 10)));

  const event =
    events.find((e) => q.includes(normalize(e.title).slice(0, 14))) ||
    (/(event|today|happening|upcoming)/i.test(q)
      ? events.filter((e) => (e.date || "").startsWith(new Date().toISOString().slice(0, 10)))[0]
      : undefined);

  const route = buses.find((b) => q.includes(normalize("route " + b.routeNumber)));

  /* 2) Intent-based picks. */
  if (/(food|eat|lunch|breakfast|dinner|hungry|cafe|canteen|snack|coffee|dosa|idly|pizza|tea)/i.test(q)) {
    const food = pois.find((p) => p.type === "shop" && p.isOpenNow) || pois.find((p) => p.type === "shop");
    if (food) return { kind: "food", item: food };
  }
  if (/(bus|route|transport|shuttle)/i.test(q)) {
    if (route) return { kind: "bus", item: route };
    if (buses[0]) return { kind: "bus", item: buses[0] };
  }
  if (/(library|book|reading)/i.test(q)) {
    const lib = pois.find((p) => p.type === "library");
    if (lib) return { kind: "location", item: lib };
  }
  if (/(hostel|room|stay|warden|hostel|dorm)/i.test(q)) {
    const hostel = pois.find((p) => p.type === "hostel");
    if (hostel) return { kind: "hostel", item: hostel };
  }
  if (/(faculty|professor|prof|teacher|staff|lecturer)/i.test(q) && faculty[0]) {
    return { kind: "faculty", item: faculty[0] };
  }
  if (poi) {
    return { kind: poi.type === "shop" ? "food" : poi.type === "hostel" ? "hostel" : "location", item: poi };
  }
  if (event) return { kind: "event", item: event };

  return null;
}

const TYPE_ICON = {
  block: "🏢", library: "📚", shop: "🍽️", hostel: "🏠", ground: "🌳", office: "🏛️", service: "🩺",
};

const TYPE_LABEL = {
  block: "Building", library: "Library", shop: "Food outlet", hostel: "Hostel", ground: "Grounds",
  office: "Office", service: "Service",
};

export default function ResultCard({ kind, item, onNavigate, compact }) {
  const body = (
    <>
      {kind === "faculty" && (
        <>
          <div className="res-overline">Faculty · {item.departmentName}</div>
          <div className="res-title">{item.name}</div>
          <div className="res-meta">
            <span><GraduationCap size={13} /> {item.designation}</span>
            <span><MapPin size={13} /> {item.cabin} · {item.block}, {item.floor}</span>
            <span><Clock size={13} /> {item.onLeave ? "On leave today" : (item.availableSlots || []).slice(0, 2).join(" · ") || "Available"}</span>
          </div>
          <div className="res-meta">
            <span className="badge badge-transparent" style={{ margin: 0 }}>{item.onLeave ? "On leave" : "Available"}</span>
          </div>
        </>
      )}

      {kind === "food" && (
        <>
          <div className="res-overline">Food · {item.block || "Campus"}</div>
          <div className="res-title">{item.name}</div>
          <div className="res-meta">
            <span className="badge badge-transparent" style={{ margin: 0 }}>{item.isOpenNow ? "Open now" : "Closed now"}</span>
            <span><Clock size={13} /> {item.openHours}</span>
          </div>
          <div className="res-meta">
            {(item.items || []).slice(0, 3).map((it) => (
              <span key={it.name}>
                {it.name} <span className="res-price">{formatPrice(it.price)}</span>
              </span>
            ))}
          </div>
        </>
      )}

      {kind === "location" && (
        <>
          <div className="res-overline">{TYPE_LABEL[item.type] || "Location"} · {item.block || "Campus"}</div>
          <div className="res-title">{item.name}</div>
          {item.floor && <div className="res-meta"><span><MapPin size={13} /> {item.block} · {item.floor}</span></div>}
          {item.openHours && <div className="res-meta"><span><Clock size={13} /> {item.openHours}</span></div>}
          {item.description && <div className="res-meta"><span>{item.description}</span></div>}
        </>
      )}

      {kind === "hostel" && (
        <>
          <div className="res-overline">Hostel · {item.hostelType === "girls" ? "Girls" : "Boys"} residence</div>
          <div className="res-title">{item.name}</div>
          <div className="res-meta">
            <span><MapPin size={13} /> {item.block}</span>
            <span>🛏️ {item.vacantRooms} vacant of {item.totalRooms}</span>
            <span>🛡️ {item.warden}</span>
          </div>
        </>
      )}

      {kind === "bus" && (
        <>
          <div className="res-overline">Transit · Route {item.routeNumber}</div>
          <div className="res-title">{item.routeDescription}</div>
          <div className="res-meta">
            <span className="badge badge-transparent" style={{ margin: 0 }}>{item.status || "On route"}</span>
            {item.departureTime && (
              <span><Clock size={13} /> Departs {item.departureTime} · Returns {item.returnTime}</span>
            )}
            {item.busType && (
              <span>{item.busType}{item.ground ? ` · ${item.ground}` : ""}</span>
            )}
          </div>
          <div className="res-meta">
            {(item.stops || []).slice(0, 4).map((s) => (
              <span key={s.name}>• {s.name}</span>
            ))}
          </div>
        </>
      )}

      {kind === "event" && (
        <>
          <div className="res-overline">Event · {item.date}</div>
          <div className="res-title">{item.title}</div>
          <div className="res-meta">
            <span><CalendarDays size={13} /> {item.startTime}–{item.endTime}</span>
            <span><MapPin size={13} /> {item.venue}</span>
            <span>By {item.organizer}</span>
          </div>
        </>
      )}
    </>
  );

  const icon =
    kind === "faculty" ? "👨‍🏫" :
    kind === "food" ? "🍽️" :
    kind === "bus" ? "🚌" :
    kind === "event" ? "📅" :
    kind === "hostel" ? "🏠" :
    TYPE_ICON[item?.type] || "📍";

  return (
    <div className="result-card">
      <span className="res-ic">{icon}</span>
      <div className="res-body">
        {body}
        <div className="res-actions">
          {kind !== "bus" && kind !== "event" && (
            <button className="btn btn-primary" onClick={() => onNavigate?.(item)}>
              <Navigation size={13} /> Navigate
            </button>
          )}
          <button className="btn btn-soft" onClick={() => onNavigate?.(item, "info")}>
            View on map
          </button>
        </div>
      </div>
    </div>
  );
}