import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { registrations as regApi } from "../api/client.js";
import { Icon, fmtTimeRange, dayNum, monthShort, fmtDateFull, parseDate } from "../components/ui.jsx";
import "./registrations.css";

const FALLBACK = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=70";

export default function MyRegistrations() {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    regApi.list().then((r) => setRegs(r || [])).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function cancel(id) {
    await regApi.remove(id);
    load();
  }

  const now = new Date();
  const withEvent = regs.filter((r) => r.event && r.event.id);
  const upcoming = withEvent.filter((r) => parseDate(r.event.start_time) >= now);
  const past = withEvent.filter((r) => parseDate(r.event.start_time) < now);

  if (loading) return <div className="center" style={{ padding: 80 }}><span className="spinner spinner-dark" /></div>;

  return (
    <div className="container reglist">
      <h1>My Registrations</h1>
      <p className="muted" style={{ marginTop: 4 }}>Pantau perjalanan kampusmu dan sorotan akademik mendatang.</p>

      {withEvent.length === 0 ? (
        <div className="card center" style={{ padding: 60, marginTop: 24 }}>
          <p className="muted">Belum ada registrasi. Yuk daftar event!</p>
          <Link to="/events" className="btn btn-primary" style={{ marginTop: 14 }}>Jelajah Events</Link>
        </div>
      ) : (
        <>
          <div className="spread" style={{ margin: "30px 0 16px" }}>
            <h2 className="bar-head">Upcoming Events</h2>
            <span className="badge badge-soft">{upcoming.length} Confirmed</span>
          </div>

          {upcoming.length === 0 ? (
            <p className="muted">Tidak ada event mendatang.</p>
          ) : (
            <div className="ev-grid">
              {upcoming.map((r) => (
                <article key={r.id} className="ev-card fade-up">
                  <Link to={`/events/${r.event.id}`} className="ev-media">
                    <img src={r.event.image_path ? `/uploads/${r.event.image_path}` : (r.event.image || FALLBACK)} alt={r.event.title} onError={(e) => (e.currentTarget.src = FALLBACK)} />
                    <span className="ev-date"><strong>{dayNum(r.event.start_time)}</strong><em>{monthShort(r.event.start_time)}</em></span>
                    {r.event.category_name && <span className="badge badge-amber ev-cat">{r.event.category_name}</span>}
                  </Link>
                  <div className="ev-body">
                    <h3 className="ev-title">{r.event.title}</h3>
                    <div className="ev-loc"><Icon.Clock /> {fmtTimeRange(r.event.start_time, r.event.end_time)}</div>
                    <div className="ev-loc"><Icon.Pin /> {r.event.location || "TBA"}</div>
                    <div className="ev-foot">
                      <Link to={`/events/${r.event.id}`} className="btn btn-primary btn-sm">Detail Event</Link>
                      <button className="heart" title="Batalkan" onClick={() => cancel(r.id)}><Icon.Trash /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="spread" style={{ margin: "36px 0 14px" }}>
            <h2>Past Events</h2>
            <Link to="#" className="view-all" onClick={(e) => e.preventDefault()}>Download All Certificates ⤓</Link>
          </div>
          <div className="card past-table">
            <div className="pt-head">
              <span>EVENT DETAILS</span><span>DATE &amp; TIME</span><span>STATUS</span><span style={{ textAlign: "right" }}>ACTION</span>
            </div>
            {past.length === 0 ? (
              <div className="pt-empty muted">Belum ada event yang sudah berlalu.</div>
            ) : past.map((r) => (
              <div className="pt-row" key={r.id}>
                <div className="pt-ev">
                  <img src={r.event.image_path ? `/uploads/${r.event.image_path}` : (r.event.image || FALLBACK)} alt="" onError={(e) => (e.currentTarget.src = FALLBACK)} />
                  <div>
                    <strong>{r.event.title}</strong>
                    <div className="tiny muted">{r.event.category_name || "—"}</div>
                  </div>
                </div>
                <div className="tiny">{fmtDateFull(r.event.start_time)}</div>
                <div><span className="badge badge-green">● Attended</span></div>
                <div style={{ textAlign: "right" }}>
                  <Link to={`/events/${r.event.id}/feedback`} className="pt-action">Rate Event</Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
