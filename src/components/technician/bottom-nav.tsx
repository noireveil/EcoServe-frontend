"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { BottomNav } from "@/components/ui/bottom-nav"
import { Home, ClipboardList, Map, DollarSign, User } from "lucide-react"
import { cn } from "@/lib/utils"

const technicianNavItems = [
  { label: "Home", href: "/technician/dashboard", icon: Home },
  { label: "Orders", href: "/technician/orders", icon: ClipboardList },
  { label: "Map", href: "/technician/map", icon: Map },
  { label: "Earnings", href: "/technician/earnings", icon: DollarSign },
  { label: "Profile", href: "/technician/profile", icon: User },
]

function DesktopTopNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      {/* Logo - left */}
      <div className="flex-1">
        <Link href="/technician/dashboard" className="flex items-center gap-2 w-fit">
          <Image src="/icons/logo.png" alt="EcoServe" width={28} height={28} className="object-contain" />
          <span className="font-bold text-lg">EcoServe</span>
        </Link>
      </div>

      {/* Menu - center */}
      <div className="flex items-center gap-6">
        {technicianNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right - profile avatar */}
      <div className="flex-1 flex justify-end">
        <Link href="/technician/profile">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
        </Link>
      </div>
    </nav>
  )
}

export function TechnicianTopNav() {
  return <DesktopTopNav />
}

export function TechnicianBottomNav() {
  return <BottomNav items={technicianNavItems} />
}
