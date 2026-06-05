# Event Kampus Backend

Backend Node.js/Express untuk aplikasi event kampus.

## Menjalankan

```bash
npm install
cp .env.example .env
npm run dev
```

Sesuaikan nilai database di `.env`, lalu import file SQL ke MySQL/MariaDB.

## Struktur

```text
src/
  app.js
  server.js
  config/
  controllers/
  db/
  middlewares/
  routes/
  services/
  utils/
```

## Endpoint Awal

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`
- `GET /api/users`
- `GET /api/users/:id`
- `GET /api/users/me`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/registrations`
- `GET /api/registrations/:id`
- `POST /api/registrations`
- `PUT /api/registrations/:id`
- `DELETE /api/registrations/:id`
- `GET /api/bookmarks`
- `GET /api/bookmarks/:id`
- `POST /api/bookmarks`
- `DELETE /api/bookmarks/:id`
- `GET /api/notifications`
- `GET /api/notifications/:id`
- `POST /api/notifications`
- `PUT /api/notifications/:id`
- `DELETE /api/notifications/:id`

## Role

- Register publik selalu membuat akun `mahasiswa`.
- `admin`: mengelola user, category, event, notification, dan melihat semua registration/bookmark.
- `mahasiswa`: melihat event/category, daftar event, membatalkan registration miliknya, membuat/menghapus bookmark miliknya, dan membaca notification miliknya.
