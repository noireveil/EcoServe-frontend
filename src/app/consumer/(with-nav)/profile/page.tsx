"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { motion } from "framer-motion"
import {
  ChevronRight,
  Bell,
  Moon,
  Globe,
  FileText,
  Shield,
  Info,
  LogOut,
  Leaf,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth("customer")
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    setShowLogoutConfirm(false)
    // Add logout logic here
    console.log("User signed out")
  }

  const menuItems = {
    Account: [
      { icon: Wrench, label: "My Devices", href: "/consumer/devices" },
      { icon: Bell, label: "My Orders", href: "/consumer/orders" },
      { icon: ChevronRight, label: "Edit Profile", href: "/consumer/profile/edit" },
    ],
    Preferences: [
      {
        icon: null,
        label: "Notifications",
        type: "toggle",
        value: notifications,
        onChange: setNotifications,
      },
      {
        icon: null,
        label: "Dark Mode",
        type: "toggle",
        value: darkMode,
        onChange: setDarkMode,
      },
      { icon: Globe, label: "Language", sublabel: "English", type: "link" },
    ],
    About: [
      { icon: Info, label: "About EcoServe", href: "#" },
      { icon: Shield, label: "Privacy Policy", href: "#" },
      { icon: FileText, label: "Terms of Service", href: "#" },
      {
        icon: null,
        label: "App Version",
        sublabel: "1.0.0",
        type: "text",
      },
    ],
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
        {/* Profile Header */}
        <div className="px-4 pt-6 md:pt-[90px] pb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-lg font-bold">
                FM
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-2xl font-bold">Faris Maulana</h1>
              <p className="text-muted-foreground text-sm">faris@example.com</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="border-primary text-primary bg-transparent"
              >
                Consumer
              </Badge>
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Eco Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mx-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 p-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-6">
              Your Impact
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-primary">12.4</div>
                <div className="text-xs text-muted-foreground mt-1">kg CO₂ Saved</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-xs text-muted-foreground mt-1">Repairs Done</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-primary">24.6</div>
                <div className="text-xs text-muted-foreground mt-1">kg E-waste</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Menu Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-8 px-4"
        >
          {Object.entries(menuItems).map(([section, items], sectionIndex) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section}
              </h3>
              <div className="space-y-2">
                {items.map((item, itemIndex) => {
                  if (item.type === "toggle") {
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                        className="flex items-center justify-between px-4 py-3 rounded-lg bg-card/50 border border-border/50 hover:bg-card/80 transition-colors"
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.onChange}
                        />
                      </motion.div>
                    )
                  } else if (item.type === "text") {
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                        className="flex items-center justify-between px-4 py-3 rounded-lg bg-card/50 border border-border/50"
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.sublabel}
                        </span>
                      </motion.div>
                    )
                  }

                  const Icon = item.icon || ChevronRight

                  return (
                    <motion.a
                      key={item.label}
                      href={item.href || "#"}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                      className="flex items-center justify-between px-4 py-3 rounded-lg bg-card/50 border border-border/50 hover:bg-card/80 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div>
                          <div className="text-sm font-medium">{item.label}</div>
                          {item.sublabel && (
                            <div className="text-xs text-muted-foreground">
                              {item.sublabel}
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Sign Out Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="px-4 mt-8 mb-4"
        >
          {!showLogoutConfirm ? (
            <Button
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3">
                <p className="text-xs text-destructive/80">
                  You will be signed out of your account
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleLogout}
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
