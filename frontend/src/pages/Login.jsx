import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Icon } from "../components/ui.jsx";
import "./auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form);
      navigate(loc.state?.from || "/", { replace: true });
    } catch (e) {
      setErr(e.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-card fade-up">
        <aside className="auth-side">
          <div>
            <span className="kicker">Campus Life Hub</span>
            <h2>Stay connected to your campus pulse.</h2>
            <p>
              Temukan momen yang mendefinisikan pengalaman kuliahmu. Ikuti workshop,
              olahraga, dan acara networking dengan mudah.
            </p>
          </div>
          <div className="auth-stats">
            <div><strong>500+</strong><span>Monthly Events</span></div>
            <div><strong>20k+</strong><span>Active Students</span></div>
          </div>
        </aside>

        <form className="auth-form" onSubmit={submit}>
          <h1>Welcome back</h1>
          <p className="sub">Masuk untuk mengelola registrasi dan jadwalmu.</p>

          {err && <div className="flash flash-error">{err}</div>}

          <div className="field">
            <label>University Email</label>
            <div className="input-icon">
              <Icon.Mail />
              <input className="input" type="email" placeholder="name@university.edu" value={form.email} onChange={set("email")} required />
            </div>
          </div>

          <div className="field">
            <div className="link-row">
              <label style={{ margin: 0 }}>Password</label>
              <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
            </div>
            <div className="input-icon pw-wrap">
              <Icon.Lock />
              <input className="input" type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={set("password")} required />
              <button type="button" className="toggle" onClick={() => setShowPw((s) => !s)}><Icon.Eye /></button>
            </div>
          </div>

          <label className="checkbox-row" style={{ marginBottom: 20 }}>
            <input type="checkbox" /> Remember this device
          </label>

          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <span className="spinner" /> : <>Login <Icon.Arrow /></>}
          </button>

          <div className="or">OR</div>
          <Link to="/register" className="btn btn-outline btn-block">Create an account</Link>

          <p className="tiny muted center" style={{ marginTop: 18 }}>
            Coba demo: <strong>admin@university.edu / admin123</strong> atau{" "}
            <strong>demo@university.edu / demo123</strong>
          </p>
        </form>
      </div>
    </div>
  );
}
