"use client"

import { useEffect, useState, Fragment } from "react"
import { useAuth } from "@/hooks/useAuth"
import { apiFetch } from "@/lib/api"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Star,
  Leaf,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const steps = [
  "Submitted",
  "Matched",
  "On The Way",
  "In Progress",
  "Done",
]

function ActiveOrderCard({ order }: { order: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {order.DeviceCategory}
            </p>
            <h3 className="text-sm font-semibold">{order.ProblemDescription}</h3>
          </div>
          <Badge className={cn(
            "text-xs",
            order.Status === "PENDING"
              ? "bg-gray-500/20 text-gray-400"
              : "bg-yellow-500/20 text-yellow-400"
          )}>
            {order.Status}
          </Badge>
        </div>

        {order.Status === "PENDING" ? (
          <div className="py-3 text-sm text-muted-foreground">
            Waiting for technician...
          </div>
        ) : (
          <>
            {/* Progress steps */}
            <div className="mb-4">
              <div className="flex items-center">
                {steps.map((_, idx) => (
                  <Fragment key={idx}>
                    <div
                      className={cn(
                        "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                        idx <= 2
                          ? "bg-primary text-background"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {idx + 1}
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-0.5 transition-all mx-1",
                          idx < 2
                            ? "bg-primary"
                            : "bg-secondary"
                        )}
                      />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {order.Status !== "PENDING" && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
            >
              <MapPin className="w-3 h-3 mr-1" />
              Track on Map
            </Button>
          )}
          {order.Status === "PENDING" && (
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              Cancel
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

function CompletedOrderCard({ order }: { order: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold">{order.DeviceCategory}</h3>
            <p className="text-xs text-muted-foreground">{order.ProblemDescription}</p>
          </div>
          <Badge className="bg-green-500/20 text-green-400 text-xs">
            Completed
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-border/30 text-xs">
          <div>
            <p className="text-muted-foreground mb-0.5">Completed</p>
            <p className="font-medium">
              {new Date(order.UpdatedAt).toLocaleDateString("id-ID")}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Leaf className="w-3 h-3 text-primary" />
            <p className="font-medium">{order.EWasteSavedKg || 0} kg</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-primary/50" />
        </div>
      </div>
      <h3 className="text-base font-semibold mb-1">No orders yet</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Start by reporting a device issue
      </p>
      <Link href="/consumer/ai-diagnosis">
        <Button className="bg-primary hover:bg-primary/90">
          Report Damage
        </Button>
      </Link>
    </motion.div>
  )
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth("customer")
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("active")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiFetch("/api/orders/")
        if (response.ok) {
          const data = await response.json()
          setOrders(data.data || [])
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const activeOrders = orders.filter(o =>
    o.Status === "PENDING" || o.Status === "IN_PROGRESS"
  )
  const completedOrders = orders.filter(o =>
    o.Status === "COMPLETED"
  )

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Sticky header */}
        <div className="sticky top-0 md:top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold">My Orders</h1>

          {/* Tabs */}
          <div className="w-full bg-secondary/50 border-b border-border/30 flex flex-row gap-0 px-0 mt-4">
            <button
              onClick={() => setActiveTab("active")}
              className={cn(
                "rounded-none border-b-2 px-4 py-3 text-sm font-medium transition-colors flex-1",
                activeTab === "active"
                  ? "border-primary text-foreground bg-transparent"
                  : "border-transparent text-muted-foreground bg-transparent"
              )}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={cn(
                "rounded-none border-b-2 px-4 py-3 text-sm font-medium transition-colors flex-1",
                activeTab === "completed"
                  ? "border-primary text-foreground bg-transparent"
                  : "border-transparent text-muted-foreground bg-transparent"
              )}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "rounded-none border-b-2 px-4 py-3 text-sm font-medium transition-colors flex-1",
                activeTab === "all"
                  ? "border-primary text-foreground bg-transparent"
                  : "border-transparent text-muted-foreground bg-transparent"
              )}
            >
              All
            </button>
          </div>
        </div>

        {/* Tab content - outside header */}
        <div className="px-4 mt-[20px] md:mt-[80px]">
          <AnimatePresence mode="wait">
            {activeTab === "active" && (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeOrders.length > 0 ? (
                  <div>
                    {activeOrders.map((order) => (
                      <ActiveOrderCard key={order.ID || order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </motion.div>
            )}

            {activeTab === "completed" && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {completedOrders.length > 0 ? (
                  <div>
                    {completedOrders.map((order) => (
                      <CompletedOrderCard key={order.ID || order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </motion.div>
            )}

            {activeTab === "all" && (
              <motion.div
                key="all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {orders.length > 0 ? (
                  <div>
                    {orders.map((order) =>
                      order.Status === "PENDING" || order.Status === "IN_PROGRESS" ? (
                        <ActiveOrderCard key={order.ID || order.id} order={order} />
                      ) : (
                        <CompletedOrderCard key={order.ID || order.id} order={order} />
                      )
                    )}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
