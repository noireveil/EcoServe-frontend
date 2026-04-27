"use client"
import Link from "next/link"
import { PhoneMockup } from "@/components/section/phone-mockup"

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

export function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">
            <span className="pip">#1</span>
            Platform E-Waste Indonesia
          </div>
          <h1>
            Perangkat Rusak?<br />
            <span className="serif">Jangan Dibuang.</span><br />
            Perbaiki.
          </h1>
          <p className="hero-sub">
            EcoServe menghubungkan kamu dengan <strong>teknisi terverifikasi terdekat.</strong>{' '}
            Lacak perbaikan secara real-time, dan ukur dampak karbon nyata dari setiap perbaikan, langsung di lokasimu.
          </p>
          <div className="hero-cta">
            <Link href="/auth" className="btn btn-green">
              Laporkan Kerusakan
            </Link>
            <Link href="/auth" className="btn btn-outline">
              Jadi Teknisi
            </Link>
          </div>
          <div className="hero-trust">
            <div className="avatars">
              <span className="a">A</span>
              <span className="a b">B</span>
              <span className="a c">C</span>
              <span className="a">+</span>
            </div>
            <span>
              <strong style={{ color: 'var(--ink)' }}>2,400+</strong> perangkat sudah diperbaiki bulan ini
            </span>
          </div>
        </div>

        <div className="hero-art">
          <div className="blob" />
          <div className="ticket tl">
            <div className="icon" style={{ background: '#eaf9e0', color: '#5fc036' }}>
              <Icon.Spark size={18} />
            </div>
            <div>
              <div className="ticket-k">AI Diagnosis</div>
              <div className="ticket-v">Layar pecah · 2.1s</div>
            </div>
          </div>
          <div className="ticket br">
            <div className="icon" style={{ background: '#e1f7fb', color: '#0aa3bd' }}>
              <Icon.Pin size={18} />
            </div>
            <div>
              <div className="ticket-k">Teknisi terdekat</div>
              <div className="ticket-v">0.8 km · ETA 12 min</div>
            </div>
          </div>
          <PhoneMockup scale={1} style={{ position: 'relative', zIndex: 1 }} />
        </div>
      </div>
    </section>
  )
}
