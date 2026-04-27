"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


export default function EarningsPage() {
  const { isLoading: authLoading } = useAuth("technician")
  const [selectedMonth, setSelectedMonth] = useState(0)

  const { data: orders = [] } = useSWR(
    "/api/orders/",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
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

  const getMonthOptions = () => {
    const now = new Date()
    return [0, -1, -2].map(offset => {
      const date = new Date(now.getFullYear(), now.getMonth() + offset, 1)
      return {
        offset,
        label: date.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      }
    })
  }

  const monthOptions = getMonthOptions()
  const currentMonthOption = monthOptions.find(m => m.offset === selectedMonth)

  const filteredOrders = orders.filter(o => {
    if (o.Status !== "COMPLETED") return false
    const orderDate = new Date(o.UpdatedAt)
    const selected = new Date()
    selected.setMonth(selected.getMonth() + selectedMonth)
    return (
      orderDate.getMonth() === selected.getMonth() &&
      orderDate.getFullYear() === selected.getFullYear()
    )
  })

  const monthlyStats = {
    totalRepairs: filteredOrders.length,
    totalCO2: filteredOrders.reduce((sum, o) => sum + (o.EWasteSavedKg || 0), 0),
    totalFee: filteredOrders.reduce((sum, o) => sum + (o.NetTechnicianFee || 0), 0),
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border/30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 py-6">
          <h1 className="text-2xl font-bold">My Earnings</h1>
        </div>

        <div className="px-4 space-y-6 py-6">
          {/* Month Selector */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Earnings</h2>
            <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
              <button
                onClick={() => setSelectedMonth(prev => Math.max(prev - 1, -2))}
                disabled={selectedMonth === -2}
                className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-card transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium px-2 min-w-25 text-center">
                {currentMonthOption?.label}
              </span>
              <button
                onClick={() => setSelectedMonth(prev => Math.min(prev + 1, 0))}
                disabled={selectedMonth === 0}
                className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-card transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Earnings Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 bg-linear-to-br from-primary/20 via-primary/10 to-background p-6">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <p className="text-muted-foreground text-sm mb-2">Total This Month</p>
                <h2 className="text-3xl font-bold mb-6">
                  Rp {monthlyStats.totalFee.toLocaleString("id-ID")}
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Repairs</p>
                    <p className="text-lg font-semibold">{monthlyStats.totalRepairs}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Completed</p>
                    <p className="text-lg font-semibold">{monthlyStats.totalRepairs}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">CO₂ Saved</p>
                    <p className="text-lg font-semibold">{monthlyStats.totalCO2.toFixed(2)} kg</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-4">
                {filteredOrders.map((order, idx) => (
                  <motion.div
                    key={order.ID}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                  >
                    <Card className="p-4 border-border/30 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{order.DeviceCategory}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.Customer?.FullName} • {new Date(order.UpdatedAt).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-primary text-sm">{order.EWasteSavedKg ?? 0} kg CO₂</p>
                        <Badge
                          variant="outline"
                          className="border-primary/20 bg-primary/5 text-primary text-xs"
                        >
                          Done
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                {filteredOrders.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-8">
                    Tidak ada transaksi di {currentMonthOption?.label}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Withdrawal Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="bg-secondary/50 rounded-lg p-4 mb-4 border border-border/30">
              <p className="text-xs text-muted-foreground mb-3">Total Earnings</p>
              <p className="text-2xl font-bold mb-4">
                {earnings?.total_earnings
                  ? `Rp ${earnings.total_earnings.toLocaleString("id-ID")}`
                  : "Rp 0"}
              </p>
              <Button
                disabled
                title="Coming soon"
                className="w-full font-semibold opacity-50 cursor-not-allowed"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Withdraw Earnings
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
