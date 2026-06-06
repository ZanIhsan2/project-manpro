import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Icon } from "./ui.jsx";
import { isMockMode, onModeChange } from "../api/client.js";
import "./navbar.css";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mock, setMock] = useState(isMockMode());
  const [open, setOpen] = useState(false);

  useEffect(() => onModeChange(setMock), []);

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/events", label: "Events" },
    { to: "/registrations", label: "Calendar" },
    { to: "/about", label: "About" }
  ];

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <Icon.Logo />
          <span>eventku</span>
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" onClick={() => setOpen(false)} className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="nav-right">
          {mock && <span className="mode-pill" title="Backend tidak terdeteksi — memakai data demo lokal">Demo Mode</span>}
          <button className="icon-btn hide-mobile" title="Notifikasi" onClick={() => navigate("/registrations")}>
            <Icon.Bell />
          </button>
          <button className="icon-btn hide-mobile" title="Bookmark" onClick={() => navigate("/bookmarks")}>
            <Icon.Bookmark />
          </button>

          {user ? (
            <div className="avatar-wrap">
              <button className="avatar" onClick={() => setOpen((o) => o)}>
                {user.name?.[0]?.toUpperCase() || "U"}
              </button>
              <div className="avatar-menu">
                <div className="am-head">
                  <strong>{user.name}</strong>
                  <span className="tiny muted">{user.email}</span>
                  <span className="badge badge-soft" style={{ marginTop: 6 }}>{user.role}</span>
                </div>
                <Link to="/registrations" className="am-item">Registrasi Saya</Link>
                <Link to="/bookmarks" className="am-item">Bookmark</Link>
                {isAdmin && <Link to="/admin" className="am-item">Admin Panel</Link>}
                <button className="am-item danger" onClick={() => { logout(); navigate("/"); }}>
                  Keluar
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}

          <button className="burger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
