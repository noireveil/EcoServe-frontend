"use client"
import Link from "next/link"

const Icon = {
  Check: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  ),
};

export function DualCtaSection() {
  return (
     <section className="dual" id="technician">
      <div className="container">
        <span className="section-label">Untuk Semua</span>
        <h2 style={{ fontSize: 'clamp(32px, 4.4vw, 52px)', letterSpacing: '-0.03em', fontWeight: 800, lineHeight: 1.05, margin: '16px 0 48px', maxWidth: '20ch' }}>
          Satu platform, dua peran.
        </h2>

        <div className="dual-grid">
          <div className="dual-card left">
            <span className="role-tag">Untuk Pengguna</span>
            <h3>Perbaiki perangkat, kurangi jejak karbon</h3>
            <p>
              Temukan teknisi terpercaya terdekat, lacak perbaikan secara real-time,
              dan lihat dampak lingkungan dari setiap perbaikan
            </p>
            <ul className="dual-list">
              <li><span className="check"><Icon.Check size={12} /></span> Diagnosis AI gratis dalam detik</li>
              <li><span className="check"><Icon.Check size={12} /></span> Harga transparan sebelum perbaikan</li>
              <li><span className="check"><Icon.Check size={12} /></span> Garansi 30 hari + sertifikat dampak</li>
            </ul>
            <div className="btn-row">
              <Link href="/auth" className="btn btn-green">Minta Perbaikan <span className="arrow">→</span></Link>
            </div>
          </div>

          <div className="dual-card right">
            <span className="role-tag">Untuk Teknisi</span>
            <h3>Raih penghasilan lebih, dampak lebih besar.</h3>
            <p>
              Bergabunglah dengan jaringan teknisi EcoServe dan dapatkan akses ke ribuan order
              perbaikan di sekitarmu setiap harinya.
            </p>
            <ul className="dual-list">
              <li><span className="check"><Icon.Check size={12} /></span> Jam kerja fleksibel kamu yang atur</li>
              <li><span className="check"><Icon.Check size={12} /></span> 90% pendapatan langsung ke kantongmu</li>
              <li><span className="check"><Icon.Check size={12} /></span> Lebih banyak pelanggan via GPS matching</li>
            </ul>
            <div className="btn-row">
              <Link href="/auth" className="btn btn-primary" style={{ background: 'var(--aqua-deep)' }}>
                Daftar Jadi Teknisi <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
