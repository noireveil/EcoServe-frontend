"use client"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    // <footer className="foot">
    //   <div className="container">
    //     <div className="foot-top">
    //       <div>
    //         <Link href="/" className="brand">
    //           <span className="brand-leaf">
    //             <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    //               <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.8 2c1 5 .5 10-2.4 14a7 7 0 0 1-6.4 4Z"/>
    //               <path d="M2 22s.5-3.5 4-7"/>
    //             </svg>
    //           </span>
    //           EcoServe
    //         </Link>
    //         <p className="foot-tag">Repair. Reduce.<br />Reimagine.</p>
    //       </div>
    //       <div className="foot-cols">
    //         <div className="foot-col">
    //           <h6>Platform</h6>
    //           <Link href="/auth">Consumer App</Link>
    //           <Link href="/auth?role=technician">Technician App</Link>
    //           <Link href="#features">AI Diagnosis</Link>
    //           <Link href="#how-it-works">How It Works</Link>
    //         </div>
    //         <div className="foot-col">
    //           <h6>Company</h6>
    //           <Link href="#impact">Impact</Link>
    //           <Link href="mailto:hello@ecoserve.id">Contact</Link>
    //           <Link href="#">Privacy Policy</Link>
    //         </div>
    //       </div>
    //     </div>
        
    //   </div>
    // </footer>
    <footer className="foot">
      <div className="container">
        <div className="foot-top">
          <div>
            <a href="#" className="brand" style={{ fontSize: 19 }}>
              <Image src="/icons/logo.png" alt="EcoServe" width={28} height={28} className="object-contain" />
              EcoServe
            </a>
            <p className="foot-tag">
              Digitizing the circular economy
            </p>
          </div>
          <div className="foot-col">
            <h6>Platform</h6>
            <a href="#">Diagnosis AI</a>
            <a href="#">GPS Routing</a>
            <a href="#">Impact Tracking</a>
            <a href="#">Interactive Dashboard</a>
          </div>
          <div className="foot-col">
            <h6>Perusahaan</h6>
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="foot-bot">
          <span>© 2026 EcoServe. Built for I/O Festival 2026 — BEM FTI Untar.</span>
          <div className="foot-social">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
