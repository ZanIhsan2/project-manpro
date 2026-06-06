import { Link } from "react-router-dom";
import { Icon } from "../components/ui.jsx";

export default function About() {
  return (
    <div className="container" style={{ padding: "56px 0 30px", maxWidth: 820 }}>
      <span className="hero-badge"><Icon.Logo width="18" height="18" /> Tentang eventku</span>
      <h1 style={{ fontSize: 40, margin: "16px 0 14px", lineHeight: 1.1 }}>
        Satu tempat untuk semua <span style={{ color: "var(--blue-600)" }}>event kampus.</span>
      </h1>
      <p className="muted" style={{ fontSize: 17, lineHeight: 1.7 }}>
        eventku adalah platform resmi kegiatan kampus yang menghubungkan mahasiswa
        dengan seminar akademik, kompetisi olahraga, pertunjukan musik, dan kegiatan
        komunitas. Mahasiswa dapat menjelajah, mendaftar, menyimpan bookmark, serta
        memberi feedback. Admin dapat mengelola event, kategori, dan notifikasi.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginTop: 30 }}>
        {[
          { icon: Icon.Search, t: "Jelajah & Filter", d: "Cari event berdasarkan kategori, tanggal, dan lokasi." },
          { icon: Icon.Bookmark, t: "Bookmark", d: "Simpan event favoritmu untuk dilihat nanti." },
          { icon: Icon.Calendar, t: "Registrasi", d: "Daftar event dan pantau jadwalmu di satu halaman." },
          { icon: Icon.Shield, t: "Admin Panel", d: "Kelola event, kategori, dan kirim notifikasi." }
        ].map((f) => {
          const I = f.icon;
          return (
            <div className="card" key={f.t} style={{ padding: 20 }}>
              <div className="stat-ico blue" style={{ marginBottom: 12 }}><I /></div>
              <strong style={{ fontSize: 16 }}>{f.t}</strong>
              <p className="muted tiny" style={{ margin: "6px 0 0", lineHeight: 1.5 }}>{f.d}</p>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ padding: 24, marginTop: 28 }}>
        <h3 style={{ marginTop: 0 }}>Stack Teknologi</h3>
        <p className="muted tiny" style={{ lineHeight: 1.7 }}>
          <strong>Frontend:</strong> React + Vite + React Router. <br />
          <strong>Backend:</strong> Node.js + Express, JWT auth, MySQL (mysql2). <br />
          Frontend memanggil REST API backend di <code>/api</code>; jika backend belum aktif,
          aplikasi otomatis memakai data demo lokal sehingga tetap bisa dijelajahi.
        </p>
        <Link to="/events" className="btn btn-primary" style={{ marginTop: 14 }}>Mulai Jelajah Events</Link>
      </div>
    </div>
  );
}
