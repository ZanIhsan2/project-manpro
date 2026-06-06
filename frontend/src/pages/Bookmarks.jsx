import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookmarks as bmApi } from "../api/client.js";
import { EventCard } from "../components/shared.jsx";

export default function Bookmarks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    bmApi.list().then((b) => setItems(b || [])).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function remove(ev) {
    const b = items.find((x) => x.event_id === ev.id);
    if (b) { await bmApi.remove(b.id); load(); }
  }

  if (loading) return <div className="center" style={{ padding: 80 }}><span className="spinner spinner-dark" /></div>;

  return (
    <div className="container" style={{ padding: "40px 0 20px" }}>
      <h1 style={{ fontSize: 36, margin: 0 }}>Bookmark Saya</h1>
      <p className="muted" style={{ marginTop: 4 }}>Event yang kamu simpan untuk dilihat nanti.</p>

      {items.length === 0 ? (
        <div className="card center" style={{ padding: 60, marginTop: 24 }}>
          <p className="muted">Belum ada bookmark. Simpan event favoritmu dari halaman detail.</p>
          <Link to="/events" className="btn btn-primary" style={{ marginTop: 14 }}>Jelajah Events</Link>
        </div>
      ) : (
        <div className="ev-grid" style={{ marginTop: 24 }}>
          {items.filter((b) => b.event && b.event.id).map((b) => (
            <EventCard key={b.id} event={b.event} onBookmark={remove} bookmarked />
          ))}
        </div>
      )}
    </div>
  );
}
