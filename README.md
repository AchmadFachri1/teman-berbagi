# Teman Berbagi API + Mongoose

Project ini sudah disusun menjadi frontend di folder `public` dan backend API di folder `server`.

## Cara menjalankan

1. Install dependency:

```bash
npm install
```

2. Buat file `.env` dari contoh:

```bash
cp .env.example .env
```

3. Pastikan MongoDB sudah berjalan, lalu sesuaikan `MONGO_URI` di file `.env`.

4. Jalankan server:

```bash
npm run dev
```

5. Buka browser:

```bash
http://localhost:5000
```

## Endpoint API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/health`

## Struktur utama

```text
teman-berbagi-structured/
├── public/
│   ├── css/
│   ├── js/
│   ├── assets/
│   └── index.html
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── config.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
