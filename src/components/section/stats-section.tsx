"use client"

export function StatsSection() {
  return (
    <section className="problem">
      <div className="container">
        <span className="section-label">Masalahnya</span>
        <p className="quote">
          Setiap tahun, Indonesia menghasilkan{' '}
          <span className="hl">2,4 juta ton</span> e-waste.<br />
          Sebagian besar berakhir di <span className="strike">tempat sampah</span>.
        </p>
        <div className="quote-attr">
          <span className="dot" />
          <span>Sumber: Global E-Waste Monitor 2024</span>
        </div>

        <div className="stat-cards">
          <div className="stat-card green">
            <div className="ribbon">Global</div>
            <div className="num">53<small>JT TON</small></div>
            <div className="name">E-waste global per tahun</div>
            <div className="desc">Setara dengan 350 kapal pesiar terbesar di dunia.</div>
            <div className="bar"><span style={{ width: '100%' }} /></div>
          </div>
          <div className="stat-card aqua">
            <div className="ribbon">Daur ulang</div>
            <div className="num">20<small>%</small></div>
            <div className="name">Hanya 20% didaur ulang</div>
            <div className="desc">Sisanya berakhir di TPA, mencemari tanah & air tanah.</div>
            <div className="bar"><span style={{ width: '20%' }} /></div>
          </div>
          <div className="stat-card">
            <div className="ribbon">Per device</div>
            <div className="num">70<small>KG CO₂</small></div>
            <div className="name">Memproduksi smartphone baru</div>
            <div className="desc">Memperbaiki 1 perangkat menyelamatkan setara emisi 280 km berkendara.</div>
            <div className="bar"><span style={{ width: '70%', background: '#0D1117' }} /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
