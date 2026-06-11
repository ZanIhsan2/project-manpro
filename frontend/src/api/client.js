// API client untuk frontend eventku.
//
// Mengikuti bentuk response backend Express yang sudah ada:
//   - auth:          { message, token, data: user }
//   - list/detail:   data array / object langsung (event, category, dst.)
//
// Jika backend TIDAK aktif (fetch gagal / network error), client otomatis
// jatuh ke MODE MOCK in-memory supaya seluruh UI tetap bisa dipakai untuk
// demo. Indikator mode ditampilkan di navbar.

import * as mock from "./mockServer.js";

const BASE = import.meta.env.VITE_API_BASE_URL || "/api";

let useMock = false;
const listeners = new Set();
export function onModeChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function setMock(v) {
  if (useMock !== v) {
    useMock = v;
    listeners.forEach((fn) => fn(useMock));
  }
}
export function isMockMode() {
  return useMock;
}

function token() {
  return localStorage.getItem("eventku_token");
}

async function real(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  const isFormData = body instanceof FormData;
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (auth && token()) headers.Authorization = `Bearer ${token()}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const err = new Error(json.message || `Request gagal (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return json;
}

// Coba backend dulu; kalau network error -> mock. Kalau backend menjawab
// dengan error bisnis (4xx/5xx) tetap dilempar supaya validasi terasa nyata.
async function request(path, opts = {}, mockFn) {
  if (useMock) return mockFn();
  try {
    return await real(path, opts);
  } catch (e) {
    const networkDown =
      e instanceof TypeError || // fetch gagal total
      e.message === "Failed to fetch" ||
      e.name === "TypeError";
    if (networkDown && mockFn) {
      setMock(true);
      return mockFn();
    }
    throw e;
  }
}

function unwrapData(response) {
  return response?.data ?? response;
}

/* ----------------------------- AUTH ----------------------------- */
export const auth = {
  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload }, () =>
      mock.register(payload)
    ),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: payload }, () =>
      mock.login(payload)
    ),
  me: () => request("/users/me", { auth: true }, () => mock.me())
};

function toFormData(payload) {
  const fd = new FormData();
  Object.keys(payload).forEach((key) => {
    if (key === "imageFile") {
      if (payload[key]) {
        fd.append("image", payload[key]);
      }
    } else if (payload[key] !== undefined && payload[key] !== null) {
      fd.append(key, payload[key]);
    }
  });
  return fd;
}

/* ----------------------------- EVENTS ----------------------------- */
export const events = {
  list: () => request("/events", {}, () => mock.listEvents()).then(unwrapData),
  get: (id) => request(`/events/${id}`, {}, () => mock.getEvent(id)).then(unwrapData),
  create: (payload) =>
    request("/events", { method: "POST", body: toFormData(payload), auth: true }, () =>
      mock.createEvent(payload)
    ).then(unwrapData),
  update: (id, payload) =>
    request(`/events/${id}`, { method: "PUT", body: toFormData(payload), auth: true }, () =>
      mock.updateEvent(id, payload)
    ).then(unwrapData),
  remove: (id) =>
    request(`/events/${id}`, { method: "DELETE", auth: true }, () =>
      mock.removeEvent(id)
    )
};

/* --------------------------- CATEGORIES --------------------------- */
export const categories = {
  list: () => request("/categories", {}, () => mock.listCategories()).then(unwrapData),
  create: (payload) =>
    request("/categories", { method: "POST", body: payload, auth: true }, () =>
      mock.createCategory(payload)
    ).then(unwrapData)
};

/* -------------------------- REGISTRATIONS ------------------------- */
export const registrations = {
  list: () => request("/registrations", { auth: true }, () => mock.listRegistrations()).then(unwrapData),
  create: (payload) =>
    request("/registrations", { method: "POST", body: payload, auth: true }, () =>
      mock.createRegistration(payload)
    ).then(unwrapData),
  remove: (id) =>
    request(`/registrations/${id}`, { method: "DELETE", auth: true }, () =>
      mock.removeRegistration(id)
    )
};

/* ---------------------------- BOOKMARKS --------------------------- */
export const bookmarks = {
  list: () => request("/bookmarks", { auth: true }, () => mock.listBookmarks()).then(unwrapData),
  create: (payload) =>
    request("/bookmarks", { method: "POST", body: payload, auth: true }, () =>
      mock.createBookmark(payload)
    ).then(unwrapData),
  remove: (id) =>
    request(`/bookmarks/${id}`, { method: "DELETE", auth: true }, () =>
      mock.removeBookmark(id)
    )
};

/* -------------------------- NOTIFICATIONS ------------------------- */
export const notifications = {
  list: () => request("/notifications", { auth: true }, () => mock.listNotifications()).then(unwrapData),
  update: (id, payload) => request(`/notifications/${id}`, { method: "PUT", body: payload, auth: true }, () => mock.updateNotification(id, payload)).then(unwrapData),
  remove: (id) => request(`/notifications/${id}`, { method: "DELETE", auth: true }, () => mock.removeNotification(id))
};

/* ----------------------------- USERS ------------------------------ */
export const users = {
  list: () => request("/users", { auth: true }, () => mock.listUsers()).then(unwrapData)
};
