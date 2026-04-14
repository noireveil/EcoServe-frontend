"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Laptop,
  Zap,
  Tablet,
  Wind,
  Wallet,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const chartData = [
  { day: "Mon", earnings: 350000 },
  { day: "Tue", earnings: 280000 },
  { day: "Wed", earnings: 420000 },
  { day: "Thu", earnings: 350000 },
  { day: "Fri", earnings: 480000 },
  { day: "Sat", earnings: 510000 },
  { day: "Sun", earnings: 300000 },
]

const transactions = [
  {
    id: 1,
    device: "iPhone 14 Pro",
    customer: "Sarah M.",
    date: "Apr 9",
    amount: 150000,
    icon: Smartphone,
    color: "bg-blue-500/20",
  },
  {
    id: 2,
    device: "MacBook Pro",
    customer: "Budi K.",
    date: "Apr 8",
    amount: 250000,
    icon: Laptop,
    color: "bg-slate-500/20",
  },
  {
    id: 3,
    device: "Samsung Galaxy",
    customer: "Rina S.",
    date: "Apr 7",
    amount: 120000,
    icon: Smartphone,
    color: "bg-cyan-500/20",
  },
  {
    id: 4,
    device: "iPad Pro",
    customer: "Ahmad T.",
    date: "Apr 6",
    amount: 200000,
    icon: Tablet,
    color: "bg-purple-500/20",
  },
  {
    id: 5,
    device: "Sharp AC",
    customer: "Dewi R.",
    date: "Apr 5",
    amount: 300000,
    icon: Wind,
    color: "bg-emerald-500/20",
  },
]

export default function EarningsPage() {
  const { user, isLoading: authLoading } = useAuth("technician")
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3)) // April 2026

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
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <p className="text-muted-foreground text-sm mb-2">Total This Month</p>
                <h2 className="text-3xl font-bold mb-6">Rp 2.450.000</h2>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Repairs</p>
                    <p className="text-lg font-semibold">14</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Avg Rating</p>
                    <p className="text-lg font-semibold">4.9★</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Avg per Repair</p>
                    <p className="text-lg font-semibold">Rp 175K</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Weekly Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div>
              <h3 className="text-lg font-semibold mb-4">Weekly Earnings</h3>
              <Card className="p-4 border-border/30">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="#9ca3af"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      style={{ fontSize: "12px" }}
                      tickFormatter={(value) => `${value / 1000}K`}
                    />
                    <Bar
                      dataKey="earnings"
                      fill="#10b981"
                      radius={[8, 8, 0, 0]}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </motion.div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-4">
                {transactions.map((tx, idx) => {
                  const IconComponent = tx.icon
                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                    >
                      <Card className="p-4 border-border/30 flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={cn("p-2 rounded-lg", tx.color)}>
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{tx.device}</p>
                            <p className="text-xs text-muted-foreground">
                              {tx.customer} • {tx.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-primary">Rp {(tx.amount / 1000).toFixed(0)}K</p>
                          <Badge
                            variant="outline"
                            className="border-primary/20 bg-primary/5 text-primary text-xs"
                          >
                            Paid
                          </Badge>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Withdrawal Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="bg-secondary/50 rounded-lg p-4 mb-4 border border-border/30">
              <p className="text-xs text-muted-foreground mb-3">Available Balance</p>
              <p className="text-2xl font-bold mb-4">Rp 2.450.000</p>
              <Button className="w-full bg-primary hover:bg-primary/90 text-background font-semibold">
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
