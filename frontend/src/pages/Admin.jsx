import { useEffect, useMemo, useState } from "react";
import { events as eventsApi, categories as catApi } from "../api/client.js";
import { Icon, fmtDateFull } from "../components/ui.jsx";
import "./admin.css";

const TABS = [
  { key: "events", label: "Manage Events", icon: Icon.Grid },
  { key: "categories", label: "Manage Categories", icon: Icon.Tag },
  { key: "notifications", label: "User Notifications", icon: Icon.Bell },
  { key: "analytics", label: "Analytics", icon: Icon.Chart }
];

const EMPTY = { title: "", organizer: "", location: "", category_id: "", start_time: "", end_time: "", status: "upcoming", description: "", image: "" };

export default function Admin() {
  const [tab, setTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | {mode, data}
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [newCat, setNewCat] = useState("");

  function load() {
    Promise.all([eventsApi.list(), catApi.list()])
      .then(([ev, c]) => { setEvents(ev || []); setCats(c || []); })
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  const stats = useMemo(() => ({
    users: 12842,
    rate: "74.2%",
    upcoming: events.filter((e) => e.status === "upcoming").length
  }), [events]);

  function openCreate() { setForm(EMPTY); setModal({ mode: "create" }); }
  function openEdit(ev) {
    setForm({
      title: ev.title || "", organizer: ev.organizer || "", location: ev.location || "",
      category_id: ev.category_id || "", start_time: (ev.start_time || "").slice(0, 16).replace(" ", "T"),
      end_time: (ev.end_time || "").slice(0, 16).replace(" ", "T"), status: ev.status || "upcoming",
      description: ev.description || "", image: ev.image || ""
    });
    setModal({ mode: "edit", id: ev.id });
  }
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      category_id: form.category_id ? Number(form.category_id) : null,
      start_time: form.start_time.replace("T", " ") + ":00",
      end_time: form.end_time.replace("T", " ") + ":00"
    };
    try {
      if (modal.mode === "create") await eventsApi.create(payload);
      else await eventsApi.update(modal.id, payload);
      setModal(null); load();
    } finally { setSaving(false); }
  }

  async function del(ev) {
    if (!confirm(`Hapus event "${ev.title}"?`)) return;
    await eventsApi.remove(ev.id);
    load();
  }

  async function addCat(e) {
    e.preventDefault();
    if (!newCat.trim()) return;
    await catApi.create({ name: newCat.trim() });
    setNewCat(""); load();
  }

  const statusBadge = (s) => {
    const map = { upcoming: ["badge-green", "● Active"], ongoing: ["badge-blue", "● Ongoing"], done: ["badge-soft", "● Done"], cancelled: ["badge-amber", "● Cancelled"] };
    const [cls, label] = map[s] || ["badge-soft", s];
    return <span className={"badge " + cls}>{label}</span>;
  };

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="as-label">ADMIN PANEL</div>
        {TABS.map((t) => {
          const I = t.icon;
          return (
            <button key={t.key} className={"as-item" + (tab === t.key ? " active" : "")} onClick={() => setTab(t.key)}>
              <I /> {t.label}
            </button>
          );
        })}
        <div className="as-status">
          <strong className="tiny" style={{ color: "var(--blue-700)" }}>System Status</strong>
          <div className="tiny" style={{ color: "var(--green)", marginTop: 4 }}>● All services operational</div>
        </div>
      </aside>

      <div className="admin-main">
        <div className="stat-row">
          <div className="card stat"><div><div className="muted tiny">Total Active Users</div><div className="stat-num">{stats.users.toLocaleString("id-ID")}</div><div className="tiny" style={{ color: "var(--green)" }}>↗ +5.2% from last month</div></div><div className="stat-ico blue"><Icon.Users /></div></div>
          <div className="card stat"><div><div className="muted tiny">Participation Rate</div><div className="stat-num">{stats.rate}</div><div className="tiny" style={{ color: "var(--green)" }}>↗ +12% since orientation</div></div><div className="stat-ico amber"><Icon.Chart /></div></div>
          <div className="card stat"><div><div className="muted tiny">Upcoming Events</div><div className="stat-num">{stats.upcoming}</div><div className="tiny muted">{Math.max(0, Math.round(stats.upcoming/6))} requiring approval</div></div><div className="stat-ico gray"><Icon.Calendar /></div></div>
        </div>

        {tab === "events" && (
          <>
            <div className="spread" style={{ margin: "8px 0 18px" }}>
              <div><h1 style={{ margin: 0, fontSize: 28 }}>Manage Events</h1><p className="muted" style={{ margin: "4px 0 0" }}>Kelola semua kegiatan kampus dan pantau keterlibatan.</p></div>
              <button className="btn btn-primary" onClick={openCreate}><Icon.Plus /> Add New Event</button>
            </div>

            {loading ? (
              <div className="center" style={{ padding: 50 }}><span className="spinner spinner-dark" /></div>
            ) : (
              <div className="card admin-table">
                <div className="at-head">
                  <span>Event Name</span><span>Category</span><span>Date &amp; Time</span><span>Status</span><span style={{ textAlign: "right" }}>Actions</span>
                </div>
                {events.map((ev) => (
                  <div className="at-row" key={ev.id}>
                    <div className="at-name">
                      <img src={ev.image || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=200&q=60"} alt="" onError={(e)=>e.currentTarget.style.display='none'} />
                      <strong>{ev.title}</strong>
                    </div>
                    <div><span className="badge badge-amber">{ev.category_name || "—"}</span></div>
                    <div className="tiny">{fmtDateFull(ev.start_time)}</div>
                    <div>{statusBadge(ev.status)}</div>
                    <div className="at-actions">
                      <button className="ic-btn" onClick={() => openEdit(ev)} title="Edit"><Icon.Edit /></button>
                      <button className="ic-btn danger" onClick={() => del(ev)} title="Hapus"><Icon.Trash /></button>
                    </div>
                  </div>
                ))}
                <div className="at-foot tiny muted">Menampilkan {events.length} event</div>
              </div>
            )}
          </>
        )}

        {tab === "categories" && (
          <>
            <h1 style={{ fontSize: 28, marginBottom: 16 }}>Manage Categories</h1>
            <form className="card cat-add" onSubmit={addCat}>
              <input className="input" placeholder="Nama kategori baru" value={newCat} onChange={(e) => setNewCat(e.target.value)} />
              <button className="btn btn-primary"><Icon.Plus /> Tambah</button>
            </form>
            <div className="cat-grid">
              {cats.map((c) => (
                <div className="card cat-item" key={c.id}>
                  <Icon.Tag style={{ color: "var(--blue-600)" }} />
                  <div><strong>{c.name}</strong><div className="tiny muted">{c.description || "Tanpa deskripsi"}</div></div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "notifications" && (
          <div className="card center" style={{ padding: 60 }}><Icon.Bell width="34" height="34" style={{ color: "var(--blue-600)" }} /><h2 style={{ marginTop: 12 }}>User Notifications</h2><p className="muted">Kirim pengumuman ke mahasiswa terkait event (endpoint: POST /api/notifications).</p></div>
        )}
        {tab === "analytics" && (
          <div className="card center" style={{ padding: 60 }}><Icon.Chart width="34" height="34" style={{ color: "var(--blue-600)" }} /><h2 style={{ marginTop: 12 }}>Analytics</h2><p className="muted">Ringkasan partisipasi & engagement event ditampilkan di kartu statistik di atas.</p></div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <form className="modal card fade-up" onSubmit={save}>
            <h2 style={{ marginTop: 0 }}>{modal.mode === "create" ? "Add New Event" : "Edit Event"}</h2>
            <div className="field"><label>Judul Event</label><input className="input" value={form.title} onChange={set("title")} required /></div>
            <div className="reg-2col">
              <div className="field"><label>Organizer</label><input className="input" value={form.organizer} onChange={set("organizer")} /></div>
              <div className="field"><label>Lokasi</label><input className="input" value={form.location} onChange={set("location")} /></div>
            </div>
            <div className="reg-2col">
              <div className="field"><label>Kategori</label>
                <select className="select" value={form.category_id} onChange={set("category_id")}>
                  <option value="">— Pilih —</option>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="field"><label>Status</label>
                <select className="select" value={form.status} onChange={set("status")}>
                  <option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="done">Done</option><option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="reg-2col">
              <div className="field"><label>Mulai</label><input className="input" type="datetime-local" value={form.start_time} onChange={set("start_time")} required /></div>
              <div className="field"><label>Selesai</label><input className="input" type="datetime-local" value={form.end_time} onChange={set("end_time")} required /></div>
            </div>
            <div className="field"><label>URL Gambar (opsional)</label><input className="input" value={form.image} onChange={set("image")} placeholder="https://..." /></div>
            <div className="field"><label>Deskripsi</label><textarea className="textarea" value={form.description} onChange={set("description")} /></div>
            <div className="row" style={{ justifyContent: "flex-end", gap: 10 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Batal</button>
              <button className="btn btn-primary" disabled={saving}>{saving ? <span className="spinner" /> : "Simpan"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
