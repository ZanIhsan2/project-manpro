import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { events as eventsApi } from "../api/client.js";
import { Icon, fmtDateFull } from "../components/ui.jsx";
import "./feedback.css";

const FALLBACK = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=70";
const DETAILS = ["Content Quality", "Speaker / Presenter", "Venue & Facilities", "Event Organization"];

function Stars({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={"star" + ((hover || value) >= n ? " on" : "")}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} bintang`}
        >★</button>
      ))}
    </div>
  );
}

export default function Feedback() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [overall, setOverall] = useState(0);
  const [ratings, setRatings] = useState({});
  const [enjoy, setEnjoy] = useState("");
  const [improve, setImprove] = useState("");
  const [anon, setAnon] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => { eventsApi.get(id).then(setEvent); }, [id]);

  function submit(e) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="container center" style={{ padding: "80px 0" }}>
        <div className="card success-card fade-up">
          <div className="success-icon" style={{ background: "var(--blue-100)", color: "var(--blue-600)" }}>★</div>
          <h1>Terima kasih atas feedback-mu!</h1>
          <p className="muted">Masukanmu membantu kami membuat event berikutnya lebih baik.</p>
          <Link to="/registrations" className="btn btn-primary" style={{ marginTop: 18 }}>Kembali ke Registrasi</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container fb-page">
      <div className="center" style={{ marginBottom: 30 }}>
        <h1 className="fb-title">Share Your Feedback</h1>
        <p className="muted">Bantu kami meningkatkan event mendatang dengan membagikan pengalamanmu{event ? ` di ${event.title}` : ""}.</p>
      </div>

      <div className="fb-grid">
        <aside className="card fb-event">
          <img src={event?.image || FALLBACK} alt="" onError={(e) => (e.currentTarget.src = FALLBACK)} />
          <div style={{ padding: 16 }}>
            <h3 style={{ margin: "0 0 10px" }}>{event?.title || "Event"}</h3>
            <div className="rs-meta"><Icon.Calendar /> {event ? fmtDateFull(event.start_time) : "-"}</div>
            <div className="rs-meta"><Icon.Pin /> {event?.location || "TBA"}</div>
            <hr className="rule" />
            <div className="row">
              <div className="org-avatar" style={{ width: 40, height: 40, fontSize: 15 }}>{(event?.organizer || "E")[0]}</div>
              <div><strong className="tiny">{event?.organizer || "Organizer"}</strong><div className="tiny muted">Organizer</div></div>
            </div>
          </div>
        </aside>

        <form className="fb-form" onSubmit={submit}>
          <div className="card fb-block">
            <div className="spread">
              <div><strong>Overall Satisfaction</strong><div className="tiny muted">Bagaimana penilaianmu secara keseluruhan?</div></div>
              <Stars value={overall} onChange={setOverall} />
            </div>
          </div>

          <div className="card fb-block">
            <strong>Detailed Ratings</strong>
            {DETAILS.map((d) => (
              <div className="spread fb-detail" key={d}>
                <span className="muted">{d}</span>
                <Stars value={ratings[d] || 0} onChange={(v) => setRatings({ ...ratings, [d]: v })} />
              </div>
            ))}
          </div>

          <div className="card fb-block">
            <label className="fb-label">What did you enjoy most?</label>
            <textarea className="textarea" placeholder="Bagikan momen favoritmu..." value={enjoy} onChange={(e) => setEnjoy(e.target.value)} />
            <label className="fb-label" style={{ marginTop: 14 }}>Suggestion for improvement</label>
            <textarea className="textarea" placeholder="Bagaimana kami bisa lebih baik?" value={improve} onChange={(e) => setImprove(e.target.value)} />
          </div>

          <div className="card fb-submit">
            <label className="row" style={{ gap: 10, cursor: "pointer" }}>
              <span className={"switch" + (anon ? " on" : "")} onClick={() => setAnon(!anon)}><span /></span>
              <span className="tiny">Submit feedback anonymously</span>
            </label>
            <button className="btn btn-primary">Submit Feedback</button>
          </div>
        </form>
      </div>
    </div>
  );
}
