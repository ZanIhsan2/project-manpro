# eventku — Frontend

React + Vite + React Router. Konsumsi REST API dari `backend/`.

## Jalankan
```bash
npm install
npm run dev      # http://localhost:5173 (proxy /api -> :3000)
npm run build    # produksi -> dist/
npm run preview  # uji build
```

## Konfigurasi
`.env` (opsional, lihat `.env.example`):
```
VITE_API_BASE_URL=        # kosong = pakai proxy Vite (/api)
                          # isi mis. https://api.kampus.ac.id/api untuk produksi
```

## Struktur
```
src/
├── api/
│   ├── client.js       # HTTP client + auto-fallback ke mock
│   └── mockServer.js   # mock in-memory (dipakai bila backend mati)
├── context/AuthContext.jsx
├── components/         # Navbar, Footer, EventCard, ikon, util tanggal
├── pages/              # Home, Login, Register, Events, EventDetail,
│                       # EventRegister, MyRegistrations, Bookmarks,
│                       # Feedback, About, Admin
├── data/seed.js        # data contoh untuk mode demo
└── styles/global.css   # design token (warna eventku, dsb.)
```

## Catatan
- Tanpa backend, app jalan di **Demo Mode** (data di localStorage).
- Akun demo: `admin@university.edu/admin123`, `demo@university.edu/demo123`.
- Reset data demo: hapus key `eventku_*` di localStorage browser.
