# Teman Berbagi API - Regression Test Suite

[![CI Status](https://github.com/achmadfachri/teman-berbagi/actions/workflows/test.yml/badge.svg)](https://github.com/achmadfachri/teman-berbagi/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)](./coverage/lcov-report/index.html)
[![Tests](https://img.shields.io/badge/tests-52%20passed-success)](./tests)
[![Node.js](https://img.shields.io/badge/Node.js-18.x--20.x-green)](https://nodejs.org/)

## Badge Status CI

| Pipeline | Status |
|----------|--------|
| **GitHub Actions** | ![CI Status](https://github.com/achmadfachri/teman-berbagi/actions/workflows/test.yml/badge.svg) |
| **Coverage** | ![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen) |
| **Tests** | ![Tests](https://img.shields.io/badge/tests-52%20passed-success) |

> **Catatan:** Ganti `achmadfachri/teman-berbagi` dengan username dan repository name Anda yang sebenarnya.

<div align="center">

# 🤝 Teman Berbagi API - Regression Test Suite

[![CI Status](https://github.com/achmadfachri/teman-berbagi/actions/workflows/test.yml/badge.svg)](https://github.com/achmadfachri/teman-berbagi/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/badge/Coverage-85%25-brightgreen)](./coverage/lcov-report/index.html)
[![Tests](https://img.shields.io/badge/Tests-52%20Passed-success)](./tests)
[![Node.js](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x-green)](https://nodejs.org/)
[![Jest](https://img.shields.io/badge/Jest-29.x-red)](https://jestjs.io/)
[![Supertest](https://img.shields.io/badge/Supertest-6.x-blue)](https://github.com/ladjs/supertest)

---

## 📋 Daftar Isi

- [Deskripsi](#-deskripsi)
- [Endpoint API](#-endpoint-api)
- [Test Cases](#-test-cases)
- [Cara Menjalankan](#-cara-menjalankan)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Coverage Report](#-coverage-report)

---

## 📝 Deskripsi

Proyek ini merupakan **Regression Test Suite** untuk API website "Teman Berbagi" menggunakan **Jest** dan **Supertest**. Test suite mencakup 52 test cases yang melindungi fungsionalitas API dari perubahan yang tidak disengaja.

### Teknologi yang Digunakan

| Teknologi | Versi | Keterangan |
|-----------|-------|-------------|
| Node.js | 18.x / 20.x | Runtime environment |
| Express.js | 4.x | Framework backend |
| MongoDB | 6.x / 7.x | Database |
| Jest | 29.x | Testing framework |
| Supertest | 6.x | HTTP assertion |
| GitHub Actions | - | CI/CD pipeline |

---

## 🔗 Endpoint API

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/data` | Ambil semua data | No |
| GET | `/api/data/:id` | Ambil data by ID | No |
| POST | `/api/data` | Tambah data baru | Yes |
| PUT | `/api/data/:id` | Update data | Yes |
| DELETE | `/api/data/:id` | Hapus data | Yes |

---

## ✅ Test Cases (52 Total)

### Complete CRUD Tests (13 test cases)
| No | Test Case | Tipe | Status |
|----|-----------|------|--------|
| TC1 | GET /api/data - empty array | Happy Path | ✅ |
| TC2 | GET /api/data - pagination | Happy Path | ✅ |
| TC3 | GET /api/data/:id - valid ID | Happy Path | ✅ |
| TC4 | GET /api/data/:id - 404 not found | Edge Case | ✅ |
| TC5 | GET /api/data/:id - invalid ID format | Edge Case | ✅ |
| TC6 | POST /api/data - valid input | Happy Path | ✅ |
| TC7 | POST /api/data - missing fields | Edge Case | ✅ |
| TC8 | POST /api/data - no auth | Edge Case | ✅ |
| TC9 | PUT /api/data/:id - update | Happy Path | ✅ |
| TC10 | PUT /api/data/:id - 404 | Edge Case | ✅ |
| TC11 | DELETE /api/data/:id - delete | Happy Path | ✅ |
| TC12 | DELETE /api/data/:id - 404 | Edge Case | ✅ |
| TC13 | GET /api/data - filter by category | Edge Case | ✅ |

### Auth API Tests (7 test cases)
| No | Test Case | Status |
|----|-----------|--------|
| 1 | Register - new user | ✅ |
| 2 | Register - missing fields | ✅ |
| 3 | Register - duplicate email | ✅ |
| 4 | Login - success | ✅ |
| 5 | Login - wrong password | ✅ |
| 6 | GET /me - valid token | ✅ |
| 7 | GET /me - no token | ✅ |

### Model Validation Tests (10 test cases)
| No | Test Case | Status |
|----|-----------|--------|
| 1 | Create valid data item | ✅ |
| 2 | Title too short | ✅ |
| 3 | Title too long | ✅ |
| 4 | Description missing | ✅ |
| 5 | Description too short | ✅ |
| 6 | Amount missing | ✅ |
| 7 | Amount too low | ✅ |
| 8 | Invalid category | ✅ |
| 9 | Default status | ✅ |
| 10 | UpdatedAt on save | ✅ |

---

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
