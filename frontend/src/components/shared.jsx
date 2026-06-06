import { Link } from "react-router-dom";
import { Icon, dayNum, monthShort } from "./ui.jsx";
import "./shared.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="brand" style={{ marginBottom: 10 }}>
            <Icon.Logo /> <span>eventku</span>
          </div>
          <p className="muted tiny" style={{ maxWidth: 240 }}>
            © 2026 eventku. Supporting vibrant campus life.
          </p>
        </div>
        <nav className="footer-links">
          <a href="#">Campus Map</a>
          <a href="#">Student Union</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Support</a>
        </nav>
        <div className="footer-social">
          <a href="#" className="fsoc">🌐</a>
          <a href="#" className="fsoc">↗</a>
        </div>
      </div>
    </footer>
  );
}

const FALLBACK = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=70";

export function EventCard({ event, onBookmark, bookmarked }) {
  return (
    <article className="ev-card fade-up">
      <Link to={`/events/${event.id}`} className="ev-media">
        <img src={event.image || FALLBACK} alt={event.title} loading="lazy" onError={(e) => (e.currentTarget.src = FALLBACK)} />
        <span className="ev-date">
          <strong>{dayNum(event.start_time)}</strong>
          <em>{monthShort(event.start_time)}</em>
        </span>
        {event.category_name && <span className="badge badge-amber ev-cat">{event.category_name}</span>}
      </Link>
      <div className="ev-body">
        {event.organizer && <div className="ev-org">{event.organizer}</div>}
        <h3 className="ev-title">{event.title}</h3>
        <div className="ev-loc"><Icon.Pin /> {event.location || "TBA"}</div>
        <div className="ev-foot">
          <Link to={`/events/${event.id}`} className="btn btn-outline btn-sm">View Detail</Link>
          {onBookmark && (
            <button
              className={"heart" + (bookmarked ? " on" : "")}
              onClick={() => onBookmark(event)}
              title={bookmarked ? "Hapus bookmark" : "Simpan"}
            >
              <Icon.Heart filled={bookmarked} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
