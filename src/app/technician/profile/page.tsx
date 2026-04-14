"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  LogOut,
  ChevronRight,
  Bell,
  Globe,
  Lock,
  Settings,
  Info,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface MenuItem {
  icon: React.ReactNode
  label: string
  subtext?: string
  action?: "link" | "toggle"
  value?: boolean
}

export default function TechnicianProfilePage() {
  const { user, isLoading: authLoading } = useAuth("technician")
  const [isOnline, setIsOnline] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const menuItems = {
    work: [
      { icon: <FileText size={20} />, label: "My Orders", action: "link" as const },
      { icon: <FileText size={20} />, label: "Earnings History", action: "link" as const },
      { icon: <FileText size={20} />, label: "Service Area", action: "link" as const },
      { icon: <FileText size={20} />, label: "Specializations", action: "link" as const },
    ],
    account: [
      { icon: <Settings size={20} />, label: "Edit Profile", action: "link" as const },
      { icon: <Bell size={20} />, label: "Notifications", action: "toggle" as const, value: notifications },
      { icon: <Globe size={20} />, label: "Language", subtext: "English", action: "link" as const },
    ],
    about: [
      { icon: <Info size={20} />, label: "About EcoServe", action: "link" as const },
      { icon: <Lock size={20} />, label: "Privacy Policy", action: "link" as const },
      { icon: <Info size={20} />, label: "App Version", subtext: "1.0.0", action: "link" as const },
    ],
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  const handleToggle = (key: string) => {
    if (key === "notifications") {
      setNotifications(!notifications)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 px-4 py-6"
        >
          {/* Profile Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-lg font-bold">
                  BS
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">Budi Santoso</h1>
                <p className="text-sm text-muted-foreground">budi@example.com</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                    Technician
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Screen & Display Repair</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-auto py-1 px-2 text-xs">
              Edit Profile
            </Button>
          </motion.div>

          {/* Performance Stats Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-4"
          >
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Your Performance</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">4.9★</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary">142</p>
                <p className="text-xs text-muted-foreground">Repairs</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary">98%</p>
                <p className="text-xs text-muted-foreground">Completion</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary">87.3</p>
                <p className="text-xs text-muted-foreground">CO₂ Saved (kg)</p>
              </div>
            </div>
          </motion.div>

          {/* Availability Toggle */}
          <motion.div variants={itemVariants} className="rounded-xl border border-border/50 bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Availability Status</h3>
                <p className="text-xs text-muted-foreground">Toggle to receive new orders</p>
              </div>
              <motion.div
                animate={{ scale: isOnline ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Switch
                  checked={isOnline}
                  onCheckedChange={setIsOnline}
                  className={cn(
                    "data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/20"
                  )}
                />
              </motion.div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className={cn("h-2 w-2 rounded-full", isOnline ? "bg-primary" : "bg-muted-foreground")}>
              </div>
              <span className={isOnline ? "text-primary" : "text-muted-foreground"}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </motion.div>

          {/* Menu Sections */}
          {Object.entries(menuItems).map(([section, items]) => (
            <motion.div key={section} variants={itemVariants} className="space-y-2">
              <h3 className="px-2 text-xs font-semibold uppercase text-muted-foreground">
                {section}
              </h3>
              <div className="space-y-1 rounded-xl border border-border/50 overflow-hidden">
                {items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                    onClick={() => item.action === "link" && console.log("navigate")}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors cursor-pointer",
                      idx !== items.length - 1 && "border-b border-border/30"
                    )}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{item.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        {item.subtext && <p className="text-xs text-muted-foreground">{item.subtext}</p>}
                      </div>
                    </div>
                    {item.action === "toggle" ? (
                      <Switch
                        checked={item.value || false}
                        onCheckedChange={() => handleToggle(item.label.toLowerCase())}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <ChevronRight size={20} className="text-muted-foreground" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Logout Section */}
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              {!showLogoutConfirm ? (
                <motion.button
                  key="logout-button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-red-500 font-medium transition-colors hover:bg-red-500/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={20} />
                  Sign Out
                </motion.button>
              ) : (
                <motion.div
                  key="logout-confirm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 space-y-3"
                >
                  <div className="flex gap-3">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">
                      Are you sure you want to sign out?
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLogoutConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => {
                        // Handle logout
                        setShowLogoutConfirm(false)
                      }}
                    >
                      Confirm
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
