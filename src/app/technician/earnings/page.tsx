"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { apiFetch } from "@/lib/api"
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
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3))
  const [earnings, setEarnings] = useState<any>(null)
  const [performance, setPerformance] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [earningsResponse, perfResponse, ordersResponse] = await Promise.all([
          apiFetch("/api/technicians/earnings"),
          apiFetch("/api/technicians/performance"),
          apiFetch("/api/orders/")
        ])
        if (earningsResponse.ok) {
          const data = await earningsResponse.json()
          setEarnings(data.data)
        }
        if (perfResponse.ok) {
          const data = await perfResponse.json()
          setPerformance(data.data)
        }
        if (ordersResponse.ok) {
          const data = await ordersResponse.json()
          setOrders(data.data || [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const monthYear = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-6">
          <h1 className="text-2xl font-bold mb-2">My Earnings</h1>
          <p className="text-muted-foreground text-sm mb-4">{monthYear}</p>

          {/* Month Navigator */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{monthYear}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="px-4 space-y-6 py-6">
          {/* Earnings Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background p-6">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <p className="text-muted-foreground text-sm mb-2">Total This Month</p>
                <h2 className="text-3xl font-bold mb-6">
                  {earnings?.this_month_earnings
                    ? `Rp ${earnings.this_month_earnings.toLocaleString("id-ID")}`
                    : "Rp 0"}
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Repairs</p>
                    <p className="text-lg font-semibold">{performance?.total_repairs || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Completed</p>
                    <p className="text-lg font-semibold">{earnings?.total_completed || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">CO₂ Saved</p>
                    <p className="text-lg font-semibold">{performance?.co2_saved_kg || 0} kg</p>
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
                {orders.filter(o => o.Status === "COMPLETED").map((order, idx) => (
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
                {orders.filter(o => o.Status === "COMPLETED").length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">No completed orders yet</p>
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
