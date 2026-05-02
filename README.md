<div align="center">

# EcoServe - Frontend Web Application

![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Supported-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

**EcoServe Frontend** adalah antarmuka interaktif yang dirancang untuk mendigitalkan ekonomi sirkular. Dibangun dengan pendekatan *Mobile-First*, aplikasi ini memberikan pengalaman pengguna yang mulus bagi konsumen yang membutuhkan perbaikan perangkat, serta dasbor operasional yang efisien bagi para teknisi di lapangan.

[🔗 **Kunjungi Live Website**](https://www.ecoserve.site) | [⚙️ **Repository Backend Engine**](https://github.com/noireveil/ecoserve-backend)

</div>

---

## Fitur Utama (Frontend)

### 1. Arsitektur Progressive Web App (PWA)
Aplikasi ini dapat diinstal langsung ke perangkat seluler (Android/iOS) maupun desktop, memberikan pengalaman layaknya aplikasi *native* dengan dukungan *caching* dan *service worker* untuk pemuatan halaman yang instan.

### 2. Live Geolocation & Routing
Menggunakan **Leaflet** dan **OSRM**, aplikasi menyediakan peta interaktif secara *real-time*:
* **Bagi Konsumen:** Melacak posisi teknisi dan rute yang sedang ditempuh menuju lokasi.
* **Bagi Teknisi:** Navigasi presisi (*turn-by-turn*) dari lokasi saat ini menuju alamat pelanggan dengan integrasi GPS.

### 3. AI Triage Interface
Antarmuka percakapan (Chatbot UI) intuitif yang terhubung dengan layanan *AI Diagnosis*. Memungkinkan pengguna untuk menjelaskan masalah perangkat secara natural atau mengunggah foto kerusakan untuk mendapatkan estimasi biaya secara instan.

### 4. Sistem Keamanan Sesi (State Management)
* **Middleware Proteksi Rute:** Menggunakan `next/server` proxy untuk memblokir akses tidak sah ke halaman *Dashboard* dan secara otomatis mengarahkan lalu lintas berdasarkan kepemilikan JWT Token.
* **OTP Authentication Flow:** Alur UI login tanpa *password* yang mulus dengan validasi input kode 6 digit interaktif.

### 5. Dasbor Dinamis & Terpisah
* **Customer Portal:** Manajemen *Digital Product Passport*, riwayat servis, dan kalkulator penghematan jejak karbon (CO₂).
* **Technician Control Center:** Manajemen ketersediaan (*toggle switch* Online/Offline), papan pesanan masuk, dan pelacakan pendapatan otomatis.

---

## Stack Teknologi

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | React framework untuk SSR, performa tinggi, & optimasi SEO. |
| **Bahasa** | TypeScript | Keamanan pengetikan (*type-safety*) yang ketat. |
| **Styling** | Tailwind CSS + shadcn/ui | Desain responsif, modern, dan komponen yang dapat disesuaikan. |
| **Map Engine** | Leaflet + React Leaflet | Render peta interaktif *open-source*. |
| **State & Fetching** | SWR + Axios | Manajemen status data dan komunikasi asinkron dengan API Backend. |
| **PWA Tooling** | next-pwa | Konfigurasi manifest dan *service worker* otomatis. |

---

## Panduan Instalasi Lokal

Pastikan Anda telah menginstal **Node.js (v20+)** dan **pnpm** sebelum memulai.

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/noireveil/ecoserve-frontend.git
cd ecoserve-frontend
pnpm install
```

### 2. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local` dan sesuaikan dengan URL backend lokal/produksi Anda.
```bash
cp .env.example .env.local
```
Contoh isi `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
# Ubah ke URL API Render Anda saat build untuk production
```

### 3. Jalankan Development Server
Aplikasi menggunakan Turbopack untuk *Hot Module Replacement* (HMR) yang sangat cepat.
```bash
pnpm run dev
```
Buka `http://localhost:3000` di browser Anda.

---

## Build & Deployment (Production)

Proyek ini telah dikonfigurasi dan dioptimalkan untuk di-deploy di platform modern seperti **Vercel**.

1. Pastikan file `next.config.js` telah mengatur sistem *bypass* Turbopack dan mengonfigurasi `next-pwa` dengan benar jika terjadi konflik dependensi (Gunakan `next build --webpack` jika diperlukan).
2. Lakukan proses *build*:
```bash
pnpm run build
```
3. Mulai server produksi:
```bash
pnpm start
```

---
*Dibangun untuk Kompetisi I/O Festival 2026.*
