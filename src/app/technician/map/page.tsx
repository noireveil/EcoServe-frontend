"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Filter, Smartphone, Laptop, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Order {
  id: string
  device: string
  distance: string
  area: string
  earning: string
  lat: number
  lng: number
}

const nearbyOrders: Order[] = [
  {
    id: "1",
    device: "iPhone 14 Pro",
    distance: "2.3 km",
    area: "Kebayoran Baru",
    earning: "Rp 150.000",
    lat: -6.2145,
    lng: 106.8120,
  },
  {
    id: "2",
    device: "MacBook Pro",
    distance: "4.8 km",
    area: "Senayan",
    earning: "Rp 250.000",
    lat: -6.2250,
    lng: 106.8000,
  },
  {
    id: "3",
    device: "Samsung Galaxy S23",
    distance: "5.2 km",
    area: "Blok M",
    earning: "Rp 120.000",
    lat: -6.1950,
    lng: 106.8300,
  },
]

const filterChips = [
  { label: "All", value: "all" },
  { label: "< 5km", value: "5km" },
  { label: "< 10km", value: "10km" },
  { label: "Smartphone", value: "smartphone" },
  { label: "Laptop", value: "laptop" },
]

export default function MapPage() {
  const { user, isLoading: authLoading } = useAuth("technician")
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(true)

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      {/* Floating Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto"
        >
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold">Nearby Orders</h1>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Filter size={14} className="mr-1" />
              10 km
            </Badge>
          </div>
        </motion.div>
      </div>

      {/* Map Area */}
      <div className="relative w-full flex-1 bg-[#1a1a2e] overflow-hidden">
        {/* Grid Pattern Background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Technician Location Marker (Blue) */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-300 shadow-lg"></div>
            <div className="absolute w-8 h-8 border-2 border-blue-400 rounded-full animate-pulse"></div>
          </div>
        </motion.div>

        {/* Order Markers (Emerald Green) */}
        <AnimatePresence>
          {nearbyOrders.map((order, idx) => {
            const offsetX = (parseFloat(order.lng.toString().split(".")[1] || "0") / 10000) * 60
            const offsetY = (parseFloat(order.lat.toString().split(".")[1] || "0") / 10000) * 40
            const left = `calc(50% + ${offsetX}px)`
            const top = `calc(50% + ${offsetY}px)`

            return (
              <motion.button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                style={{ left, top }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                {/* Pulse Background */}
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  className="absolute w-6 h-6 bg-primary rounded-full"
                />

                {/* Marker */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={cn(
                    "relative w-5 h-5 rounded-full border-2 transition-all",
                    selectedOrder?.id === order.id
                      ? "bg-primary border-primary shadow-lg shadow-primary/50"
                      : "bg-primary/80 border-primary/60"
                  )}
                />

                {/* Distance Badge */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-secondary/95 px-2 py-1 rounded text-xs whitespace-nowrap font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {order.distance}
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {bottomSheetOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-30 bg-card rounded-t-3xl border-t border-border/50 shadow-lg max-h-[45vh] flex flex-col"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-12 h-1 bg-border/50 rounded-full" />
            </div>

            {/* Filter Chips */}
            <div className="px-4 pb-4 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 min-w-min">
                {filterChips.map((chip) => (
                  <motion.button
                    key={chip.value}
                    onClick={() => setActiveFilter(chip.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                      activeFilter === chip.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-muted-foreground border border-border/30"
                    )}
                  >
                    {chip.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="px-4 pb-3">
              <h2 className="font-semibold">{nearbyOrders.length} Orders Nearby</h2>
            </div>

            {/* Orders List - Horizontal Scroll */}
            <div className="flex-1 overflow-x-auto scrollbar-hide px-4 pb-4">
              <div className="flex gap-3 min-w-min">
                {nearbyOrders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex-shrink-0 w-64"
                  >
                    <Card className="border border-border/50 p-4 bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer h-full flex flex-col gap-3">
                      {/* Device Info */}
                      <div>
                        <p className="font-semibold text-sm">{order.device}</p>
                        <p className="text-xs text-muted-foreground mt-1">{order.area}</p>
                      </div>

                      {/* Distance and Earning */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-xs">
                          <MapPin size={14} className="text-primary" />
                          <span className="text-muted-foreground">{order.distance}</span>
                        </div>
                        <Badge className="bg-primary/20 text-primary border-none text-xs">
                          {order.earning}
                        </Badge>
                      </div>

                      {/* View Button */}
                      <Button
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8"
                        onClick={() => console.log("View order:", order.id)}
                      >
                        View
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
