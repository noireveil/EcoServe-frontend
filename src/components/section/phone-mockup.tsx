"use client"
import Link from "next/link"

export function PhoneMockup({ scale = 1, style = {} }: {
  scale?: number
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        width: 320 * scale,
        height: 660 * scale,
        position: 'relative',
        ...style,
      }}
    >
      {/* Outer frame */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#0D1117',
          borderRadius: 48 * scale,
          padding: 8 * scale,
          boxShadow:
            '0 60px 120px -30px rgba(13,17,23,0.35), 0 30px 60px -20px rgba(13,17,23,0.25), inset 0 0 0 1.5px rgba(255,255,255,0.08)',
        }}
      >
        {/* Screen */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#F8FFFE',
            borderRadius: 40 * scale,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Dynamic island */}
          <div
            style={{
              position: 'absolute',
              top: 10 * scale,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 100 * scale,
              height: 28 * scale,
              background: '#0D1117',
              borderRadius: 999,
              zIndex: 10,
            }}
          />
          {/* Status bar */}
          <div
            style={{
              padding: `${14 * scale}px ${24 * scale}px ${4 * scale}px`,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13 * scale,
              fontWeight: 600,
              color: '#0D1117',
            }}
          >
            <span>9:41</span>
            <span style={{ display: 'inline-flex', gap: 4 * scale, alignItems: 'center' }}>
              <span>●●●</span>
              <span>📶</span>
              <span>🔋</span>
            </span>
          </div>

          {/* App content */}
          <div style={{ flex: 1, padding: `${30 * scale}px ${20 * scale}px ${20 * scale}px`, display: 'flex', flexDirection: 'column', gap: 16 * scale }}>
            {/* Top — greeting */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12 * scale, color: '#6B7280', fontWeight: 500 }}>
                  Selamat siang,
                </div>
                <div style={{ fontSize: 18 * scale, fontWeight: 800, letterSpacing: -0.3 }}>
                  Andra 👋
                </div>
              </div>
              <div
                style={{
                  width: 38 * scale,
                  height: 38 * scale,
                  borderRadius: '50%',
                  background: '#eaf9e0',
                  border: '1.5px solid #7ed957',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 14 * scale,
                  fontWeight: 800,
                  color: '#5fc036',
                }}
              >
                A
              </div>
            </div>

            {/* CTA card */}
            <div
              style={{
                background: 'linear-gradient(140deg, #7ed957 0%, #6ec849 100%)',
                borderRadius: 20 * scale,
                padding: 18 * scale,
                color: '#0D1117',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: 11 * scale, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase' }}>
                LAPOR KERUSAKAN
              </div>
              <div style={{ fontSize: 22 * scale, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.1, marginTop: 6 * scale }}>
                Foto perangkatmu.
                <br />
                AI siap bantu.
              </div>
              <Link
                href="/auth"
                style={{
                  marginTop: 14 * scale,
                  background: '#0D1117',
                  color: '#fff',
                  display: 'inline-flex',
                  padding: `${8 * scale}px ${14 * scale}px`,
                  borderRadius: 999,
                  fontSize: 12 * scale,
                  fontWeight: 700,
                  alignItems: 'center',
                  gap: 6 * scale,
                  textDecoration: 'none',
                }}
              >
                Mulai Diagnosis →
              </Link>
              <div
                style={{
                  position: 'absolute',
                  right: -20 * scale,
                  top: -20 * scale,
                  width: 90 * scale,
                  height: 90 * scale,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.18)',
                }}
              />
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 * scale }}>
              <div
                style={{
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14 * scale,
                  padding: 12 * scale,
                }}
              >
                <div style={{ fontSize: 10.5 * scale, color: '#6B7280', fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
                  CO₂ Saved
                </div>
                <div style={{ fontSize: 22 * scale, fontWeight: 800, color: '#5fc036', letterSpacing: -0.5, marginTop: 2 * scale }}>
                  142<span style={{ fontSize: 11 * scale, color: '#6B7280', marginLeft: 2 * scale }}>kg</span>
                </div>
                <div style={{ fontSize: 10.5 * scale, color: '#6B7280', marginTop: 2 * scale }}>
                  ↑ 28% bulan ini
                </div>
              </div>
              <div
                style={{
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14 * scale,
                  padding: 12 * scale,
                }}
              >
                <div style={{ fontSize: 10.5 * scale, color: '#6B7280', fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
                  Repaired
                </div>
                <div style={{ fontSize: 22 * scale, fontWeight: 800, color: '#0aa3bd', letterSpacing: -0.5, marginTop: 2 * scale }}>
                  3<span style={{ fontSize: 11 * scale, color: '#6B7280', marginLeft: 4 * scale }}>devices</span>
                </div>
                <div style={{ fontSize: 10.5 * scale, color: '#6B7280', marginTop: 2 * scale }}>
                  iPhone, laptop, fan
                </div>
              </div>
            </div>

            {/* Active repair */}
            <div
              style={{
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: 16 * scale,
                padding: 14 * scale,
                display: 'flex',
                gap: 12 * scale,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 44 * scale,
                  height: 44 * scale,
                  borderRadius: 12 * scale,
                  background: '#e1f7fb',
                  color: '#0aa3bd',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 18 * scale,
                  flexShrink: 0,
                }}
              >
                📱
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13 * scale, fontWeight: 700 }}>iPhone 13 — LCD</div>
                  <div
                    style={{
                      fontSize: 10 * scale,
                      fontWeight: 700,
                      color: '#0aa3bd',
                      background: '#e1f7fb',
                      padding: `${3 * scale}px ${7 * scale}px`,
                      borderRadius: 999,
                      letterSpacing: 0.6,
                      textTransform: 'uppercase',
                    }}
                  >
                    En route
                  </div>
                </div>
                <div style={{ fontSize: 11 * scale, color: '#6B7280', marginTop: 2 * scale }}>
                  Budi S. — 0.8 km · ETA 12 min
                </div>
                <div
                  style={{
                    marginTop: 8 * scale,
                    height: 4 * scale,
                    background: '#EEF1F4',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '62%',
                      height: '100%',
                      background: '#0cc0df',
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div
              style={{
                marginTop: 'auto',
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: 999,
                padding: `${8 * scale}px ${10 * scale}px`,
                display: 'flex',
                justifyContent: 'space-around',
                fontSize: 18 * scale,
              }}
            >
              <span style={{ background: '#7ed957', borderRadius: 999, padding: `${6 * scale}px ${12 * scale}px`, color: '#0D1117', fontSize: 12 * scale, fontWeight: 700 }}>● Home</span>
              <span style={{ color: '#9aa1ac', fontSize: 16 * scale, padding: `${6 * scale}px ${10 * scale}px` }}>📍</span>
              <span style={{ color: '#9aa1ac', fontSize: 16 * scale, padding: `${6 * scale}px ${10 * scale}px` }}>🌱</span>
              <span style={{ color: '#9aa1ac', fontSize: 16 * scale, padding: `${6 * scale}px ${10 * scale}px` }}>👤</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
