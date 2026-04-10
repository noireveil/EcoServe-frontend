"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import {
  Bell,
  Leaf,
  Wrench,
  Recycle,
  AlertTriangle,
  Warehouse,
  MapPin,
  Sparkles,
  Star,
  ChevronRight,
  Smartphone,
  Laptop,
  Headphones,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "home" | "devices" | "orders" | "profile"

const quickActions = [
  { id: "report", label: "Report Damage", icon: AlertTriangle, color: "bg-emerald-500/20 text-emerald-400" },
  { id: "garage", label: "My Garage", icon: Warehouse, color: "bg-blue-500/20 text-blue-400" },
  { id: "track", label: "Track Order", icon: MapPin, color: "bg-orange-500/20 text-orange-400" },
  { id: "ai", label: "AI Diagnosis", icon: Sparkles, color: "bg-purple-500/20 text-purple-400" },
]

const recentRepairs = [
  {
    id: 1,
    device: "MacBook Pro 14\"",
    issue: "Battery replacement",
    date: "Mar 28, 2026",
    status: "completed",
    icon: Laptop,
  },
  {
    id: 2,
    device: "AirPods Pro",
    issue: "Left earbud not working",
    date: "Mar 15, 2026",
    status: "completed",
    icon: Headphones,
  },
  {
    id: 3,
    device: "iPhone 14 Pro",
    issue: "Screen repair",
    date: "Apr 5, 2026",
    status: "in-progress",
    icon: Smartphone,
  },
]

export default function ConsumerDashboard() {
  const [firstName, setFirstName] = useState("...")

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          { withCredentials: true }
        )

        const user = response.data.data
        const fullName = user?.FullName || user?.fullName || "Pengguna"

        // --- LOGIKA PINTAR NAMA INDONESIA ---
        const words = fullName.trim().split(/\s+/)
        let nickname = words[0] // Default: ambil kata pertama

        // Daftar kata depan yang biasanya di-skip untuk panggilan
        const skippedNames = ["muhammad", "mohammad", "m.", "m", "abdul", "siti", "ahmad", "raden", "tb"]

        // Jika kata pertama ada di daftar skip dan dia punya kata kedua, ambil kata kedua
        if (words.length > 1 && skippedNames.includes(words[0].toLowerCase())) {
          nickname = words[1]
        }
        // ------------------------------------

        setFirstName(nickname)
      } catch (error) {
        console.error("Gagal mengambil profil:", error)
        setFirstName("Pengguna")
      }
    }

    fetchUserProfile()
  }, [])

  return (
    <div className="relative min-h-screen bg-background pb-20">
      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Top Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Hello, {firstName} 👋
            </h1>
            <p className="text-sm text-muted-foreground">Welcome back</p>
          </div>
          <button className="relative rounded-full bg-secondary p-2.5 transition-colors hover:bg-secondary/80">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
          </button>
        </header>

        {/* Impact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-5"
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
              <span className="text-sm font-medium text-emerald-100">Your Eco Impact</span>
            </div>

            <div className="mb-4">
              <span className="text-4xl font-bold text-white">12.4 kg</span>
              <p className="text-sm text-emerald-100">CO₂ Avoided</p>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white/20 p-1.5">
                  <Wrench className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">3</p>
                  <p className="text-xs text-emerald-100">Repairs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white/20 p-1.5">
                  <Recycle className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">8.2 kg</p>
                  <p className="text-xs text-emerald-100">E-waste saved</p>
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
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-primary/50 hover:bg-card/80"
              >
                <div className={cn("rounded-xl p-3", action.color)}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Active Order Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Active Order</h3>
              <span className="rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-xs font-medium text-yellow-400">
                In Progress
              </span>
            </div>

            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-secondary p-2">
                <Smartphone className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">iPhone 14 Pro</p>
                <p className="text-sm text-muted-foreground">Screen repair</p>
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-xs font-semibold text-emerald-400">BS</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Budi S.</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">4.8</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">60%</span>
            </div>

            {/* Progress bar */}
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-emerald-500"
              />
            </div>
          </div>
        </motion.section>

        {/* Recent Repairs */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Recent Repairs</h3>
            <button className="flex items-center gap-1 text-sm text-primary hover:underline">
              See all
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentRepairs.map((repair, index) => (
              <motion.div
                key={repair.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3"
              >
                <div className="rounded-lg bg-secondary p-2">
                  <repair.icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{repair.device}</p>
                  <p className="text-sm text-muted-foreground">{repair.issue}</p>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      repair.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    )}
                  >
                    {repair.status === "completed" ? "Completed" : "In Progress"}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">{repair.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}