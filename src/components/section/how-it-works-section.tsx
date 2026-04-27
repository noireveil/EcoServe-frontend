"use client"

const Icon = {
  Leaf: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.8 2c1 5 .5 10-2.4 14a7 7 0 0 1-6.4 4Z"/>
      <path d="M2 22s.5-3.5 4-7"/>
    </svg>
  ),
  Camera: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  Map: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Z"/>
      <path d="M9 3v16M15 5v16"/>
    </svg>
  ),
  Check: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  ),
  Spark: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>
    </svg>
  ),
  Pin: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Globe: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
    </svg>
  ),
  Arrow: () => <span aria-hidden="true">→</span>,
  Twitter: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.55 7.49L22 22h-6.83l-4.74-6.2L4.8 22H2l7.04-8.05L2 2h6.91l4.3 5.69L18.24 2Zm-1.2 18h1.6L7.04 4h-1.7l11.7 16Z"/></svg>
  ),
  Instagram: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
  ),
  LinkedIn: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33 0-3.04-1.85-3.04s-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg>
  ),
};

export function HowItWorksSection() {
  return (
     <section className="howto" id="howto">
      <div className="container">
        <div className="howto-head">
          <div>
            <span className="section-label">Bagaimana EcoServe Bekerja</span>
            <h2>
              Tiga langkah dari rusak <span className="serif">menjadi pulih</span>.
            </h2>
          </div>
          <p>
            Tidak perlu antri, tinggal terima kunjungan teknisi, Selesai.
            Dengan dampak lingkungan terukur di setiap perbaikan.
          </p>
        </div>

        <div className="steps3">
          <article className="step3">
            <div className="step3-top">
              <span className="step3-num">01 / Lapor</span>
              <span className="step3-icon"><Icon.Camera /></span>
            </div>
            <h3>Foto & Laporkan</h3>
            <p>
              Buka aplikasi, foto perangkat yang rusak, dan tuliskan keluhan singkat. AI akan
              langsung menganalisis kerusakannya.
            </p>
            <div className="step3-vis">
              <div className="row"><span>device</span><span className="v">smartphone</span></div>
              <div className="row"><span>damage</span><span className="v green">screen_crack</span></div>
              <div className="row"><span>eligible repair</span><span className="v green">94.1%</span></div>
            </div>
          </article>

          <article className="step3">
            <div className="step3-top">
              <span className="step3-num">02 / Match</span>
              <span className="step3-icon"><Icon.Map /></span>
            </div>
            <h3>Teknisi Datang</h3>
            <p>
              GPS routing memilih teknisi bersertifikat terdekat. Profil, harga, dan ETA muncul
              real-time. Kamu yang tetap pegang kendali.
            </p>
            <div className="step3-vis">
              <div className="row"><span>nearest</span><span className="v">Budi S. · 0.8 km</span></div>
              <div className="row"><span>eta</span><span className="v aqua">12 min</span></div>
              <div className="row"><span>certified</span><span className="v">Level 3</span></div>
            </div>
          </article>

          <article className="step3">
            <div className="step3-top">
              <span className="step3-num">03 / Tuntas</span>
              <span className="step3-icon"><Icon.Check /></span>
            </div>
            <h3>Selesai & Tercatat</h3>
            <p>
              Perbaikan selesai di lokasi. Sertifikat digital dengan jumlah CO₂ yang dihindari
              tersimpan di profilmu, siap untuk laporan dampak.
            </p>
            <div className="step3-vis">
              <div className="row"><span>status</span><span className="v green">repaired</span></div>
              <div className="row"><span>CO₂e saved</span><span className="v green">−71.4 kg</span></div>
              <div className="row"><span>certificate</span><span className="v">issued</span></div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
