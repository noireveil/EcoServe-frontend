"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { useRateLimit } from "@/hooks/useRateLimit"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/context/LanguageContext"
import { t } from "@/lib/i18n"
import { RateLimitAlert } from "@/components/ui/rate-limit-alert"
import { Badge } from "@/components/ui/badge"
import {
  Leaf,
  Wrench,
  Recycle,
  AlertTriangle,
  Warehouse,
  MapPin,
  Sparkles,
  ChevronRight,
  Smartphone,
  ShoppingBag,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ConsumerDashboard() {
  const { user, isLoading: authLoading } = useAuth("customer")
  const { lang } = useLanguage()
  const { data: orders } = useSWR(
    "/api/orders/",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  )
  const { isLimited, countdown } = useRateLimit()

  const ecoTips = [
    { emoji: "🔋", fact: "Memperbaiki smartphone dapat menghemat hingga 70kg CO₂ — setara menanam 3 pohon!" },
    { emoji: "♻️", fact: "E-waste adalah aliran sampah yang tumbuh paling cepat di dunia, mencapai 53 juta ton per tahun." },
    { emoji: "🌱", fact: "Setiap perbaikan yang kamu lakukan berkontribusi langsung pada ekonomi sirkular Indonesia." },
    { emoji: "💡", fact: "Produksi smartphone baru menghasilkan 70x lebih banyak CO₂ dibanding memperbaiki yang lama." },
    { emoji: "🌍", fact: "Hanya 20% e-waste global yang didaur ulang dengan benar. Kamu bisa jadi bagian dari solusi!" },
    { emoji: "⚡", fact: "Memperpanjang umur laptop 4 tahun menghemat energi setara 190kg batu bara." },
    { emoji: "🏆", fact: "Indonesia menghasilkan 2,4 juta ton e-waste per tahun. Repair, bukan buang!" },
  ]

  const [tipIndex, setTipIndex] = useState(0)
  const [tipVisible, setTipVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setTipVisible(false)
      setTimeout(() => {
        setTipIndex(prev => (prev + 1) % ecoTips.length)
        setTipVisible(true)
      }, 300)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const currentTip = ecoTips[tipIndex]

  const quickActions = [
    { id: "report", label: t(lang, "reportDamage"), href: "/consumer/report-damage", icon: AlertTriangle, color: "bg-[#7ed957]/20 text-[#5cb83a]" },
    { id: "garage", label: t(lang, "myGarage"), href: "/consumer/devices", icon: Warehouse, color: "bg-blue-500/20 text-blue-400" },
    { id: "track", label: t(lang, "trackOrder"), href: "/consumer/orders", icon: MapPin, color: "bg-orange-500/20 text-orange-400" },
    { id: "ai", label: t(lang, "aiDiagnosis"), href: "/consumer/ai-diagnosis", icon: Sparkles, color: "bg-purple-500/20 text-purple-400" },
  ]

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  const getNickname = (fullName: string) => {
    if (!fullName) return "there"
    const parts = fullName.trim().split(" ")
    if (parts.length >= 2) {
      const first = parts[0].toLowerCase()
      const islamicPrefixes = [
        "muhammad", "ahmad", "abdul", "siti",
        "nur", "dewi", "sri", "budi", "eko"
      ]
      if (islamicPrefixes.includes(first)) {
        return parts[1]
      }
    }
    return parts[0]
  }

  const activeByCategory = (orders || [])
    .filter((o: any) =>
      o.Status === "PENDING" ||
      o.Status === "ACCEPTED" ||
      o.Status === "IN_PROGRESS"
    )
    .reduce((acc: any[], order: any) => {
      const alreadyHas = acc.find(o => o.DeviceCategory === order.DeviceCategory)
      if (!alreadyHas) acc.push(order)
      return acc
    }, [])

  const completedOrders = (orders || []).filter(
    (o: any) => o.Status === "COMPLETED"
  )

  const totalCO2 = completedOrders.reduce((sum: number, o: any) => sum + (o.EWasteSavedKg || 0), 0)
  const totalRepairs = completedOrders.length

  return (
    <div className="min-h-screen bg-background lg:pb-0">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <RateLimitAlert isLimited={isLimited} countdown={countdown} />

        <div className="lg:grid lg:grid-cols-[280px_1fr_280px] lg:gap-6">

          {/* LEFT SIDEBAR - desktop only */}
          <aside className="hidden lg:block space-y-4">

            {/* Profile Card */}
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
              <div className="h-16" style={{ background: "linear-gradient(to right, #5cb83a, #4a9a2e)" }} />
              <div className="px-4 pb-4 -mt-8">
                <div className="w-16 h-16 rounded-full border-4 border-card bg-primary/20 flex items-center justify-center mb-2 overflow-hidden">
                  {user?.ProfilePictureURL ? (
                    <img
                      src={user.ProfilePictureURL}
                      alt={user.FullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {user?.FullName?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground">{user?.FullName || "User"}</h3>
                <p className="text-xs text-muted-foreground mb-3">EcoServe Customer</p>
                <div className="border-t border-border/50 pt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total Repairs</span>
                    <span className="font-semibold text-foreground">{completedOrders.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">CO₂ Avoided</span>
                    <span className="font-semibold" style={{ color: "#7ed957" }}>{totalCO2.toFixed(1)} kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Quick Access
              </h4>
              <div className="space-y-1">
                {[
                  { label: "My Devices", href: "/consumer/devices", icon: Smartphone },
                  { label: "My Orders", href: "/consumer/orders", icon: ShoppingBag },
                  { label: "AI Diagnosis", href: "/consumer/ai-diagnosis", icon: Sparkles },
                  { label: "Report Damage", href: "/consumer/report-damage", icon: AlertTriangle },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="space-y-6 min-w-0">

            {/* Greeting header */}
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {`Hello, ${getNickname(user?.FullName || user?.fullName || user?.full_name || "")} 👋`}
                </h1>
                <p className="text-sm text-muted-foreground">{t(lang, "welcomeBack")}</p>
              </div>
            </header>

            {/* Impact Card - mobile only, desktop has it in right sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden relative overflow-hidden rounded-2xl p-5"
              style={{ background: "linear-gradient(to bottom right, #5cb83a, #4a9a2e)" }}
            >
              <div className="absolute inset-0 opacity-10">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id="leafPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M10 0 Q15 5 10 10 Q5 5 10 0" fill="currentColor" className="text-white" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#leafPattern)" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="mb-1 flex items-center gap-2">
                  <Leaf className="h-4 w-4" style={{ color: "rgba(255,255,255,0.85)" }} />
                  <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>{t(lang, "yourEcoImpact")}</span>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    {totalCO2.toFixed(1)} kg
                  </span>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{t(lang, "co2Avoided")}</p>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-white/20 p-1.5">
                      <Wrench className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">{totalRepairs}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>{t(lang, "repairs")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-white/20 p-1.5">
                      <Recycle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">{totalCO2.toFixed(1)} kg</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>{t(lang, "eWasteSaved")}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full bg-[#7ed957]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <section>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Link href={action.href} key={action.id}>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-primary/50 hover:bg-card/80 w-full"
                    >
                      <div className={cn("rounded-xl p-3", action.color)}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{action.label}</span>
                    </motion.button>
                  </Link>
                ))}
              </div>
            </section>

            {/* Active Orders */}
            {activeByCategory.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="space-y-3">
                  {activeByCategory.map((order: any) => (
                    <div key={order.ID} className="rounded-xl border border-border/50 bg-card p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{t(lang, "activeOrder")}</h3>
                        <Badge className={cn(
                          "text-xs",
                          order.Status === "PENDING"
                            ? "bg-gray-500/20 text-gray-400"
                            : order.Status === "IN_PROGRESS"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        )}>
                          {order.Status}
                        </Badge>
                      </div>

                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-lg bg-secondary p-2">
                          <Smartphone className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{order.DeviceCategory}</p>
                          <p className="text-sm text-muted-foreground">{order.ProblemDescription}</p>
                        </div>
                      </div>

                      {order.Status === "PENDING" ? (
                        <p className="text-sm text-muted-foreground">
                          {t(lang, "waitingForTechnician")}
                        </p>
                      ) : order.Technician ? (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[#7ed957]/20 flex items-center justify-center">
                            <span className="text-xs font-semibold text-[#5cb83a]">
                              {order.Technician?.User?.FullName?.charAt(0) || "T"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {order.Technician?.User?.FullName || "Technician"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ⭐ {order.Technician?.Rating || "New"}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {activeByCategory.length === 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="rounded-xl border border-border/50 bg-card p-4">
                  <p className="text-sm text-muted-foreground">{t(lang, "noActiveOrders")}</p>
                </div>
              </motion.section>
            )}

            {/* Recent Repairs */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{t(lang, "recentRepairs")}</h3>
                <Link
                  href="/consumer/orders?tab=completed"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {t(lang, "seeAll")}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {completedOrders.length > 0 ? (
                  completedOrders.slice(0, 3).map((order: any) => (
                    <div key={order.ID} className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3">
                      <div className="rounded-lg bg-secondary p-2">
                        <Smartphone className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{order.DeviceCategory}</p>
                        <p className="text-xs text-muted-foreground">{order.ProblemDescription}</p>
                        {order.Technician?.User?.FullName && (
                          <p className="text-xs text-muted-foreground">
                            🔧 {order.Technician.User.FullName}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-[#7ed957]/20 text-[#5cb83a]">
                          Completed
                        </span>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(order.UpdatedAt).toLocaleDateString("id-ID")}
                        </p>
                        {order.EWasteSavedKg > 0 && (
                          <p className="text-xs text-[#5cb83a]">
                            🌱 {order.EWasteSavedKg.toFixed(1)} kg
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">{t(lang, "noRepairsYet")}</p>
                )}
              </div>
            </section>
          </main>

          {/* RIGHT SIDEBAR - desktop only */}
          <aside className="hidden lg:block space-y-4">

            {/* Eco Impact Card */}
            <div className="rounded-xl p-4 text-white" style={{ background: "linear-gradient(to bottom right, #5cb83a, #4a9a2e)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-4 h-4" />
                <h4 className="text-sm font-semibold">Your Eco Impact</h4>
              </div>
              <p className="text-3xl font-bold mb-1">{totalCO2.toFixed(1)} kg</p>
              <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.85)" }}>CO₂ Avoided</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold">{completedOrders.length}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>Repairs</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold">{totalCO2.toFixed(1)}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>kg E-waste</p>
                </div>
              </div>
            </div>

            {/* Did You Know? */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Did You Know?
                </span>
                <div className="flex gap-1 ml-auto">
                  {ecoTips.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        idx === tipIndex ? "bg-primary" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className={`transition-opacity duration-300 ${tipVisible ? "opacity-100" : "opacity-0"}`}>
                <span className="text-2xl mb-2 block">{currentTip.emoji}</span>
                <p className="text-sm text-foreground leading-relaxed">{currentTip.fact}</p>
              </div>

              <div className="flex justify-center gap-2 mt-3">
                <button
                  onClick={() => {
                    setTipVisible(false)
                    setTimeout(() => {
                      setTipIndex(prev => prev === 0 ? ecoTips.length - 1 : prev - 1)
                      setTipVisible(true)
                    }, 300)
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ←
                </button>
                <span className="text-xs text-muted-foreground">{tipIndex + 1} / {ecoTips.length}</span>
                <button
                  onClick={() => {
                    setTipVisible(false)
                    setTimeout(() => {
                      setTipIndex(prev => (prev + 1) % ecoTips.length)
                      setTipVisible(true)
                    }, 300)
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  →
                </button>
              </div>
            </div>

            {/* EcoServe branding */}
            <div className="rounded-xl border border-border/50 bg-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm">EcoServe</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Digitizing the circular economy for a sustainable future 🌍
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
