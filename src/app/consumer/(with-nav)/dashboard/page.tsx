"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { apiFetch } from "@/lib/api"
import { useRateLimit } from "@/hooks/useRateLimit"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/context/LanguageContext"
import { t } from "@/lib/i18n"
import { RateLimitAlert } from "@/components/ui/rate-limit-alert"
import { getCachedOrders, setCachedOrders } from "@/lib/auth-cache"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ConsumerDashboard() {
  const { user, isLoading: authLoading } = useAuth("customer")
  const { lang } = useLanguage()
  const [orders, setOrders] = useState<any[]>([])
  const { isLimited, countdown, triggerLimit } = useRateLimit()

  const quickActions = [
    { id: "report", label: t(lang, "reportDamage"), href: "/consumer/report-damage", icon: AlertTriangle, color: "bg-emerald-500/20 text-emerald-400" },
    { id: "garage", label: t(lang, "myGarage"), href: "/consumer/devices", icon: Warehouse, color: "bg-blue-500/20 text-blue-400" },
    { id: "track", label: t(lang, "trackOrder"), href: "/consumer/orders", icon: MapPin, color: "bg-orange-500/20 text-orange-400" },
    { id: "ai", label: t(lang, "aiDiagnosis"), href: "/consumer/ai-diagnosis", icon: Sparkles, color: "bg-purple-500/20 text-purple-400" },
  ]

  useEffect(() => {
    const fetchOrders = async () => {
      // Cek cache dulu
      const cached = getCachedOrders()
      if (cached) {
        setOrders(cached)
        return
      }

      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const response = await apiFetch("/api/orders/")
        if (response.ok) {
          const data = await response.json()
          const ordersData = data.data || []
          setCachedOrders(ordersData)
          setOrders(ordersData)
        }
      } catch (err: any) {
        if (err?.type === "RATE_LIMITED") {
          triggerLimit(err.seconds || 60)
        }
      }
    }
    fetchOrders()
  }, [])

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

  // Derived data from orders
  const activeByCategory = orders
    .filter(o => o.Status === "PENDING" || o.Status === "IN_PROGRESS")
    .reduce((acc: any[], order) => {
      const alreadyHas = acc.find(o => o.DeviceCategory === order.DeviceCategory)
      if (!alreadyHas) {
        acc.push(order)
      }
      return acc
    }, [])

  const completedOrders = orders.filter(o =>
    o.Status === "COMPLETED"
  )

  const totalCO2 = completedOrders.reduce((sum, o) => sum + (o.EWasteSavedKg || 0), 0)
  const totalRepairs = completedOrders.length

  return (
    <div className="relative min-h-screen bg-background pb-10">
      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <main className="px-4 py-6 md:pt-5">
          <RateLimitAlert isLimited={isLimited} countdown={countdown} />

          {/* Top Header */}
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {authLoading
                  ? "Hello... 👋"
                  : `Hello, ${getNickname(user?.FullName || user?.fullName || user?.full_name || "")} 👋`
                }
              </h1>
              <p className="text-sm text-muted-foreground">{t(lang, "welcomeBack")}</p>
            </div>
            {/* <button className="relative rounded-full bg-secondary p-2.5 transition-colors hover:bg-secondary/80">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
            </button> */}
          </header>

          {/* Impact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-6 overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 to-emerald-800 p-5"
          >
            {/* Leaf pattern background */}
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
                <Leaf className="h-4 w-4 text-emerald-200" />
                <span className="text-sm font-medium text-emerald-100">{t(lang, "yourEcoImpact")}</span>
              </div>

              <div className="mb-4">
                <span className="text-4xl font-bold text-white">
                  {totalCO2.toFixed(1)} kg
                </span>
                <p className="text-sm text-emerald-100">{t(lang, "co2Avoided")}</p>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-white/20 p-1.5">
                    <Wrench className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {totalRepairs}
                    </p>
                    <p className="text-xs text-emerald-100">{t(lang, "repairs")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-white/20 p-1.5">
                    <Recycle className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{totalCO2.toFixed(1)} kg</p>
                    <p className="text-xs text-emerald-100">{t(lang, "eWasteSaved")}</p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-emerald-300"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <section className="mb-6">
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
              className="mb-6"
            >
              <div className="space-y-3">
                {activeByCategory.map((order) => (
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
                        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-xs font-semibold text-emerald-400">
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
              className="mb-6"
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
                completedOrders.slice(0, 3).map((order) => (
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
                      <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400">
                        Completed
                      </span>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(order.UpdatedAt).toLocaleDateString("id-ID")}
                      </p>
                      {order.EWasteSavedKg > 0 && (
                        <p className="text-xs text-emerald-400">
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
      </div>
    </div>
  )
}