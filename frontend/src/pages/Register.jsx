import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Icon } from "../components/ui.jsx";
import "./auth.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", studentId: "", password: "" });
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!agree) return setErr("Kamu harus menyetujui Terms of Service.");
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate("/", { replace: true });
    } catch (e) {
      setErr(e.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-card fade-up">
        <aside className="auth-side">
          <div>
            <h2>Join the campus pulse.</h2>
            <p>
              Buka akses ke workshop, acara olahraga, dan pertemuan komunitas yang
              sedang berlangsung di seluruh kampusmu.
            </p>
          </div>
          <div className="auth-tags">
            <span>#Community</span><span>#Growth</span><span>#Discovery</span>
          </div>
        </aside>

        <form className="auth-form" onSubmit={submit}>
          <h1>Create Account</h1>
          <p className="sub">Start your journey with eventku today.</p>

          {err && <div className="flash flash-error">{err}</div>}

          <div className="field">
            <label>Full Name</label>
            <input className="input" placeholder="Enter your full name" value={form.name} onChange={set("name")} required />
          </div>

          <div className="field">
            <label>University Email</label>
            <input className="input" type="email" placeholder="name@university.edu" value={form.email} onChange={set("email")} required />
          </div>

          <div className="auth-grid2">
            <div className="field">
              <label>Student ID</label>
              <input className="input" placeholder="ID Number" value={form.studentId} onChange={set("studentId")} />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required />
            </div>
          </div>

          <label className="checkbox-row" style={{ marginBottom: 20 }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>I agree to the <a href="#" onClick={(e)=>e.preventDefault()} style={{color:"var(--blue-600)",fontWeight:700}}>Terms of Service</a> and <a href="#" onClick={(e)=>e.preventDefault()} style={{color:"var(--blue-600)",fontWeight:700}}>Privacy Policy</a>.</span>
          </label>

          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign Up"}
          </button>

          <div className="auth-foot">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
