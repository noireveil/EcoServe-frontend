"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Smartphone,
  Laptop,
  MapPin,
  X,
  Check,
  Wrench,
  User,
  ClipboardList,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/hooks/useAuth"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function TechnicianDashboardPage() {
  const { user, isLoading: authLoading } = useAuth("technician")
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(true)
  const [incomingOrders, setIncomingOrders] = useState<any[]>([])
  const [declinedOrders, setDeclinedOrders] = useState<string[]>([])
  const [activeOrders, setActiveOrders] = useState<any[]>([])
  const [earnings, setEarnings] = useState<any>(null)

  useEffect(() => {
    if (!user?.ID) return

    const key = `declined_orders_${user.ID}`
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem(key) || "[]")
      setDeclinedOrders(stored)
    }
  }, [user])

  useEffect(() => {
    if (!user?.ID) return

    const fetchIncoming = async () => {
      try {
        const response = await apiFetch("/api/orders/incoming")
        if (response.ok) {
          const data = await response.json()
          const filtered = (data.data || []).filter(
            (o: any) => !declinedOrders.includes(o.ID)
          )
          setIncomingOrders(filtered)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchIncoming()
  }, [user, declinedOrders])

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const response = await apiFetch("/api/orders/")
        console.log("Active orders status:", response.status)
        const data = await response.json()
        console.log("Active orders data:", JSON.stringify(data, null, 2))
        const orders = data.data || []
        setActiveOrders(orders.filter((o: any) =>
          o.Status === "IN_PROGRESS" ||
          o.Status === "ACCEPTED" ||
          o.Status === "PENDING"
        ))
      } catch (err) {
        console.error("Failed to fetch active orders:", err)
      }
    }
    fetchActive()
  }, [])

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await apiFetch("/api/technicians/earnings")
        if (response.ok) {
          const data = await response.json()
          setEarnings(data.data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchEarnings()
  }, [])

  const handleAccept = async (orderId: string) => {
    try {
      const response = await apiFetch(`/api/orders/${orderId}/accept`, {
        method: "PUT",
      })

      if (response.ok) {
        setIncomingOrders(prev => prev.filter(o => o.ID !== orderId))
        const ordersResponse = await apiFetch("/api/orders/")
        if (ordersResponse.ok) {
          const data = await ordersResponse.json()
          setActiveOrders(data.data?.filter((o: any) =>
            o.Status === "IN_PROGRESS" ||
            o.Status === "ACCEPTED" ||
            o.Status === "PENDING"
          ) || [])
        }
      } else {
        const data = await response.json()
        console.error("Failed to accept:", data)
      }
    } catch (err) {
      console.error("Accept error:", err)
    }
  }

  const handleDecline = (orderId: string) => {
    const updated = [...declinedOrders, orderId]
    setDeclinedOrders(updated)

    if (typeof window !== "undefined" && user?.ID) {
      const key = `declined_orders_${user.ID}`
      localStorage.setItem(key, JSON.stringify(updated))
    }

    setIncomingOrders(prev => prev.filter(o => o.ID !== orderId))
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Main Content */}
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                Welcome, {user?.FullName?.split(" ")[0] || "Technician"}
                <Wrench className="w-5 h-5 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground">
                You have {incomingOrders.length} new orders
              </p>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <span
                className={cn(
                  "text-sm font-medium",
                  isOnline ? "text-primary" : "text-muted-foreground"
                )}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
              <Switch
                checked={isOnline}
                onCheckedChange={setIsOnline}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          {/* Incoming Orders Section */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Incoming Orders
            </h2>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {incomingOrders.map((order) => (
                  <motion.div
                    key={order.ID}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-card border-border/50 overflow-hidden max-w-full">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Device Icon */}
                          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                            <Smartphone className="w-5 h-5 text-primary" />
                          </div>

                          {/* Order Info */}
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

                            {/* Action Buttons */}
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
                {activeOrders.map((order) => (
                  <Card key={order.ID} className="bg-card border-border/50 overflow-hidden max-w-full">
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
              <Card className="bg-card border-border/50 overflow-hidden max-w-full">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">No active orders</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Earnings Summary */}
          <section>
            <Card className="bg-linear-to-br from-primary/20 to-primary/5 border-primary/20 overflow-hidden max-w-full">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Earnings Summary
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
                    <p className="text-lg font-bold text-primary">
                      {earnings?.total_earnings
                        ? `Rp ${earnings.total_earnings.toLocaleString("id-ID")}`
                        : "Rp 0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">This Month</p>
                    <p className="text-lg font-bold text-foreground">
                      {earnings?.this_month_earnings
                        ? `Rp ${earnings.this_month_earnings.toLocaleString("id-ID")}`
                        : "Rp 0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Repairs</p>
                    <p className="text-lg font-bold text-foreground">
                      {earnings?.total_completed || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
