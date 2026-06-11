import { useEffect, useState, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Icon } from "./ui.jsx";
import { isMockMode, onModeChange, notifications as notifApi } from "../api/client.js";
import "./navbar.css";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mock, setMock] = useState(isMockMode());
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => onModeChange(setMock), []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifs = () => {
    if (user) {
      notifApi.list()
        .then((data) => setNotifs(data || []))
        .catch((err) => console.error("Gagal mengambil notifikasi:", err));
    }
  };

  useEffect(() => {
    loadNotifs();
    if (user) {
      const interval = setInterval(loadNotifs, 15000);
      return () => clearInterval(interval);
    } else {
      setNotifs([]);
    }
  }, [user]);

  const unreadCount = notifs.filter((n) => !n.is_read).length;

  const handleNotifClick = async (notif) => {
    setShowNotif(false);
    if (!notif.is_read) {
      try {
        await notifApi.update(notif.id, { is_read: 1 });
        loadNotifs();
      } catch (err) {
        console.error("Gagal mengupdate status notifikasi:", err);
      }
    }
    navigate(`/events/${notif.event_id}`);
  };

  const markAllAsRead = async () => {
    const unread = notifs.filter((n) => !n.is_read);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map((n) => notifApi.update(n.id, { is_read: 1 })));
      loadNotifs();
    } catch (err) {
      console.error("Gagal menandai semua terbaca:", err);
    }
  };

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
          
          {user && (
            <div className="notif-wrap" ref={notifRef}>
              <button className="icon-btn notif-bell" title="Notifikasi" onClick={() => setShowNotif(!showNotif)}>
                <Icon.Bell />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>
              
              {showNotif && (
                <div className="notif-menu">
                  <div className="notif-head">
                    <strong>Notifikasi</strong>
                    {unreadCount > 0 && (
                      <button className="notif-mark-all" onClick={markAllAsRead}>
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifs.length === 0 ? (
                      <div className="notif-empty">
                        <Icon.Bell className="empty-bell" style={{ width: 32, height: 32, opacity: 0.3, marginBottom: 8 }} />
                        <span>Belum ada notifikasi baru</span>
                      </div>
                    ) : (
                      notifs.map((n) => (
                        <div
                          key={n.id}
                          className={`notif-item ${!n.is_read ? "unread" : ""}`}
                          onClick={() => handleNotifClick(n)}
                        >
                          <div className="notif-content">
                            <p className="notif-msg">{n.message}</p>
                            <span className="notif-time">
                              {n.sent_at ? new Date(n.sent_at.replace(" ", "T")).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }) : ""}
                            </span>
                          </div>
                          {!n.is_read && <span className="notif-dot" />}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

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
