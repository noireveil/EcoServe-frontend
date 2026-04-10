"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Home,
  Smartphone,
  ClipboardList,
  User,
  Leaf,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/consumer/dashboard", icon: Home, label: "Home" },
  { href: "/consumer/devices", icon: Smartphone, label: "Devices" },
  { href: "/consumer/orders", icon: ClipboardList, label: "Orders" },
  { href: "/consumer/profile", icon: User, label: "Profile" },
]

// Mobile: Bottom fixed navigation bar
function MobileBottomNav() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative flex flex-col items-center gap-1 px-4 py-2 transition-colors",
              isActive(tab.href) ? "text-primary" : "text-muted-foreground"
            )}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{tab.label}</span>
            {isActive(tab.href) && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-primary"
              />
            )}
          </Link>
        ))}
      </div>
    </nav>
  )
}

// Desktop: Top horizontal navbar
function DesktopTopNav() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 hidden h-16 items-center justify-between border-b border-border/50 bg-card/95 backdrop-blur-lg px-6 md:flex">
      {/* Logo */}
      <Link href="/consumer/dashboard" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold">EcoServe</span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-1">
        {navItems.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              isActive(tab.href)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {isActive(tab.href) && (
              <motion.div
                layout
                className="absolute -bottom-3 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary"
              />
            )}
          </Link>
        ))}
      </div>

      {/* Profile Button */}
      <Link
        href="/consumer/profile"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-secondary transition-colors hover:border-primary/50",
          isActive("/consumer/profile") && "border-primary/50 bg-primary/10"
        )}
      >
        <User className="h-4 w-4 text-foreground" />
      </Link>
    </nav>
  )
}

// Main component with both mobile and desktop
export function BottomNav() {
  return (
    <>
      <DesktopTopNav />
      <MobileBottomNav />
    </>
  )
}
