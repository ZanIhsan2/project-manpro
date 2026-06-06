// Data contoh untuk mode demo (mock). Dipakai otomatis bila backend tidak
// aktif, sehingga UI tetap bisa diklik & dilihat tanpa harus setup MySQL.

export const seedCategories = [
  { id: 1, name: "Academic", description: "Seminar, workshop, dan kegiatan akademik." },
  { id: 2, name: "Non-Academic", description: "Kegiatan komunitas dan minat bakat." },
  { id: 3, name: "Sports", description: "Pertandingan dan kegiatan olahraga." },
  { id: 4, name: "Music", description: "Konser, festival, dan pertunjukan musik." },
  { id: 5, name: "Seminars", description: "Talkshow dan diskusi panel." }
];

const img = (q) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=70`;

export const seedEvents = [
  {
    id: 1,
    title: "AI Ethics in Modern Research",
    description:
      "Bergabunglah dalam summit kampus yang membahas titik temu antara kemajuan teknologi yang pesat dan etika manusia. Sesi keynote, workshop interaktif, dan networking lunch.",
    location: "Main Hall Auditorium",
    organizer: "Campus Tech Alliance",
    start_time: "2026-10-24 10:00:00",
    end_time: "2026-10-24 16:00:00",
    status: "upcoming",
    category_id: 1,
    category_name: "Academic",
    admin_id: 1,
    admin_name: "Admin Kampus",
    image: img("photo-1540575467063-178a50c2df87"),
    attendees: 42,
    price: 0
  },
  {
    id: 2,
    title: "Autumn Beats Festival",
    description:
      "Festival musik tahunan dengan penampil dari komunitas musik kampus dan bintang tamu. Nikmati malam penuh energi di South Campus Green.",
    location: "Campus West Plaza",
    organizer: "Music Society",
    start_time: "2026-10-27 17:00:00",
    end_time: "2026-10-27 22:00:00",
    status: "upcoming",
    category_id: 4,
    category_name: "Music",
    admin_id: 1,
    admin_name: "Admin Kampus",
    image: img("photo-1459749411175-04bf5292ceea"),
    attendees: 156,
    price: 0
  },
  {
    id: 3,
    title: "Varsity Basketball Finals",
    description:
      "Pertandingan final basket antar fakultas. Dukung timmu di University Sports Center!",
    location: "University Sports Center",
    organizer: "Varsity Sports",
    start_time: "2026-10-30 18:00:00",
    end_time: "2026-10-30 20:30:00",
    status: "upcoming",
    category_id: 3,
    category_name: "Sports",
    admin_id: 1,
    admin_name: "Admin Kampus",
    image: img("photo-1546519638-68e109498ffc"),
    attendees: 89,
    price: 0
  },
  {
    id: 4,
    title: "Annual Innovation Summit",
    description:
      "Pameran inovasi mahasiswa dan startup kampus. Temui mentor dan investor.",
    location: "Main Auditorium",
    organizer: "Student Union Council",
    start_time: "2026-11-02 09:00:00",
    end_time: "2026-11-02 15:00:00",
    status: "upcoming",
    category_id: 1,
    category_name: "Academic",
    admin_id: 1,
    admin_name: "Admin Kampus",
    image: img("photo-1505373877841-8d25f7d46678"),
    attendees: 64,
    price: 0
  },
  {
    id: 5,
    title: "Next-Gen AI Workshop",
    description:
      "Workshop hands-on membangun aplikasi AI bersama IEEE Student Branch.",
    location: "IT Building Room 402",
    organizer: "IEEE Student Branch",
    start_time: "2026-11-02 13:00:00",
    end_time: "2026-11-02 17:00:00",
    status: "upcoming",
    category_id: 1,
    category_name: "Academic",
    admin_id: 1,
    admin_name: "Admin Kampus",
    image: img("photo-1517245386807-bb43f82c33c4"),
    attendees: 38,
    price: 0
  },
  {
    id: 6,
    title: "Inter-University Finals",
    description:
      "Final olahraga antar universitas di Campus Sports Complex.",
    location: "Campus Sports Complex",
    organizer: "Varsity Sports",
    start_time: "2026-11-05 16:00:00",
    end_time: "2026-11-05 19:00:00",
    status: "upcoming",
    category_id: 2,
    category_name: "Non-Academic",
    admin_id: 1,
    admin_name: "Admin Kampus",
    image: img("photo-1504450758481-7338eba7524a"),
    attendees: 112,
    price: 0
  }
];

export const seedUser = {
  id: 99,
  name: "Demo Mahasiswa",
  email: "demo@university.edu",
  role: "mahasiswa"
};

export const seedAdmin = {
  id: 1,
  name: "Admin Kampus",
  email: "admin@university.edu",
  role: "admin"
};
