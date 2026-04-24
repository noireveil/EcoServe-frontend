"use client"

import { useEffect, useState, Fragment } from "react"
import { useAuth } from "@/hooks/useAuth"
import { apiFetch } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertCircle,
  MessageCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ToastNotification } from "@/components/ui/toast-notification"
import { useToast } from "@/hooks/useToast"
import { ChatDrawer } from "@/components/ui/chat-drawer"
import { cn } from "@/lib/utils"

const steps = [
  "Submitted",
  "Matched",
  "On The Way",
  "In Progress",
  "Done",
]

const getStepNumber = (status: string): number => {
  switch (status) {
    case "PENDING": return 1
    case "ACCEPTED": return 3
    case "IN_PROGRESS": return 4
    case "COMPLETED": return 5
    default: return 1
  }
}

function ActiveOrderCard({ order, onTrackMap, showCancelConfirm, setShowCancelConfirm, onCancel, onChat }: {
  order: any
  onTrackMap: (order: any) => void
  showCancelConfirm: string | null
  setShowCancelConfirm: (id: string | null) => void
  onCancel: (orderId: string) => void
  onChat?: () => void
}) {
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

        {order.Technician ? (
          <div className="flex items-center gap-2 py-2 border-t border-border/30">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-emerald-400">
                {order.Technician?.User?.FullName
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "T"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {order.Technician?.User?.FullName || "Technician"}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.Technician?.Specialization || "General Repair"}
                {order.Technician?.Rating > 0
                  ? ` • ⭐ ${order.Technician.Rating}`
                  : " • New Technician"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-2">
            Waiting for technician...
          </p>
        )}

        {order.Status === "PENDING" ? null : (
          <>
            {/* Progress steps */}
            <div className="mb-4">
              <div className="flex items-center">
                {steps.map((_, idx) => {
                  const currentStep = getStepNumber(order.Status)
                  const stepNum = idx + 1
                  return (
                    <Fragment key={idx}>
                      <div
                        className={cn(
                          "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                          stepNum <= currentStep
                            ? "bg-primary text-background"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {stepNum}
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={cn(
                            "flex-1 h-0.5 transition-all mx-1",
                            stepNum < currentStep
                              ? "bg-primary"
                              : "bg-secondary"
                          )}
                        />
                      )}
                    </Fragment>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 flex-col">
          {order.Status === "PENDING" && (
            showCancelConfirm === order.ID ? (
              <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-3 space-y-2 mt-2">
                <p className="text-sm font-medium text-destructive">Cancel this order?</p>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCancelConfirm(null)}
                    className="flex-1 py-1.5 rounded-lg border border-border text-xs text-muted-foreground"
                  >
                    No, Keep
                  </button>
                  <button
                    onClick={() => onCancel(order.ID)}
                    className="flex-1 py-1.5 rounded-lg bg-destructive text-white text-xs font-medium"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCancelConfirm(order.ID)}
                className="px-3 py-1.5 rounded-lg border border-destructive/50 text-destructive text-xs hover:bg-destructive/10"
              >
                Cancel Order
              </button>
            )
          )}
          {order.Status === "ACCEPTED" && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
              onClick={() => onTrackMap(order)}
            >
              Track on Map
            </Button>
          )}
          {(order.Status === "ACCEPTED" || order.Status === "IN_PROGRESS") && (
            <button
              onClick={() => onChat?.()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/50 text-primary text-xs font-medium hover:bg-primary/10 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chat
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

interface CompletedOrderCardProps {
  order: any
  reviewingId: string | null
  setReviewingId: (id: string | null) => void
  rating: number
  setRating: (r: number) => void
  comment: string
  setComment: (c: string) => void
  isSubmittingReview: boolean
  handleReview: (orderId: string) => void
}

function CompletedOrderCard({
  order,
  reviewingId,
  setReviewingId,
  rating,
  setRating,
  comment,
  setComment,
  isSubmittingReview,
  handleReview,
}: CompletedOrderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm p-4 mb-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="font-medium text-sm">{order.DeviceCategory}</p>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Completed</span>
          </div>
          <p className="text-sm text-muted-foreground">{order.ProblemDescription}</p>

          {order.Technician && (
            <div className="flex items-center gap-2 pt-1">
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <span className="text-xs text-emerald-400">
                  {order.Technician?.User?.FullName?.charAt(0) || "T"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {order.Technician?.User?.FullName || "Technician"}
              </p>
            </div>
          )}

          <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t border-border/30">
            <span>📅 {new Date(order.UpdatedAt).toLocaleDateString("id-ID")}</span>
            <span>🌱 {(order.EWasteSavedKg ?? 0).toFixed(2)} kg CO₂</span>
          </div>

          {order.TotalFee > 0 && (
            <p className="text-xs text-emerald-400 font-medium">
              Rp {order.TotalFee.toLocaleString("id-ID")}
            </p>
          )}
        </div>

        {!order.is_reviewed ? (
          <button
            onClick={() => setReviewingId(order.ID)}
            className="w-full py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary/50"
          >
            Rate this repair
          </button>
        ) : (
          <p className="text-xs text-emerald-400">✓ Reviewed</p>
        )}

        {reviewingId === order.ID && (
          <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={cn(
                    "text-2xl",
                    star <= rating ? "text-yellow-400" : "text-muted-foreground"
                  )}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder="Tulis komentar (opsional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-sm resize-none"
              rows={2}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setReviewingId(null)}
                className="flex-1 py-2 rounded-lg border border-border text-sm text-muted-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview(order.ID)}
                disabled={rating === 0 || isSubmittingReview}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        )}
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
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("active")
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null)
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [chatOrderId, setChatOrderId] = useState<string | null>(null)
  const { toasts, removeToast, toast } = useToast()

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


  const handleTrackMap = (order: any) => {
    const techLat = order.Technician?.Latitude || order.Technician?.latitude
    const techLng = order.Technician?.Longitude || order.Technician?.longitude

    if (!techLat || !techLng) {
      alert("Lokasi teknisi belum tersedia")
      return
    }

    router.push(
      `/consumer/track-map?` +
      `techLat=${techLat}&techLng=${techLng}` +
      `&custLat=${order.CustomerLatitude}` +
      `&custLng=${order.CustomerLongitude}` +
      `&techName=${order.Technician?.User?.FullName || "Technician"}`
    )
  }

  const handleCancel = async (orderId: string) => {
    try {
      const response = await apiFetch(`/api/orders/${orderId}/cancel`, {
        method: "PUT",
      })

      if (response.ok) {
        const ordersResponse = await apiFetch("/api/orders/")
        if (ordersResponse.ok) {
          const data = await ordersResponse.json()
          setOrders(data.data || [])
        }
        setShowCancelConfirm(null)
        toast.success("Order cancelled", "Your order has been cancelled.")
      } else {
        const data = await response.json()
        console.error("Failed to cancel:", data)
        toast.error("Failed to cancel", "Please try again.")
      }
    } catch (err) {
      console.error("Cancel error:", err)
      toast.error("Failed to cancel", "Please try again.")
    }
  }

  const handleReview = async (orderId: string) => {
    if (rating === 0) return

    setIsSubmittingReview(true)
    try {
      console.log("Submitting review:", { orderId, rating, comment })

      const response = await apiFetch(`/api/reviews/order/${orderId}`, {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
      })

      console.log("Review response status:", response.status)
      const data = await response.json()
      console.log("Review response data:", JSON.stringify(data, null, 2))

      if (response.ok) {
        setReviewingId(null)
        setRating(0)
        setComment("")
        toast.success("Review submitted!", "Thank you for your feedback.")

        const ordersResponse = await apiFetch("/api/orders/")
        if (ordersResponse.ok) {
          const data = await ordersResponse.json()
          console.log("Orders after review:", JSON.stringify(data.data, null, 2))
          setOrders(data.data || [])
        }
      } else {
        toast.error("Failed to submit review", "Please try again.")
      }
    } catch (err) {
      console.error("Review error:", err)
      toast.error("Failed to submit review", "Please try again.")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const activeOrders = orders.filter(o =>
    o.Status === "PENDING" ||
    o.Status === "ACCEPTED" ||
    o.Status === "IN_PROGRESS"
  )
  const completedOrders = orders.filter(o =>
    o.Status === "COMPLETED"
  )

  const reviewProps = {
    reviewingId,
    setReviewingId,
    rating,
    setRating,
    comment,
    setComment,
    isSubmittingReview,
    handleReview,
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <ToastNotification toasts={toasts} onRemove={removeToast} />
      <div className="max-w-5xl mx-auto">
        {/* Sticky header */}
        <div className="sticky top-0 md:top-16 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 pt-4 pb-2">
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

        {/* Tab content */}
        <div className="px-4 mt-5 md:mt-3">
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
                      <ActiveOrderCard key={order.ID || order.id} order={order} onTrackMap={handleTrackMap} showCancelConfirm={showCancelConfirm} setShowCancelConfirm={setShowCancelConfirm} onCancel={handleCancel} onChat={() => setChatOrderId(order.ID || order.id)} />
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
                      <CompletedOrderCard key={order.ID || order.id} order={order} {...reviewProps} />
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
                      order.Status === "PENDING" || order.Status === "ACCEPTED" || order.Status === "IN_PROGRESS" ? (
                        <ActiveOrderCard key={order.ID || order.id} order={order} onTrackMap={handleTrackMap} showCancelConfirm={showCancelConfirm} setShowCancelConfirm={setShowCancelConfirm} onCancel={handleCancel} onChat={() => setChatOrderId(order.ID || order.id)} />
                      ) : (
                        <CompletedOrderCard key={order.ID || order.id} order={order} {...reviewProps} />
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
      <ChatDrawer
        orderId={chatOrderId || ""}
        currentUserId={user?.ID || ""}
        currentUserRole="customer"
        open={!!chatOrderId}
        onClose={() => setChatOrderId(null)}
      />
    </div>
  )
}
