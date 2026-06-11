// Mock server in-memory. Hanya dipakai bila backend Express tidak aktif.
// Meniru bentuk response controller/service backend agar UI konsisten.

import {
  seedEvents,
  seedCategories,
  seedUser,
  seedAdmin
} from "../data/seed.js";

const KEY = "eventku_mock_db";

function load() {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      /* ignore */
    }
  }
  const db = {
    users: [
      { ...seedAdmin, password: "admin123" },
      { ...seedUser, password: "demo123" }
    ],
    events: structuredClone(seedEvents),
    categories: structuredClone(seedCategories),
    registrations: [],
    bookmarks: [],
    notifications: [
      {
        id: 1,
        user_id: seedUser.id,
        event_id: 1,
        message: "Pendaftaran AI Ethics Summit dibuka. Amankan kursimu!",
        is_read: 0,
        sent_at: "2026-10-01 09:00:00"
      }
    ],
    seq: { event: 100, category: 100, registration: 1, bookmark: 1 }
  };
  save(db);
  return db;
}
function save(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

function token() {
  return localStorage.getItem("eventku_token");
}
function currentUser() {
  // token mock = base64(JSON user)
  const t = token();
  if (!t) return null;
  try {
    return JSON.parse(atob(t.replace("mock.", "")));
  } catch {
    return null;
  }
}
function makeToken(user) {
  const { password, ...safe } = user;
  return "mock." + btoa(JSON.stringify(safe));
}
function delay(v) {
  return new Promise((r) => setTimeout(() => r(v), 220));
}
function enrich(db, e) {
  const cat = db.categories.find((c) => c.id === e.category_id);
  const admin = db.users.find((u) => u.id === e.admin_id);
  return {
    ...e,
    category_name: cat ? cat.name : e.category_name || null,
    admin_name: admin ? admin.name : e.admin_name || null
  };
}

/* ----------------------------- AUTH ----------------------------- */
export function register({ name, email, password }) {
  const db = load();
  if (!name || !email || !password) {
    return Promise.reject(new Error("Nama, email, dan password wajib diisi"));
  }
  if (db.users.some((u) => u.email === email)) {
    return Promise.reject(new Error("Email sudah digunakan"));
  }
  const user = {
    id: db.seq.event++,
    name,
    email,
    role: "mahasiswa",
    password
  };
  db.users.push(user);
  save(db);
  const { password: _p, ...data } = user;
  return delay({ message: "Registrasi berhasil", token: makeToken(user), data });
}

export function login({ email, password }) {
  const db = load();
  const user = db.users.find((u) => u.email === email);
  if (!user || user.password !== password) {
    return Promise.reject(new Error("Email atau password salah"));
  }
  const { password: _p, ...data } = user;
  return delay({ message: "Login berhasil", token: makeToken(user), data });
}

export function me() {
  const u = currentUser();
  if (!u) return Promise.reject(new Error("Token tidak ditemukan"));
  return delay({ data: u });
}

/* ----------------------------- EVENTS ---------------------------- */
export function listEvents() {
  const db = load();
  const rows = db.events.map((e) => enrich(db, e)).sort((a, b) =>
    a.start_time.localeCompare(b.start_time)
  );
  return delay(rows);
}
export function getEvent(id) {
  const db = load();
  const e = db.events.find((x) => x.id === Number(id));
  return delay(e ? enrich(db, e) : null);
}
export function createEvent(payload) {
  const db = load();
  const u = currentUser();
  const e = {
    id: ++db.seq.event,
    admin_id: payload.admin_id || (u ? u.id : 1),
    category_id: payload.category_id || null,
    title: payload.title,
    description: payload.description || null,
    location: payload.location || null,
    start_time: payload.start_time,
    end_time: payload.end_time,
    organizer: payload.organizer || null,
    status: payload.status || "upcoming",
    image: payload.image || null,
    attendees: 0,
    price: payload.price || 0
  };
  db.events.push(e);

  // Automatically create notifications for all students
  const students = db.users.filter((usr) => usr.role === "mahasiswa");
  students.forEach((student) => {
    db.notifications.push({
      id: ++db.seq.bookmark, // using a mock sequence number
      user_id: student.id,
      event_id: e.id,
      message: `Event baru ditambahkan: "${e.title}". Yuk daftar!`,
      is_read: 0,
      sent_at: new Date().toISOString().slice(0, 19).replace("T", " ")
    });
  });

  save(db);
  return delay(enrich(db, e));
}
export function updateEvent(id, payload) {
  const db = load();
  const e = db.events.find((x) => x.id === Number(id));
  if (!e) return Promise.reject(new Error("Event tidak ditemukan"));
  Object.assign(e, payload);
  save(db);
  return delay(enrich(db, e));
}
export function removeEvent(id) {
  const db = load();
  db.events = db.events.filter((x) => x.id !== Number(id));
  save(db);
  return delay({ message: "Event dihapus" });
}

/* --------------------------- CATEGORIES -------------------------- */
export function listCategories() {
  return delay(load().categories);
}
export function createCategory(payload) {
  const db = load();
  const c = { id: ++db.seq.category, name: payload.name, description: payload.description || null };
  db.categories.push(c);
  save(db);
  return delay(c);
}

/* -------------------------- REGISTRATIONS ------------------------ */
export function listRegistrations() {
  const db = load();
  const u = currentUser();
  const rows = db.registrations
    .filter((r) => (u ? r.user_id === u.id : true))
    .map((r) => ({ ...r, event: enrich(db, db.events.find((e) => e.id === r.event_id) || {}) }));
  return delay(rows);
}
export function createRegistration({ event_id }) {
  const db = load();
  const u = currentUser();
  const exists = db.registrations.find(
    (r) => r.event_id === Number(event_id) && r.user_id === (u ? u.id : 0)
  );
  if (exists) return Promise.reject(new Error("Kamu sudah terdaftar di event ini"));
  const r = {
    id: ++db.seq.registration,
    user_id: u ? u.id : 0,
    event_id: Number(event_id),
    status: "confirmed",
    registered_at: new Date().toISOString().slice(0, 19).replace("T", " ")
  };
  db.registrations.push(r);
  const ev = db.events.find((e) => e.id === Number(event_id));
  if (ev) ev.attendees = (ev.attendees || 0) + 1;
  save(db);
  return delay({ message: "Pendaftaran berhasil", data: r });
}
export function removeRegistration(id) {
  const db = load();
  db.registrations = db.registrations.filter((r) => r.id !== Number(id));
  save(db);
  return delay({ message: "Pendaftaran dibatalkan" });
}

/* ---------------------------- BOOKMARKS -------------------------- */
export function listBookmarks() {
  const db = load();
  const u = currentUser();
  const rows = db.bookmarks
    .filter((b) => (u ? b.user_id === u.id : true))
    .map((b) => ({ ...b, event: enrich(db, db.events.find((e) => e.id === b.event_id) || {}) }));
  return delay(rows);
}
export function createBookmark({ event_id }) {
  const db = load();
  const u = currentUser();
  const exists = db.bookmarks.find(
    (b) => b.event_id === Number(event_id) && b.user_id === (u ? u.id : 0)
  );
  if (exists) return delay({ message: "Sudah dibookmark", data: exists });
  const b = {
    id: ++db.seq.bookmark,
    user_id: u ? u.id : 0,
    event_id: Number(event_id),
    saved_at: new Date().toISOString().slice(0, 19).replace("T", " ")
  };
  db.bookmarks.push(b);
  save(db);
  return delay({ message: "Disimpan ke bookmark", data: b });
}
export function removeBookmark(id) {
  const db = load();
  db.bookmarks = db.bookmarks.filter((b) => b.id !== Number(id));
  save(db);
  return delay({ message: "Bookmark dihapus" });
}

/* -------------------------- NOTIFICATIONS ------------------------ */
export function listNotifications() {
  const db = load();
  const u = currentUser();
  // Enrich with event details so the notification list can show details
  const filtered = db.notifications.filter((n) => (u ? (u.role === "admin" ? true : n.user_id === u.id) : true));
  const enriched = filtered.map((n) => {
    const ev = db.events.find((e) => e.id === n.event_id);
    return {
      ...n,
      event_title: ev ? ev.title : null,
      user_name: db.users.find((usr) => usr.id === n.user_id)?.name || null
    };
  });
  return delay(enriched);
}

export function updateNotification(id, payload) {
  const db = load();
  const n = db.notifications.find((x) => x.id === Number(id));
  if (!n) return Promise.reject(new Error("Notifikasi tidak ditemukan"));

  const u = currentUser();
  if (u && u.role !== "admin" && Number(n.user_id) !== Number(u.id)) {
    return Promise.reject(new Error("Akses ditolak"));
  }

  if (u && u.role === "admin") {
    n.message = payload.message || n.message;
    n.is_read = payload.is_read ?? n.is_read;
  } else {
    n.is_read = payload.is_read ?? 1;
  }

  save(db);
  return delay(n);
}

export function removeNotification(id) {
  const db = load();
  db.notifications = db.notifications.filter((x) => x.id !== Number(id));
  save(db);
  return delay({ message: "Notifikasi dihapus" });
}

/* ----------------------------- USERS ----------------------------- */
export function listUsers() {
  const db = load();
  return delay(db.users.map(({ password, ...u }) => u));
}
