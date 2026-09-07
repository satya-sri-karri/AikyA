import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client.js";

let cache = {};
let inflight = {};

function loadCollection(key, fetcher, force) {
  if (cache[key] && !force) return Promise.resolve(cache[key]);
  if (inflight[key]) return inflight[key];
  inflight[key] = fetcher()
    .then((data) => {
      cache[key] = data || [];
      return cache[key];
    })
    .catch(() => {
      cache[key] = [];
      return cache[key];
    })
    .finally(() => {
      delete inflight[key];
    });
  return inflight[key];
}

const GETTERS = {
  faculty: () => api.getFaculty(),
  departments: () => api.getDepartments(),
  pois: () => api.getPOIs(),
  buses: () => api.getBuses(),
  events: () => api.getEvents(),
};

export function useUniverse(keys = Object.keys(GETTERS)) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(keys.length > 0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all(keys.map((k) => loadCollection(k, GETTERS[k]))).then((results) => {
      if (!mounted) return;
      const next = {};
      keys.forEach((k, i) => (next[k] = results[i]));
      setData(next);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join(",")]);

  const refresh = useCallback((k) => loadCollection(k, GETTERS[k], true), []);
  return { data, loading, refresh };
}

export function getCampusConfig() {
  return {
    canvasWidth: 1200,
    canvasHeight: 760,
    // Layout geometry that maps POI lat/lng into canvas coordinates.
    bounds: {
      minLat: 16.306,
      maxLat: 16.3084,
      minLng: 80.4356,
      maxLng: 80.4376,
    },
  };
}

// Map a POI's latitude/longitude onto the campus canvas.
export function projectPOI(poi, cfg) {
  const { minLat, maxLat, minLng, maxLng } = cfg.bounds;
  const lat = poi.latitude ?? (poi.lat ?? 0);
  const lng = poi.longitude ?? (poi.lng ?? 0);
  const x = ((lng - minLng) / (maxLng - minLng)) * cfg.canvasWidth;
  const y = ((maxLat - lat) / (maxLat - minLat)) * cfg.canvasHeight;
  return clampToCanvas(x, y, cfg);
}

function clampToCanvas(x, y, cfg) {
  return {
    x: Math.min(Math.max(x, 20), cfg.canvasWidth - 40),
    y: Math.min(Math.max(y, 20), cfg.canvasHeight - 40),
  };
}

// Inverse of projectPOI: canvas coordinate -> lat/lng (used for the map's Main Gate anchor).
export function unproject(x, y, cfg) {
  const { minLat, maxLat, minLng, maxLng } = cfg.bounds;
  const lng = minLng + (x / cfg.canvasWidth) * (maxLng - minLng);
  const lat = maxLat - (y / cfg.canvasHeight) * (maxLat - minLat);
  return { latitude: lat, longitude: lng };
}

// Haversine distance in meters between two {latitude, longitude} points.
export function distanceMeters(a, b) {
  if (!a || !b || a.latitude == null || b.latitude == null) return null;
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}