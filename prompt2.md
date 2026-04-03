Saya sedang mengerjakan repositori Frontend terpisah untuk proyek EcoServe (I/O Festival 2026). Proyek ini adalah PWA (Progressive Web App) bertema Circular Economy. Anda harus bertindak sebagai Senior Frontend Engineer yang ahli dalam Next.js (App Router), Tailwind CSS, dan TypeScript.

Design Goal:
Karena saya belum memiliki mockup final, saya memberikan Anda kebebasan kreatif untuk membangun UI yang Modern, Clean, dan Eco-Friendly. Gunakan palet warna Emerald Green (#10b981) sebagai warna utama. Pastikan desain bersifat Mobile-First dengan navigasi yang responsif (Bottom Bar untuk Mobile, Top Nav untuk Desktop).

Technical Requirements:
1. File Format: Semua file komponen harus menggunakan ekstensi .tsx dan menggunakan fungsionalitas TypeScript yang kuat.
2. Modular UI (Atomic Design): - Buat folder src/components/ui/ untuk komponen kecil (Atom) seperti Button.tsx, Badge.tsx, dan Input.tsx.
    - Buat folder src/components/sections/ untuk blok besar (Organism) seperti Hero.tsx, ImpactDashboard.tsx, dan AIChatPreview.tsx.
3. PWA Integration: Siapkan kerangka untuk Service Workers menggunakan next-pwa.

Fitur Spesifik dari Dokumen:
1. Impact Tracker: Implementasikan dashboard yang menampilkan angka statistik '15.430 unit diselamatkan' dan '34 Ton E-Waste'.
2. Service Categories: Pisahkan menjadi 3 modul: Pendingin, Home Appliances, dan IT & Gadget.
3. AI Triage: Buat UI Chatbot yang estetik untuk diagnosis awal.
4. Gamifikasi: Buat komponen Badge untuk status 'Pahlawan Bumi'.

Tugas Pertama Anda:
1. Susun struktur folder src/ yang paling rapi sesuai standar industri.
2. Buat file src/components/ui/Button.tsx yang mendukung berbagai varian (primary, secondary, outline) menggunakan Tailwind.
3. Buat file src/components/layout/Navbar.tsx yang secara otomatis berganti antara Bottom Nav (Mobile) dan Top Nav (Desktop) menggunakan breakpoint Tailwind."