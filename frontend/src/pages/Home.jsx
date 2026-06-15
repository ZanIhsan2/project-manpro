import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { events as eventsApi, categories as catApi, registrations as regApi } from "../api/client.js";
import { EventCard } from "../components/shared.jsx";
import { Icon } from "../components/ui.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./home.css";

export default function Home() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [cats, setCats] = useState([]);
  const [regs, setRegs] = useState([]);
  const [active, setActive] = useState("All");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([eventsApi.list(), catApi.list()])
      .then(([ev, c]) => {
        setEvents(ev || []);
        setCats(c || []);
      })
      .finally(() => setLoading(false));

    if (user) {
      regApi.list().then((r) => setRegs(r || [])).catch(() => {});
    }
  }, [user]);

  const filtered = events.filter((e) => {
    const byCat = active === "All" || e.category_name === active;
    const byQ = !q || e.title.toLowerCase().includes(q.toLowerCase()) || (e.organizer || "").toLowerCase().includes(q.toLowerCase());
    return byCat && byQ;
  });

  const regIds = new Set(regs.map((r) => r.event_id));

  return (
    <>
      {/* hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-left fade-up">
            <span className="hero-badge"><Icon.Shield /> Official Campus Platform</span>
            <h1>Easy access to all <span className="blue">campus events.</span></h1>
            <p>
              Temukan seminar akademik, pameran seni yang semarak, dan kompetisi olahraga.
              Tetap terhubung dengan semua yang terjadi di sekitarmu dalam satu tempat.
            </p>
            <div className="hero-cta">
              <Link to="/events" className="btn btn-primary">Browse Events</Link>
              <Link to="/registrations" className="btn btn-outline">My Calendar</Link>
            </div>
          </div>
          <div className="hero-right fade-up">
            <div className="hero-logo-card">
              <Icon.Logo width="64" height="64" />
              <div>
                <div className="hl-name">eventku</div>
                <div className="hl-tag">Event Menarik untuk Mahasiswa</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* explore */}
      <section className="container explore">
        <div className="explore-head">
          <h2>Explore Activity</h2>
          <div className="search-box">
            <Icon.Search />
            <input placeholder="Search events, workshops, or clubs..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="cat-row">
          <span className="cat-label">Categories:</span>
          <button className={"chip" + (active === "All" ? " active" : "")} onClick={() => setActive("All")}>All</button>
          {cats.map((c) => (
            <button key={c.id} className={"chip" + (active === c.name ? " active" : "")} onClick={() => setActive(c.name)}>
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* featured */}
      <section className="featured">
        <div className="container">
          <div className="spread" style={{ marginBottom: 22 }}>
            <div>
              <h2 style={{ margin: 0 }}>Featured Events</h2>
              <p className="muted" style={{ margin: "4px 0 0" }}>Popular activities on campus this week</p>
            </div>
            <Link to="/events" className="view-all">View All <Icon.Arrow /></Link>
          </div>

          {loading ? (
            <div className="center" style={{ padding: 60 }}><span className="spinner spinner-dark" /></div>
          ) : filtered.length === 0 ? (
            <p className="muted center" style={{ padding: 40 }}>Tidak ada event yang cocok.</p>
          ) : (
            <div className="ev-grid">
              {filtered.slice(0, 6).map((e) => (
                <EventCard key={e.id} event={e} registered={regIds.has(e.id)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
