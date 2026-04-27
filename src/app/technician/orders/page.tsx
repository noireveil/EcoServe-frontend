"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { apiFetch } from "@/lib/api"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Camera, MapPinIcon, Trash2, Leaf, CheckCircle, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ToastNotification } from "@/components/ui/toast-notification"
import { useToast } from "@/hooks/useToast"
import { ChatDrawer } from "@/components/ui/chat-drawer"
import { cn } from "@/lib/utils"

type Tab = "active" | "completed" | "all"

export default function TechnicianOrdersPage() {
  const { user, isLoading: authLoading } = useAuth("technician")
  const router = useRouter()
  const { toasts, removeToast, toast } = useToast()
  const { data: orders = [], isLoading: ordersLoading, mutate: mutateOrders } = useSWR(
    "/api/orders/",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )
  const [activeTab, setActiveTab] = useState<Tab>("active")
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [chatOrderId, setChatOrderId] = useState<string | null>(null)
  const [photoUrl, setPhotoUrl] = useState("")
  const [serviceFee, setServiceFee] = useState<number>(0)

  const handleNavigate = (order: any) => {
    router.push(`/technician/map?lat=${order.CustomerLatitude}&lng=${order.CustomerLongitude}&orderId=${order.ID}`)
  }

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    _orderId: string
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAccept = async (orderId: string) => {
    try {
      const response = await apiFetch(`/api/orders/${orderId}/accept`, {
        method: "PUT",
      })
      if (response.ok) {
        await mutateOrders()
        toast.success("Order accepted!", "Navigate to customer location.")
      } else {
        const data = await response.json()
        console.error("Failed to accept:", data)
        toast.error("Failed to accept", "Please try again.")
      }
    } catch (err) {
      console.error("Accept error:", err)
      toast.error("Failed to accept", "Please try again.")
    }
  }

  const handleCancel = async (orderId: string) => {
    try {
      await mutateOrders()
      toast.success("Order cancelled", "The order has been removed.")
    } catch (err) {
      console.error("Cancel error:", err)
    }
  }

  const handleComplete = async (order: any) => {
    if (!photoUrl) {
      toast.warning("Photo required", "Upload a photo for anti-fraud verification.")
      return
    }

    try {
      setCompletingId(order.ID)

      let techLat = -6.2
      let techLng = 106.8

      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
        )
        techLat = position.coords.latitude
        techLng = position.coords.longitude
      } catch {
        console.log("Using default location")
      }

      const { calculateDistance } = await import("@/lib/haversine")
      const distanceKm = order.CustomerLatitude && order.CustomerLongitude
        ? calculateDistance(
            techLat, techLng,
            order.CustomerLatitude,
            order.CustomerLongitude
          )
        : 0

      const response = await apiFetch(`/api/orders/${order.ID}/complete`, {
        method: "PUT",
        body: JSON.stringify({
          category: order.DeviceCategory,
          device_weight: 0.5,
          distance_km: parseFloat(distanceKm.toFixed(2)),
          latitude: techLat,
          longitude: techLng,
          photo_url: photoUrl,
          service_fee: serviceFee,
        }),
      })

      if (response.ok) {
        await mutateOrders()
        setPhotoUrl("")
        toast.success("Order completed!", "Great work. Earnings have been updated.")
      } else {
        const data = await response.json()
        console.error("Failed to complete:", data)
        toast.error("Failed to complete", "Please try again.")
      }
    } catch (err) {
      console.error("Complete error:", err)
      toast.error("Failed to complete", "Please try again.")
    } finally {
      setCompletingId(null)
    }
  }

  const pendingJobs = orders.filter((o: any) => o.Status === "PENDING")
  const acceptedJobs = orders.filter((o: any) =>
    o.Status === "ACCEPTED" || o.Status === "IN_PROGRESS"
  )
  const completedJobs = orders.filter((o: any) => o.Status === "COMPLETED")

  if (authLoading || ordersLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-4">
      <ToastNotification toasts={toasts} onRemove={removeToast} />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 py-6">
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">{completedJobs.length} repairs completed</p>

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
                className="space-y-6"
              >
                {/* Pending Acceptance Section */}
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-muted-foreground">Pending Acceptance</h2>
                  {pendingJobs.length > 0 ? pendingJobs.map((order) => (
                    <Card key={order.ID} className="border-border/50 bg-card/50 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/50">Pending</Badge>
                      </div>
                      <h3 className="font-semibold text-base mb-1">{order.DeviceCategory}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{order.ProblemDescription}</p>
                      <div className="space-y-1 mb-4 pb-4 border-b border-border/30">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Customer: </span>
                          <span className="font-medium">{order.Customer?.FullName || "Unknown"}</span>
                        </p>
                        <div className="flex items-start gap-2">
                          <MapPinIcon size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            {order.CustomerLatitude && order.CustomerLongitude
                              ? `${order.CustomerLatitude.toFixed(4)}, ${order.CustomerLongitude.toFixed(4)}`
                              : "Location not available"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => handleAccept(order.ID)}
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Accept Order
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-destructive border-destructive/50 hover:bg-destructive/10"
                          onClick={() => handleCancel(order.ID)}
                        >
                          <Trash2 size={14} className="mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </Card>
                  )) : (
                    <p className="text-sm text-muted-foreground text-center py-3">No pending orders</p>
                  )}
                </div>

                {/* In Progress Section */}
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-muted-foreground">In Progress</h2>
                  {acceptedJobs.length > 0 ? acceptedJobs.map((order) => (
                    <Card key={order.ID} className="border-border/50 bg-card/50 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                          {order.Status === "IN_PROGRESS" ? "In Progress" : "Accepted"}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-base mb-1">{order.DeviceCategory}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{order.ProblemDescription}</p>
                      <div className="space-y-1 mb-4 pb-4 border-b border-border/30">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Customer: </span>
                          <span className="font-medium">{order.Customer?.FullName || "Unknown"}</span>
                        </p>
                        <div className="flex items-start gap-2">
                          <MapPinIcon size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            {order.CustomerLatitude && order.CustomerLongitude
                              ? `${order.CustomerLatitude.toFixed(4)}, ${order.CustomerLongitude.toFixed(4)}`
                              : "Location not available"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-primary text-primary hover:bg-primary/10"
                          onClick={() => handleNavigate(order)}
                        >
                          <MapPin size={14} className="mr-1" />
                          Navigate
                        </Button>
                        <label className="flex items-center justify-center gap-1 py-2 rounded-lg border border-border text-sm cursor-pointer hover:bg-secondary/50">
                          <Camera className="w-4 h-4" />
                          {photoUrl ? "Photo Ready ✓" : "Upload Photo"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(e, order.ID)}
                          />
                        </label>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          Total Biaya Servis (Rp)
                        </label>
                        <input
                          type="number"
                          placeholder="Contoh: 150000"
                          value={serviceFee}
                          onChange={(e) => setServiceFee(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {serviceFee > 0 && (
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-muted-foreground">Estimasi pendapatan bersih (90%):</span>
                            <span className="text-[#5fc036] font-semibold">
                              Rp {(serviceFee * 0.9).toLocaleString("id-ID")}
                            </span>
                          </div>
                        )}
                        {serviceFee > 0 && (
                          <p className="text-xs text-muted-foreground">
                            * Komisi platform 10% = Rp {(serviceFee * 0.1).toLocaleString("id-ID")}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setChatOrderId(order.ID)}
                        className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 mb-2 rounded-lg border border-primary/50 text-primary text-xs font-medium hover:bg-primary/10 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Chat
                      </button>
                      <button
                        onClick={() => handleComplete(order)}
                        disabled={completingId === order.ID}
                        className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                      >
                        {completingId === order.ID ? "Completing..." : "Complete Job"}
                      </button>
                    </Card>
                  )) : (
                    <p className="text-sm text-muted-foreground text-center py-3">No jobs in progress</p>
                  )}
                </div>
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
                {completedJobs.length > 0 ? completedJobs.map((order) => (
                  <Card
                    key={order.ID}
                    className="border-border/50 bg-card/50 p-4 hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">{order.DeviceCategory}</h3>
                        <p className="text-sm text-muted-foreground">{order.ProblemDescription}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.UpdatedAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{order.Customer?.FullName || "Unknown"}</span>
                      <div className="flex items-center gap-1">
                        <Leaf size={14} className="text-primary" />
                        <span className="text-xs">{order.EWasteSavedKg || 0} kg saved</span>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No completed jobs</p>
                  </div>
                )}
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
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-muted-foreground mb-3">Active</h2>
                  {[...pendingJobs, ...acceptedJobs].length > 0 ? (
                    [...pendingJobs, ...acceptedJobs].map((order) => (
                      <Card key={order.ID} className="border-border/50 bg-card/50 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className={cn(
                            order.Status === "PENDING"
                              ? "bg-blue-500/20 text-blue-500 border-blue-500/50"
                              : "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                          )}>
                            {order.Status === "PENDING" ? "Pending" : order.Status === "ACCEPTED" ? "Accepted" : "In Progress"}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-base mb-1">{order.DeviceCategory}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{order.ProblemDescription}</p>
                        <div className="space-y-1 mb-4 pb-4 border-b border-border/30">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Customer: </span>
                            <span className="font-medium">{order.Customer?.FullName || "Unknown"}</span>
                          </p>
                          <div className="flex items-start gap-2">
                            <MapPinIcon size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                            <p className="text-xs text-muted-foreground">
                              {order.CustomerLatitude && order.CustomerLongitude
                                ? `${order.CustomerLatitude.toFixed(4)}, ${order.CustomerLongitude.toFixed(4)}`
                                : "Location not available"}
                            </p>
                          </div>
                        </div>
                        {order.Status === "PENDING" ? (
                          <div className="grid grid-cols-2 gap-2">
                            <Button size="sm" className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => handleAccept(order.ID)}>
                              <CheckCircle size={14} className="mr-1" />Accept Order
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs text-destructive border-destructive/50 hover:bg-destructive/10" onClick={() => handleCancel(order.ID)}>
                              <Trash2 size={14} className="mr-1" />Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <Button variant="outline" size="sm" className="text-xs border-primary text-primary hover:bg-primary/10" onClick={() => handleNavigate(order)}>
                                <MapPin size={14} className="mr-1" />Navigate
                              </Button>
                              <label className="flex items-center justify-center gap-1 py-2 rounded-lg border border-border text-sm cursor-pointer hover:bg-secondary/50">
                                <Camera className="w-4 h-4" />
                                {photoUrl ? "Photo Ready ✓" : "Upload Photo"}
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, order.ID)} />
                              </label>
                            </div>
                            <input
                              type="number"
                              placeholder="Harga jasa (Rp)"
                              value={serviceFee}
                              onChange={(e) => setServiceFee(Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-sm mb-2"
                            />
                            <button
                              onClick={() => setChatOrderId(order.ID)}
                              className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 mb-2 rounded-lg border border-primary/50 text-primary text-xs font-medium hover:bg-primary/10 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              Chat
                            </button>
                            <button onClick={() => handleComplete(order)} disabled={completingId === order.ID} className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
                              {completingId === order.ID ? "Completing..." : "Complete Job"}
                            </button>
                          </>
                        )}
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No active jobs</p>
                  )}
                </div>

                {/* Completed section */}
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-3 mt-6">Completed</h2>
                  {completedJobs.length > 0 ? (
                    <div className="space-y-3">
                      {completedJobs.map((order) => (
                        <Card
                          key={order.ID}
                          className="border-border/50 bg-card/50 p-4 hover:bg-card/80 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-base">{order.DeviceCategory}</h3>
                              <p className="text-sm text-muted-foreground">{order.ProblemDescription}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.UpdatedAt).toLocaleDateString("id-ID")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{order.Customer?.FullName || "Unknown"}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Leaf size={14} className="text-primary" />
                                <span className="text-xs">{order.EWasteSavedKg || 0} kg saved</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No completed jobs</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <ChatDrawer
        orderId={chatOrderId || ""}
        currentUserId={user?.ID || ""}
        currentUserRole="technician"
        open={!!chatOrderId}
        onClose={() => setChatOrderId(null)}
      />
    </div>
  )
}
