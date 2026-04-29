"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import {
  Smartphone,
  Laptop,
  MapPin,
  X,
  Check,
  Wrench,
  User,
  ClipboardList,
  Map,
  DollarSign,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ToastNotification } from "@/components/ui/toast-notification"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/hooks/useAuth"
import { apiFetch } from "@/lib/api"
import Image from "next/image"
import type { Order } from "@/types"

export default function TechnicianDashboardPage() {
  const { user, isLoading: authLoading } = useAuth("technician")
  const router = useRouter()
  const { toasts, removeToast, toast } = useToast()
  const [isOnline, setIsOnline] = useState(false)
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false)
  const [declinedOrders, setDeclinedOrders] = useState<string[]>([])
  const [techTipIndex, setTechTipIndex] = useState(0)
  const [techTipVisible, setTechTipVisible] = useState(true)

  const { data: incomingRaw = [], mutate: mutateIncoming } = useSWR(
    "/api/orders/incoming",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  const { data: activeOrdersData = [] } = useSWR(
    "/api/orders/",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  const { data: earnings } = useSWR(
    "/api/technicians/earnings",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  )

  const { data: performance } = useSWR(
    "/api/technicians/performance",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  )

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await apiFetch("/api/technicians/availability")
        if (response.ok) {
          const data = await response.json()
          setIsOnline(data.data?.is_available ?? false)
        }
      } catch (err) {
        console.error("Failed to fetch availability:", err)
      }
    }
    fetchAvailability()
  }, [])

  useEffect(() => {
    if (!user?.ID) return
    const key = `declined_orders_${user.ID}`
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem(key) || "[]")
      setDeclinedOrders(stored)
    }
  }, [user])

  const incomingOrders = incomingRaw.filter((o: Order) => !declinedOrders.includes(o.ID))

  const activeOrders = activeOrdersData.filter((o: Order) =>
    o.Status === "PENDING" ||
    o.Status === "ACCEPTED" ||
    o.Status === "IN_PROGRESS"
  )

  const techTips = [
    { emoji: "📸", tip: "Selalu upload foto bukti servis yang jelas — pelanggan lebih percaya dan rating kamu meningkat!" },
    { emoji: "⚡", tip: "Respons cepat terhadap pesanan baru meningkatkan peluang kamu mendapat order lebih banyak." },
    { emoji: "🌱", tip: "Setiap perangkat yang kamu perbaiki menghemat puluhan kg CO₂ — kamu pahlawan lingkungan!" },
    { emoji: "💰", tip: "Pastikan biaya servis disepakati dengan pelanggan sebelum mulai — hindari dispute di akhir." },
    { emoji: "⭐", tip: "Teknisi dengan rating 4+ mendapat 3x lebih banyak order dari rekomendasi AI EcoServe." },
    { emoji: "🔧", tip: "Dokumentasikan spesialisasi kamu dengan baik — pelanggan lebih suka teknisi yang spesifik." },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setTechTipVisible(false)
      setTimeout(() => {
        setTechTipIndex((prev) => (prev + 1) % techTips.length)
        setTechTipVisible(true)
      }, 300)
    }, 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentTechTip = techTips[techTipIndex]

  const handleToggleAvailability = async (newState: boolean) => {
    setIsTogglingAvailability(true)
    try {
      const response = await apiFetch("/api/technicians/availability", {
        method: "PUT",
        body: JSON.stringify({ is_available: newState }),
      })
      if (response.ok) {
        setIsOnline(newState)
        toast.success(
          newState ? "You are now Online" : "You are now Offline",
          newState ? "You will receive incoming orders" : "You won't receive new orders"
        )
      } else {
        toast.error("Failed to update status", "Please try again")
      }
    } catch (err) {
      console.error("Toggle availability error:", err)
      toast.error("Failed to update status", "Please try again")
    } finally {
      setIsTogglingAvailability(false)
    }
  }

  const handleAccept = async (orderId: string) => {
    try {
      const response = await apiFetch(`/api/orders/${orderId}/accept`, {
        method: "PUT",
      })

      if (response.ok) {
        await mutateIncoming()
        toast.success("Order accepted!", "Navigate to customer location.")
      } else {
        const data = await response.json()
        console.error("Failed to accept:", data)
        toast.error("Failed to accept", "Please try again.")
      }
    } catch (err) {
      console.error("Accept error:", err)
      toast.error("Failed to accept", "Please try again.")
    }
  }

  const handleDecline = (orderId: string) => {
    const updated = [...declinedOrders, orderId]
    setDeclinedOrders(updated)

    if (typeof window !== "undefined" && user?.ID) {
      const key = `declined_orders_${user.ID}`
      localStorage.setItem(key, JSON.stringify(updated))
    }

    toast.warning("Order declined", "Order removed from your list.")
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <ToastNotification toasts={toasts} onRemove={removeToast} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-[280px_1fr_280px] lg:gap-6">

          {/* LEFT SIDEBAR - desktop only */}
          <aside className="hidden lg:block space-y-4">

            {/* Profile Card */}
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
              <div className="h-16" style={{ background: "linear-gradient(to right, #5cb83a, #4a9a2e)" }} />
              <div className="px-4 pb-4 -mt-8">
                <div className="w-16 h-16 rounded-full border-4 border-card bg-primary/20 flex items-center justify-center mb-2">
                  {user?.ProfilePictureURL ? (
                    <Image
                      src={user.ProfilePictureURL}
                      alt={user?.FullName || "Profile"}
                      width={64}
                      height={64}
                      unoptimized
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {user?.FullName?.charAt(0) || "T"}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground">
                  {user?.FullName || "Technician"}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">
                  EcoServe Technician
                </p>
                <p className="text-xs text-yellow-400 mb-3">
                  {"⭐".repeat(Math.min(Math.round(performance?.rating || 0), 5))}
                  {" "}{performance?.rating > 0
                    ? `${performance.rating}★`
                    : "New Technician"}
                </p>
                <div className="border-t border-border/50 pt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total Repairs</span>
                    <span className="font-semibold text-foreground">
                      {performance?.total_repairs || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">CO₂ Saved</span>
                    <span className="font-semibold" style={{ color: "#7ed957" }}>
                      {performance?.co2_saved_kg?.toFixed(1) || 0} kg
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Status
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {isOnline ? "Online" : "Offline"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isOnline ? "Menerima pesanan baru" : "Tidak menerima pesanan"}
                  </p>
                </div>
                <div
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    isTogglingAvailability ? "opacity-50" : ""
                  } ${isOnline ? "bg-primary" : "bg-muted"}`}
                  onClick={() => !isTogglingAvailability && handleToggleAvailability(!isOnline)}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      isOnline ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
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
                  { label: "My Orders", href: "/technician/orders", icon: ClipboardList },
                  { label: "Map", href: "/technician/map", icon: Map },
                  { label: "Earnings", href: "/technician/earnings", icon: DollarSign },
                  { label: "Profile", href: "/technician/profile", icon: User },
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

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  Welcome, {user?.FullName?.split(" ")[0] || "Technician"}
                  <Wrench className="w-5 h-5 text-primary" />
                </h1>
                <p className="text-sm text-muted-foreground">
                  You have {incomingOrders.length} new orders
                </p>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                Welcome, {user?.FullName?.split(" ")[0] || "Technician"}
                <Wrench className="w-5 h-5 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground">
                You have {incomingOrders.length} new orders
              </p>
            </div>

            {/* Incoming Orders Section */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Incoming Orders
              </h2>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {incomingOrders.map((order: Order) => (
                    <motion.div
                      key={order.ID}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="bg-card border-border/50 overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                              <Smartphone className="w-5 h-5 text-primary" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold text-foreground">
                                    {order.DeviceCategory}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {order.ProblemDescription}
                                  </p>
                                </div>
                                <span className="text-primary font-semibold text-sm whitespace-nowrap">
                                  -
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mt-2">
                                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {order.Customer?.FullName || "Unknown"}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="bg-primary/10 text-primary border-0 text-xs"
                                >
                                  -
                                </Badge>
                              </div>

                              <div className="flex gap-2 mt-3 w-full">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 min-w-0 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive px-2 sm:px-4"
                                  onClick={() => handleDecline(order.ID)}
                                >
                                  <X className="w-4 h-4 sm:mr-1" />
                                  <span className="hidden sm:inline">Decline</span>
                                </Button>
                                <Button
                                  size="sm"
                                  className="flex-1 min-w-0 bg-primary hover:bg-primary/90 text-primary-foreground px-2 sm:px-4"
                                  onClick={() => handleAccept(order.ID)}
                                >
                                  <Check className="w-4 h-4 sm:mr-1" />
                                  <span className="hidden sm:inline">Accept</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {incomingOrders.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No incoming orders</p>
                  </motion.div>
                )}
              </div>
            </section>

            {/* Active Order Section */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Active Order
              </h2>
              {activeOrders.length > 0 ? (
                <div className="space-y-3">
                  {activeOrders.map((order: Order) => (
                    <Card key={order.ID} className="bg-card border-border/50 overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                              <Laptop className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {order.DeviceCategory}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {order.ProblemDescription}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-blue-500/10 text-blue-400 border-0">
                            {order.Status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-4 text-sm">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {order.Customer?.FullName || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              📍 {order.CustomerLatitude && order.CustomerLongitude
                                ? `${order.CustomerLatitude.toFixed(4)}, ${order.CustomerLongitude.toFixed(4)}`
                                : "Location not available"}
                            </p>
                          </div>
                        </div>

                        {order.Status === "PENDING" && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleAccept(order.ID)}
                              className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                            >
                              Accept Order
                            </button>
                            <button
                              onClick={() => handleDecline(order.ID)}
                              className="flex-1 px-3 py-2 rounded-lg border border-destructive/50 text-destructive text-sm"
                            >
                              Decline
                            </button>
                          </div>
                        )}

                        {(order.Status === "ACCEPTED" || order.Status === "IN_PROGRESS") && (
                          <button
                            onClick={() => router.push(
                              `/technician/map?lat=${order.CustomerLatitude}&lng=${order.CustomerLongitude}&orderId=${order.ID}`
                            )}
                            className="w-full mt-3 py-2 rounded-lg border border-primary/50 text-primary text-sm"
                          >
                            GPS Navigate
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-border/50 overflow-hidden">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">No active orders</p>
                  </CardContent>
                </Card>
              )}
            </section>

          </main>

          {/* RIGHT SIDEBAR - desktop only */}
          <aside className="hidden lg:block space-y-4">

            {/* Earnings Summary */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Earnings
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-semibold" style={{ color: "#7ed957" }}>
                    Rp {(earnings?.this_month_earnings || 0).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold text-foreground">
                    Rp {(earnings?.total_earnings || 0).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Completed Jobs</span>
                  <span className="font-semibold text-foreground">
                    {earnings?.total_completed || 0}
                  </span>
                </div>
              </div>
              <Link
                href="/technician/earnings"
                className="mt-3 flex items-center justify-center w-full py-2 rounded-lg border border-primary/50 text-primary text-xs font-medium hover:bg-primary/10 transition-colors"
              >
                View Details →
              </Link>
            </div>

            {/* Your Impact */}
            <div className="rounded-xl p-4 text-white" style={{ background: "linear-gradient(to bottom right, #5cb83a, #4a9a2e)" }}>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.85)" }}>
                Your Impact
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span style={{ color: "rgba(255,255,255,0.85)" }}>CO₂ Saved</span>
                  <span className="font-bold">
                    {performance?.co2_saved_kg?.toFixed(1) || 0} kg
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: "rgba(255,255,255,0.85)" }}>Devices Repaired</span>
                  <span className="font-bold">
                    {performance?.total_repairs || 0}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: "rgba(255,255,255,0.85)" }}>Rating</span>
                  <span className="font-bold">
                    {performance?.rating > 0 ? `${performance.rating}★` : "New"}
                  </span>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Pro Tips
                </span>
                <div className="flex gap-1 ml-auto">
                  {techTips.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        idx === techTipIndex ? "bg-primary" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className={`transition-opacity duration-300 ${techTipVisible ? "opacity-100" : "opacity-0"}`}>
                <span className="text-2xl mb-2 block">{currentTechTip.emoji}</span>
                <p className="text-sm text-foreground leading-relaxed">{currentTechTip.tip}</p>
              </div>

              <div className="flex justify-center gap-2 mt-3">
                <button
                  onClick={() => {
                    setTechTipVisible(false)
                    setTimeout(() => {
                      setTechTipIndex((prev) => (prev === 0 ? techTips.length - 1 : prev - 1))
                      setTechTipVisible(true)
                    }, 300)
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ←
                </button>
                <span className="text-xs text-muted-foreground">
                  {techTipIndex + 1} / {techTips.length}
                </span>
                <button
                  onClick={() => {
                    setTechTipVisible(false)
                    setTimeout(() => {
                      setTechTipIndex((prev) => (prev + 1) % techTips.length)
                      setTechTipVisible(true)
                    }, 300)
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  →
                </button>
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  )
}
