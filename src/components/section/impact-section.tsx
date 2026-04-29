"use client"
import Link from "next/link"

export function ImpactSection() {
  return (
    <section className="impact" id="impact">
      <div className="container impact-inner">
        <span className="section-label">Dampak Bersama</span>
        <h2>
          Bersama, kita bangun <span className="serif">ekonomi sirkular</span> Indonesia.
        </h2>
        <p className="impact-sub">
          Setiap perbaikan yang dilakukan di EcoServe mengurangi e-waste dan emisi karbon. 
          Ini adalah dampak nyata kita hingga hari ini.
        </p>

        <div className="impact-row">
          <div className="impact-card">
            <div className="num">12,400<small>kg</small></div>
            <div className="name">CO₂ Diselamatkan</div>
            <div className="delta">↑ +34% dari bulan lalu</div>
          </div>
          <div className="impact-card">
            <div className="num">1,406</div>
            <div className="name">Perangkat Diperbaiki</div>
            <div className="delta">↑ +186 minggu ini</div>
          </div>
          <div className="impact-card">
            <div className="num">214</div>
            <div className="name">Teknisi Aktif</div>
            <div className="delta">Di 15 kota di Indonesia</div>
          </div>
        </div>

        <div className="impact-foot">
          <p className="quote-line">
            &ldquo;Setiap perangkat yang diperbaiki adalah satu langkah menuju masa depan
            yang lebih berkelanjutan.&rdquo;
          </p>
          <Link href="/auth" className="btn btn-primary">
            Bergabung sekarang<span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
