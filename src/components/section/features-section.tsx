"use client"

export function FeaturesSection() {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="features-head">
          <div className="section-label aqua">Platform</div>
          <h2>Semua yang kamu butuhkan, dalam <br />
            <span className="serif">satu aplikasi.</span>
          </h2>
          <p>Dari diagnosis AI hingga geolokasi real-time, EcoServe memiliki semua fitur untuk membuat perbaikan jadi mudah dan transparan.</p>
        </div>
        <div className="feat-grid">
          <article className="feat">
            <span className="feat-accent" />
            <span className="feat-tag">A · DIAGNOSIS</span>
            <h3>AI Diagnosis</h3>
            <p>
              Gemini AI menganalisis kerusakan dari foto dalam detik lalu mengklasifikasi tipe
              kerusakan, memperkirakan biaya, dan memprediksi waktu perbaikan.
            </p>
            <div className="feat-pic">
              <div className="chip-row">
                <span className="chip green">Multimodal</span>
                <span className="chip">Bilingual ID/EN</span>
                <span className="chip">&lt; 2.4s latency</span>
              </div>
              <div className="chip-row">
                <span className="chip">94.1% accuracy</span>
                <span className="chip green">Powered by Gemini</span>
              </div>
            </div>
          </article>

          <article className="feat">
            <span className="feat-accent" />
            <span className="feat-tag">B · ROUTING</span>
            <h3>GPS Routing</h3>
            <p>
              Teknisi terdekat datang ke lokasi kamu, dengan navigasi real-time. Lihat profil,
              rating, ETA, dan harga sebelum konfirmasi.
            </p>
            <div className="feat-pic">
              <div className="chip-row">
                <span className="chip aqua">Real-time</span>
                <span className="chip">214 teknisi aktif</span>
                <span className="chip">Avg ETA 12 min</span>
              </div>
              <div className="chip-row">
                <span className="chip aqua">Live tracking</span>
                <span className="chip">Electric fleet</span>
              </div>
            </div>
          </article>

          <article className="feat">
            <span className="feat-accent" />
            <span className="feat-tag">C · IMPACT</span>
            <h3>EPA WARM Tracking</h3>
            <p>
              Setiap perbaikan tercatat dampak lingkungannya secara ilmiah menggunakan EPA Waste
              Reduction Model bukan sekadar klaim, tapi data yang dapat diaudit.
            </p>
            <div className="feat-pic">
              <div className="chip-row">
                <span className="chip green">EPA WARM v15</span>
                <span className="chip aqua">ESG-ready</span>
                <span className="chip">Audit-grade</span>
              </div>
              <div className="chip-row">
                <span className="chip">kg CO₂e</span>
                <span className="chip">L water saved</span>
                <span className="chip">Digital cert.</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
