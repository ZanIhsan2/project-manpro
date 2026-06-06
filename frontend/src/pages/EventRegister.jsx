import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { events as eventsApi, registrations as regApi } from "../api/client.js";
import { Icon, fmtDateFull, fmtTimeRange, dayNum, monthShort } from "../components/ui.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./register-event.css";

const FALLBACK = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=70";
const DEPTS = ["Computer Science", "Engineering", "Business", "Arts & Design", "Medicine", "Law", "Lainnya"];

export default function EventRegister() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", studentId: "", dept: "", dietary: false });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    eventsApi.get(id).then(setEvent).finally(() => setLoading(false));
    if (user) setForm((f) => ({ ...f, name: user.name || "", email: user.email || "" }));
  }, [id, user]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr(""); setSubmitting(true);
    try {
      await regApi.create({ event_id: Number(id) });
      setDone(true);
    } catch (e) {
      setErr(e.message || "Pendaftaran gagal");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="center" style={{ padding: 80 }}><span className="spinner spinner-dark" /></div>;
  if (!event) return <div className="container center" style={{ padding: 80 }}><h2>Event tidak ditemukan</h2></div>;

  if (done) {
    return (
      <div className="container center" style={{ padding: "80px 0" }}>
        <div className="card success-card fade-up">
          <div className="success-icon"><Icon.Shield width="34" height="34" /></div>
          <h1>Pendaftaran Berhasil!</h1>
          <p className="muted">Kamu terdaftar di <strong>{event.title}</strong>. Detailnya ada di halaman Registrasi Saya.</p>
          <div className="row" style={{ justifyContent: "center", marginTop: 20, gap: 12 }}>
            <Link to="/registrations" className="btn btn-primary">Lihat Registrasi Saya</Link>
            <Link to="/events" className="btn btn-outline">Jelajah Event Lain</Link>
          </div>
        </div>
      </div>
    );
  }

  const free = !event.price || Number(event.price) === 0;

  return (
    <div className="container reg-page">
      <Link to={`/events/${id}`} className="back-link">← Back to Event Details</Link>

      <div className="reg-grid">
        <form className="card reg-form" onSubmit={submit}>
          <h1>Event Registration</h1>
          <p className="muted">Lengkapi detail mahasiswa untuk konfirmasi kehadiranmu.</p>

          {err && <div className="flash flash-error" style={{ marginTop: 16 }}>{err}</div>}

          <div className="field" style={{ marginTop: 18 }}>
            <label>Full Name</label>
            <input className="input" placeholder="Enter your full name" value={form.name} onChange={set("name")} required />
          </div>

          <div className="reg-2col">
            <div className="field">
              <label>University Email</label>
              <input className="input" type="email" placeholder="name@university.edu" value={form.email} onChange={set("email")} required />
            </div>
            <div className="field">
              <label>Student ID</label>
              <input className="input" placeholder="ID-1234567" value={form.studentId} onChange={set("studentId")} />
            </div>
          </div>

          <div className="field">
            <label>Department/Major</label>
            <select className="select" value={form.dept} onChange={set("dept")}>
              <option value="">Select your department</option>
              {DEPTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          <label className="checkbox-row" style={{ marginBottom: 18 }}>
            <input type="checkbox" checked={form.dietary} onChange={set("dietary")} />
            <span><strong>Dietary Requirements (if any)</strong><br />Centang bila kamu punya alergi atau preferensi makanan tertentu.</span>
          </label>

          <hr className="rule" />
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? <span className="spinner" /> : "Confirm Registration"}
          </button>
          <p className="tiny muted" style={{ marginTop: 10 }}>Dengan menekan tombol, kamu menyetujui kode etik acara.</p>
        </form>

        <aside className="reg-summary">
          <div className="card">
            <div className="rs-hero">
              <img src={event.image || FALLBACK} alt={event.title} onError={(e) => (e.currentTarget.src = FALLBACK)} />
              <span className="dh-date"><strong>{dayNum(event.start_time)}</strong><em>{monthShort(event.start_time)}</em></span>
              <span className="badge badge-amber rs-cap">Limited Capacity</span>
            </div>
            <div style={{ padding: 18 }}>
              <h3 style={{ margin: "0 0 12px" }}>{event.title}</h3>
              <div className="rs-meta"><Icon.Calendar /> {fmtDateFull(event.start_time)}</div>
              <div className="rs-meta"><Icon.Clock /> {fmtTimeRange(event.start_time, event.end_time)}</div>
              <div className="rs-meta"><Icon.Pin /> {event.location || "TBA"}</div>
              <hr className="rule" />
              <strong>Registration Summary</strong>
              <div className="spread tiny" style={{ marginTop: 10 }}><span className="muted">Ticket Type</span><strong>Student Delegate</strong></div>
              <div className="spread tiny" style={{ marginTop: 6 }}><span className="muted">Fee</span><strong style={{ color: "var(--amber)" }}>{free ? "Complimentary" : `Rp${Number(event.price).toLocaleString("id-ID")}`}</strong></div>
            </div>
          </div>

          <div className="card secure">
            <Icon.Shield />
            <div>
              <strong>Secure Registration</strong>
              <p className="tiny muted" style={{ margin: "2px 0 0" }}>Kredensialmu diverifikasi terhadap registry mahasiswa pusat.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
