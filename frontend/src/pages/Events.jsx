import { useEffect, useMemo, useState } from "react";
import { events as eventsApi, categories as catApi, bookmarks as bmApi } from "../api/client.js";
import { EventCard } from "../components/shared.jsx";
import { Icon, parseDate } from "../components/ui.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./events.css";

const DATE_OPTS = [
  { key: "all", label: "All Dates" },
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "Next Month" }
];

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [cats, setCats] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [dateF, setDateF] = useState("all");
  const [catF, setCatF] = useState("All");
  const [locF, setLocF] = useState("All Locations");

  function loadBookmarks() {
    if (user) bmApi.list().then((b) => setBookmarks(b || [])).catch(() => {});
  }
  useEffect(() => {
    Promise.all([eventsApi.list(), catApi.list()])
      .then(([ev, c]) => { setEvents(ev || []); setCats(c || []); })
      .finally(() => setLoading(false));
    loadBookmarks();
  }, [user]);

  const locations = useMemo(
    () => ["All Locations", ...Array.from(new Set(events.map((e) => e.location).filter(Boolean)))],
    [events]
  );

  const bmIds = new Set(bookmarks.map((b) => b.event_id));

  async function toggleBookmark(ev) {
    if (!user) { window.location.href = "/login"; return; }
    const existing = bookmarks.find((b) => b.event_id === ev.id);
    if (existing) {
      await bmApi.remove(existing.id);
    } else {
      await bmApi.create({ event_id: ev.id });
    }
    loadBookmarks();
  }

  const filtered = events.filter((e) => {
    if (q && !e.title.toLowerCase().includes(q.toLowerCase()) && !(e.organizer || "").toLowerCase().includes(q.toLowerCase())) return false;
    if (catF !== "All" && e.category_name !== catF) return false;
    if (locF !== "All Locations" && e.location !== locF) return false;
    if (dateF !== "all") {
      const d = parseDate(e.start_time);
      if (!d) return false;
      const now = new Date();
      const diff = (d - now) / 86400000;
      if (dateF === "today" && d.toDateString() !== now.toDateString()) return false;
      if (dateF === "week" && (diff < 0 || diff > 7)) return false;
      if (dateF === "month" && (diff < 0 || diff > 31)) return false;
    }
    return true;
  });

  return (
    <div className="container events-page">
      <h1 className="events-title">Explore Campus Events</h1>
      <div className="big-search">
        <Icon.Search />
        <input placeholder="Search for events, organizations, or keywords..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="events-layout">
        <aside className="filters card">
          <div className="filter-group">
            <h4><Icon.Calendar /> Date Range</h4>
            {DATE_OPTS.map((o) => (
              <label key={o.key} className="radio-row">
                <input type="radio" name="date" checked={dateF === o.key} onChange={() => setDateF(o.key)} />
                {o.label}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4><Icon.Tag /> Category</h4>
            <div className="chip-wrap">
              <button className={"chip chip-sm" + (catF === "All" ? " active" : "")} onClick={() => setCatF("All")}>All</button>
              {cats.map((c) => (
                <button key={c.id} className={"chip chip-sm" + (catF === c.name ? " active" : "")} onClick={() => setCatF(c.name)}>{c.name}</button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4><Icon.Pin /> Location</h4>
            <select className="select" value={locF} onChange={(e) => setLocF(e.target.value)}>
              {locations.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          <button className="btn btn-primary btn-block" onClick={() => { /* filter live, tombol untuk UX */ }}>
            Apply Filters
          </button>
          <button className="btn btn-ghost btn-block" style={{ marginTop: 8 }} onClick={() => { setQ(""); setDateF("all"); setCatF("All"); setLocF("All Locations"); }}>
            Reset
          </button>
        </aside>

        <div>
          {loading ? (
            <div className="center" style={{ padding: 60 }}><span className="spinner spinner-dark" /></div>
          ) : filtered.length === 0 ? (
            <div className="card center" style={{ padding: 50 }}>
              <p className="muted">Tidak ada event yang cocok dengan filter.</p>
            </div>
          ) : (
            <div className="ev-grid">
              {filtered.map((e) => (
                <EventCard key={e.id} event={e} onBookmark={toggleBookmark} bookmarked={bmIds.has(e.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
