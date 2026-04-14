"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Camera, CheckCircle, MapPinIcon, Trash2, Leaf, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Tab = "active" | "completed" | "all"

interface ActiveJob {
  id: string
  status: "in-progress" | "accepted"
  device: string
  issue: string
  customer: string
  address: string
  scheduled: string
  statusColor: string
}

interface CompletedJob {
  id: string
  device: string
  issue: string
  customer: string
  completedDate: string
  earning: string
  co2Saved: string
  rating: number
}

export default function TechnicianOrdersPage() {
  const { user, isLoading: authLoading } = useAuth("technician")
  const [activeTab, setActiveTab] = useState<Tab>("active")

  const activeJobs: ActiveJob[] = [
    {
      id: "1",
      status: "in-progress",
      device: "MacBook Pro 14",
      issue: "Battery replacement",
      customer: "Sarah M.",
      address: "Jl. Sudirman No. 45, Jaksel",
      scheduled: "Today, 14:00",
      statusColor: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
    },
    {
      id: "2",
      status: "accepted",
      device: "iPhone 14 Pro",
      issue: "Screen repair",
      customer: "Budi K.",
      address: "Jl. Kemang Raya No. 12",
      scheduled: "Today, 16:30",
      statusColor: "bg-blue-500/20 text-blue-500 border-blue-500/50",
    },
  ]

  const completedJobs: CompletedJob[] = [
    {
      id: "1",
      device: "MacBook Pro",
      issue: "Battery replacement",
      customer: "Sarah M.",
      completedDate: "Apr 8",
      earning: "Rp 250.000",
      co2Saved: "8.4 kg",
      rating: 4.9,
    },
    {
      id: "2",
      device: "iPhone 13",
      issue: "Screen repair",
      customer: "Rina S.",
      completedDate: "Apr 7",
      earning: "Rp 150.000",
      co2Saved: "6.2 kg",
      rating: 5.0,
    },
    {
      id: "3",
      device: "Samsung TV",
      issue: "Power board repair",
      customer: "Ahmad T.",
      completedDate: "Apr 6",
      earning: "Rp 300.000",
      co2Saved: "15.7 kg",
      rating: 4.8,
    },
  ]

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
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-6">
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">14 repairs completed</p>

          {/* Custom Tab Filter */}
          <div className="mt-4 flex gap-0 border-b border-border/30">
            {["active", "completed", "all"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as Tab)}
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-colors capitalize",
                  activeTab === tab
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          <AnimatePresence mode="wait">
            {/* Active Jobs Tab */}
            {activeTab === "active" && (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {activeJobs.map((job, idx) => (
                  <Card
                    key={job.id}
                    className="border-border/50 bg-card/50 p-4 hover:bg-card/80 transition-colors"
                  >
                    {/* Status Badge */}
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={cn("capitalize", job.statusColor)}>
                        {job.status === "in-progress" ? "In Progress" : "Accepted"}
                      </Badge>
                    </div>

                    {/* Device & Issue */}
                    <h3 className="font-semibold text-base mb-1">{job.device}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{job.issue}</p>

                    {/* Customer Info */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-border/30">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Customer: </span>
                        <span className="font-medium">{job.customer}</span>
                      </p>
                      <div className="flex items-start gap-2">
                        <MapPinIcon size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{job.address}</span>
                      </div>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Scheduled: </span>
                        <span className="font-medium">{job.scheduled}</span>
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-primary text-primary hover:bg-primary/10"
                      >
                        <MapPin size={14} className="mr-1" />
                        Navigate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Camera size={14} className="mr-1" />
                        Photo
                      </Button>
                      {job.status === "in-progress" && (
                        <Button
                          size="sm"
                          className="text-xs bg-primary hover:bg-primary/90"
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Complete
                        </Button>
                      )}
                      {job.status === "accepted" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-destructive border-destructive/50 hover:bg-destructive/10"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Completed Jobs Tab */}
            {activeTab === "completed" && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {completedJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="border-border/50 bg-card/50 p-4 hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">{job.device}</h3>
                        <p className="text-sm text-muted-foreground">{job.issue}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{job.earning}</p>
                        <p className="text-xs text-muted-foreground">{job.completedDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{job.customer}</span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{job.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Leaf size={14} className="text-primary" />
                      <span>{job.co2Saved} CO₂ saved</span>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* All Jobs Tab */}
            {activeTab === "all" && (
              <motion.div
                key="all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Active section */}
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-3">Active</h2>
                  <div className="space-y-4">
                    {activeJobs.map((job) => (
                      <Card
                        key={job.id}
                        className="border-border/50 bg-card/50 p-4 hover:bg-card/80 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge className={cn("capitalize", job.statusColor)}>
                            {job.status === "in-progress" ? "In Progress" : "Accepted"}
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-base mb-1">{job.device}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{job.issue}</p>

                        <div className="space-y-2 mb-4 pb-4 border-b border-border/30">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Customer: </span>
                            <span className="font-medium">{job.customer}</span>
                          </p>
                          <div className="flex items-start gap-2">
                            <MapPinIcon size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{job.address}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" size="sm" className="text-xs border-primary text-primary">
                            <MapPin size={14} className="mr-1" />
                            Navigate
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            <Camera size={14} className="mr-1" />
                            Photo
                          </Button>
                          {job.status === "in-progress" && (
                            <Button size="sm" className="text-xs bg-primary">
                              <CheckCircle size={14} className="mr-1" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Completed section */}
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-3 mt-6">Completed</h2>
                  <div className="space-y-3">
                    {completedJobs.map((job) => (
                      <Card
                        key={job.id}
                        className="border-border/50 bg-card/50 p-4 hover:bg-card/80 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base">{job.device}</h3>
                            <p className="text-sm text-muted-foreground">{job.issue}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">{job.earning}</p>
                            <p className="text-xs text-muted-foreground">{job.completedDate}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{job.customer}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Leaf size={14} className="text-primary" />
                              <span className="text-xs">{job.co2Saved}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-500 fill-yellow-500" />
                              <span className="font-medium text-xs">{job.rating}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
