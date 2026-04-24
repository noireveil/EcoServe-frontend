"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BottomNav } from "@/components/ui/bottom-nav"
import { Home, Smartphone, ShoppingBag, User, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

const consumerNavItems = [
  { label: "Home", href: "/consumer/dashboard", icon: Home },
  { label: "Devices", href: "/consumer/devices", icon: Smartphone },
  { label: "Orders", href: "/consumer/orders", icon: ShoppingBag },
  { label: "Profile", href: "/consumer/profile", icon: User },
]

function DesktopTopNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      {/* Logo - left */}
      <div className="flex-1">
        <Link href="/consumer/dashboard" className="flex items-center gap-2 w-fit">
          <Leaf className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">EcoServe</span>
        </Link>
      </div>

      {/* Menu - center */}
      <div className="flex items-center gap-6">
        {consumerNavItems.map((item) => (
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
        <Link href="/consumer/profile">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
        </Link>
      </div>
    </nav>
  )
}

export function ConsumerTopNav() {
  return <DesktopTopNav />
}

export function ConsumerBottomNav() {
  return <BottomNav items={consumerNavItems} />
}
