"use client"
import Link from "next/link"
import Image from "next/image"

const navLinks = [
  { href: "#howto", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#impact", label: "Impact" },
  { href: "#technician", label: "Join Us" },
]

export function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <Image src="/icons/logo.png" alt="EcoServe" width={32} height={32} priority className="object-contain" />
          EcoServe
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </nav>
        <Link href="/auth" className="nav-cta">
          Get Started
        </Link>
      </div>
    </header>
  )
}
