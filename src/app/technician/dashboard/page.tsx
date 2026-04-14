"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Smartphone,
  Laptop,
  MapPin,
  Navigation,
  CheckCircle2,
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
import { cn } from "@/lib/utils"

interface IncomingOrder {
  id: string
  device: string
  deviceType: "phone" | "laptop"
  issue: string
  area: string
  distance: string
  earning: string
}

const incomingOrders: IncomingOrder[] = [
  {
    id: "1",
    device: "iPhone 14 Pro",
    deviceType: "phone",
    issue: "Screen repair needed",
    area: "Kebayoran Baru",
    distance: "2.3 km",
    earning: "Rp 150.000",
  },
  {
    id: "2",
    device: "Samsung Galaxy S23",
    deviceType: "phone",
    issue: "Battery replacement",
    area: "Menteng",
    distance: "3.1 km",
    earning: "Rp 120.000",
  },
  {
    id: "3",
    device: "iPad Pro 12.9",
    deviceType: "phone",
    issue: "Charging port issue",
    area: "Senayan",
    distance: "1.8 km",
    earning: "Rp 180.000",
  },
]

export default function TechnicianDashboardPage() {
  const { user, isLoading: authLoading } = useAuth("technician")
  const [isOnline, setIsOnline] = useState(true)
  const [orders, setOrders] = useState(incomingOrders)

  const handleAccept = (orderId: string) => {
    setOrders(orders.filter((o) => o.id !== orderId))
  }

  const handleDecline = (orderId: string) => {
    setOrders(orders.filter((o) => o.id !== orderId))
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
                Welcome, Budi
                <Wrench className="w-5 h-5 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground">
                You have {orders.length} new orders
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
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
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
                            {order.deviceType === "phone" ? (
                              <Smartphone className="w-5 h-5 text-primary" />
                            ) : (
                              <Laptop className="w-5 h-5 text-primary" />
                            )}
                          </div>

                          {/* Order Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {order.device}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {order.issue}
                                </p>
                              </div>
                              <span className="text-primary font-semibold text-sm whitespace-nowrap">
                                {order.earning}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {order.area}
                              </span>
                              <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary border-0 text-xs"
                              >
                                {order.distance}
                              </Badge>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-3 w-full">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 min-w-0 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive px-2 sm:px-4"
                                onClick={() => handleDecline(order.id)}
                              >
                                <X className="w-4 h-4 sm:mr-1" />
                                <span className="hidden sm:inline">Decline</span>
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 min-w-0 bg-primary hover:bg-primary/90 text-primary-foreground px-2 sm:px-4"
                                onClick={() => handleAccept(order.id)}
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

              {orders.length === 0 && (
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
            <Card className="bg-card border-border/50 overflow-hidden max-w-full">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Laptop className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        MacBook Pro
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Battery issue
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-400 border-0">
                    On The Way
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Sarah M.</p>
                    <p className="text-muted-foreground text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Jl. Sudirman No. 45, Jakarta Selatan
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-0 border-primary/50 text-primary hover:bg-primary/10 px-2 sm:px-4"
                  >
                    <Navigation className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">GPS Navigate</span>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 min-w-0 bg-primary hover:bg-primary/90 text-primary-foreground px-2 sm:px-4"
                  >
                    <CheckCircle2 className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Mark Arrived</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Earnings Summary */}
          <section>
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 overflow-hidden max-w-full">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Earnings Summary
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Today</p>
                    <p className="text-lg font-bold text-primary">Rp 450.000</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      This Week
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      Rp 2.100.000
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Repairs Today
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      4 repairs
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
