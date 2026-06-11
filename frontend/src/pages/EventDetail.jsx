import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { events as eventsApi, bookmarks as bmApi } from "../api/client.js";
import { EventCard } from "../components/shared.jsx";
import { Icon, fmtDateFull, fmtTimeRange, dayNum, monthShort } from "../components/ui.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./detail.css";

const FALLBACK = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=70";
const PERKS = [
  { label: "Lunch", icon: "🍴" },
  { label: "Certificate", icon: "📜" },
  { label: "Refreshments", icon: "🥤" },
  { label: "Networking", icon: "🤝" }
];

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [related, setRelated] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [bmId, setBmId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    eventsApi.get(id).then(async (ev) => {
      setEvent(ev);
      const all = await eventsApi.list();
      setRelated((all || []).filter((e) => e.id !== Number(id)).slice(0, 3));
    }).finally(() => setLoading(false));

    if (user) {
      bmApi.list().then((bs) => {
        const b = (bs || []).find((x) => x.event_id === Number(id));
        setBookmarked(!!b);
        setBmId(b ? b.id : null);
      }).catch(() => {});
    }
  }, [id, user]);

  async function toggleBookmark() {
    if (!user) return navigate("/login", { state: { from: `/events/${id}` } });
    if (bookmarked && bmId) {
      await bmApi.remove(bmId);
      setBookmarked(false); setBmId(null);
    } else {
      const res = await bmApi.create({ event_id: Number(id) });
      setBookmarked(true); setBmId(res?.data?.id || null);
    }
  }

  if (loading) return <div className="center" style={{ padding: 80 }}><span className="spinner spinner-dark" /></div>;
  if (!event) return <div className="container center" style={{ padding: 80 }}><h2>Event tidak ditemukan</h2><Link to="/events" className="btn btn-primary" style={{ marginTop: 16 }}>Kembali ke Events</Link></div>;

  const free = !event.price || Number(event.price) === 0;

  return (
    <div className="container detail">
      <div className="detail-hero">
        <img src={event.image_path ? `/uploads/${event.image_path}` : (event.image || FALLBACK)} alt={event.title} onError={(e) => (e.currentTarget.src = FALLBACK)} />
        <span className="dh-date"><strong>{dayNum(event.start_time)}</strong><em>{monthShort(event.start_time)}</em></span>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="row" style={{ gap: 8, marginBottom: 12 }}>
            {event.category_name && <span className="badge badge-amber">{event.category_name}</span>}
            <span className="badge badge-blue">{(event.status || "upcoming").toUpperCase()}</span>
          </div>
          <h1>{event.title}</h1>
          <div className="detail-meta">
            <div><Icon.Clock /> {fmtDateFull(event.start_time)} • {fmtTimeRange(event.start_time, event.end_time)}</div>
            <div><Icon.Pin /> {event.location || "TBA"}</div>
          </div>

          <hr className="rule" />
          <h3>About the Event</h3>
          <p className="detail-desc">{event.description || "Belum ada deskripsi untuk event ini."}</p>

          <div className="loc-card">
            <h4><Icon.Pin /> Location Details</h4>
            <div className="map-mock">
              <Icon.Pin width="28" height="28" style={{ color: "var(--blue-600)" }} />
              <span>{event.location || "Campus Area"}</span>
            </div>
          </div>

          <div className="organizer card">
            <div className="org-avatar">{(event.organizer || "E")[0]}</div>
            <div>
              <div className="tiny" style={{ color: "var(--blue-600)", fontWeight: 800, letterSpacing: ".05em" }}>ORGANIZED BY</div>
              <strong style={{ fontSize: 18 }}>{event.organizer || "Campus Organizer"}</strong>
              <p className="muted tiny" style={{ margin: "2px 0 0" }}>Diselenggarakan oleh {event.admin_name || "tim kampus"}.</p>
            </div>
          </div>
        </div>

        <aside className="detail-side">
          <div className="ticket card">
            <div className="tiny muted" style={{ letterSpacing: ".05em" }}>TICKET PRICE</div>
            <div className="price-row">
              <span className="price">{free ? "Free" : `Rp${Number(event.price).toLocaleString("id-ID")}`}</span>
              {free && <span className="price-old">Rp15.000</span>}
            </div>
            <button className="btn btn-primary btn-block" onClick={() => navigate(`/events/${id}/register`)}>Register Now</button>
            <button className={"btn btn-outline btn-block" + (bookmarked ? " on" : "")} style={{ marginTop: 10 }} onClick={toggleBookmark}>
              <Icon.Bookmark width="16" height="16" /> {bookmarked ? "Bookmarked" : "Bookmark Event"}
            </button>
            <div className="capacity"><Icon.Shield /> Kapasitas terbatas: 120 kursi tersisa</div>
          </div>

          <div className="perks card">
            <strong style={{ fontSize: 15 }}>Event Perks</strong>
            <div className="perk-grid">
              {PERKS.map((p) => (
                <div key={p.label} className="perk"><span>{p.icon}</span> {p.label}</div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2 style={{ marginBottom: 18 }}>Related Events</h2>
          <div className="ev-grid">
            {related.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}
    </div>
  );
}
