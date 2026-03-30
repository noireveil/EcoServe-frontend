## Cara Menjalankan Aplikasi (Local Development)

### Tahap 1: Inisialisasi Backend dan Database
Sistem ini menggunakan arsitektur *containerized* melalui Docker Compose untuk memastikan konsistensi *environment* dan mempermudah pengujian tanpa memerlukan konfigurasi infrastruktur manual.

**[Tautan Repositori Backend: github.com/noireveil/ecoserve-backend](https://github.com/noireveil/ecoserve-backend)**

1. Pastikan *container engine* (Docker Desktop / Podman) telah aktif di sistem Anda.
2. Lakukan *clone* pada repositori backend dan jalankan *container*:
   ```bash
   git clone https://github.com/noireveil/ecoserve-backend.git
   cd ecoserve-backend
   docker compose up -d --build
   ```
*Catatan: API dan Database akan berjalan di latar belakang. Endpoint API dapat diakses pada `http://localhost:3000`.*

### Tahap 2: Inisialisasi Frontend
1. Buka *instance* terminal baru dan pastikan Node.js telah terinstal.
2. Lakukan *clone* pada repositori frontend (repositori ini), instal dependensi, dan jalankan *development server*:
   ```bash
   git clone https://github.com/noireveil/ecoserve-frontend.git
   cd ecoserve-frontend
   npm install
   npm run dev
   ```
*Catatan: Antarmuka klien (Client UI) dapat diakses melalui `http://localhost:3001` (Next.js akan secara otomatis mengalihkan port default ke 3001 karena port 3000 telah digunakan oleh layanan backend).*
