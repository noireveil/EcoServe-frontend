'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/hooks/useAuth"
import { apiFetch } from "@/lib/api"
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronRight, Wrench, Smartphone, Laptop, Zap, Leaf, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { ToastNotification } from '@/components/ui/toast-notification'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

const categoryMap: Record<string, string> = {
  'Smartphone': 'Smartphone',
  'Laptop': 'Laptop',
  'Pendingin & Komersial': 'Pendingin & Komersial',
  'Peralatan Rumah Tangga': 'Peralatan Rumah Tangga',
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Smartphone':
      return <Smartphone className="w-8 h-8" />
    case 'Laptop':
      return <Laptop className="w-8 h-8" />
    default:
      return <Zap className="w-8 h-8" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Smartphone':
      return 'bg-blue-500/20'
    case 'Laptop':
      return 'bg-purple-500/20'
    default:
      return 'bg-amber-500/20'
  }
}

export default function MyDevicesPage() {
  const { isLoading: authLoading } = useAuth("customer")
  const router = useRouter()
  const [devices, setDevices] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toasts, removeToast, toast } = useToast()
  const [form, setForm] = useState({
    brand_name: "",
    category: "Smartphone",
    weight_in_kg: 0,
  })

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await apiFetch("/api/devices/")
        if (response.ok) {
          const data = await response.json()
          setDevices(data.data || [])
        }
      } catch (err) {
        console.error("Failed to fetch devices:", err)
      }
    }
    fetchDevices()
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiFetch("/api/orders/")
        if (response.ok) {
          const data = await response.json()
          setOrders(data.data || [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchOrders()
  }, [])

  const completedOrders = orders.filter(o => o.Status === "COMPLETED")
  const totalRepairs = devices.reduce((sum, d) => sum + (d.total_repairs || 0), 0)
  const totalCO2Saved = completedOrders.reduce((sum, o) => sum + (o.EWasteSavedKg || 0), 0).toFixed(1)

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      const response = await apiFetch(`/api/devices/${deviceId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDevices(prev => prev.filter(d => d.ID !== deviceId))
        setDeleteConfirmId(null)
        toast.success("Device removed", "Device has been deleted from your garage.")
      } else {
        toast.error("Delete failed", "Could not remove the device. Please try again.")
        setDeleteConfirmId(null)
      }
    } catch (err) {
      toast.error("Delete failed", "Something went wrong. Please try again.")
      setDeleteConfirmId(null)
    }
  }

  const handleAddDevice = async () => {
    if (!form.brand_name || !form.category || !form.weight_in_kg) return

    setIsSubmitting(true)
    try {
      const response = await apiFetch("/api/devices/", {
        method: "POST",
        body: JSON.stringify({
          brand_name: form.brand_name,
          category: form.category,
          weight_in_kg: parseFloat(form.weight_in_kg.toString()),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setDevices(prev => [data.data, ...prev])
        setForm({ brand_name: "", category: "Smartphone", weight_in_kg: 0 })
        setShowModal(false)
        toast.success("Device added", `${form.brand_name} has been added to your garage.`)
      } else {
        toast.error("Add failed", "Could not add the device. Please try again.")
      }
    } catch (err) {
      toast.error("Add failed", "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 md:top-16 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-4 py-4">
            <h1 className="text-xl font-bold text-foreground">My Devices</h1>
            <Button
              size="sm"
              onClick={() => setShowModal(true)}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Add Device
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 pb-6 space-y-6">
          {devices.length > 0 ? (
            <>
              {/* Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 to-primary/5 p-6 mt-5"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">Your Digital Garage</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-primary">{devices.length}</span>
                    <span className="text-xs text-muted-foreground">Devices</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-primary">{totalRepairs}</span>
                    <span className="text-xs text-muted-foreground">Repairs</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-primary">{totalCO2Saved} kg</span>

                    <span className="text-xs text-muted-foreground">CO₂ Saved</span>
                  </div>
                </div>
              </motion.div>

              {/* Device List */}
              <div className="space-y-3">
                <AnimatePresence>
                  {devices.map((device, index) => (
                    <motion.div
                      key={device.ID || device.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden border-border/50 bg-card/50 hover:bg-card/80 transition-colors cursor-pointer">
                        <div className="p-4 space-y-3">
                          {/* Top section: Icon, Info, Status */}
                          <div className="flex items-start gap-3">
                            {/* Left: Icon */}
                            <div
                              className={cn(
                                'w-12 h-12 rounded-lg flex items-center justify-center text-primary flex-shrink-0',
                                getCategoryColor(device.Category)
                              )}
                            >
                              {getCategoryIcon(device.Category)}
                            </div>

                            {/* Center: Device Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate">{device.BrandName}</h3>
                              <p className="text-xs text-muted-foreground">
                                {device.Category}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {device.WeightInKg} kg
                              </p>
                            </div>

                            {/* Right: Status, Delete & Chevron */}
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setDeleteConfirmId(device.ID)}
                                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30">
                                  Active
                                </Badge>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </div>

                          {/* Bottom: Repair History & Passport */}
                          <div className="flex items-center justify-between pt-2 border-t border-border/30">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Wrench className="w-4 h-4" />
                              <span>{device.total_repairs || 0} repairs</span>
                            </div>
                            <button
                              onClick={() => router.push(`/consumer/devices/${device.ID}`)}
                              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                              View Passport
                            </button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 px-4"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">No devices yet</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Add your first device to start tracking your eco impact
              </p>
              <Button
                onClick={() => setShowModal(true)}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Add First Device
              </Button>
            </motion.div>
          )}
        </div>

        {/* Add Device Modal */}
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title="Add Device"
          size="md"
          footer={
            <>
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleAddDevice}
                disabled={isSubmitting || !form.brand_name || !form.weight_in_kg}
              >
                {isSubmitting ? "Saving..." : "Save Device"}
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium block pb-1">Device Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(categoryMap).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setForm({ ...form, category: cat })}
                    className={cn(
                      'py-2 px-3 rounded-lg border transition-colors text-xs font-medium',
                      form.category === cat
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/50 text-muted-foreground hover:border-border'
                    )}
                  >
                    {cat === 'Smartphone' && <Smartphone className="w-4 h-4 mx-auto mb-1" />}
                    {cat === 'Laptop' && <Laptop className="w-4 h-4 mx-auto mb-1" />}
                    {cat === 'Pendingin & Komersial' && <Zap className="w-4 h-4 mx-auto mb-1" />}
                    {cat === 'Peralatan Rumah Tangga' && <Zap className="w-4 h-4 mx-auto mb-1" />}
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium block pb-1">Brand Name</Label>
              <Input
                placeholder="e.g., Apple, Samsung"
                value={form.brand_name}
                onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium block pb-1">Weight (kg)</Label>
              <Input
                type="number"
                placeholder="0.19"
                step="0.01"
                value={form.weight_in_kg || ""}
                onChange={(e) => setForm({ ...form, weight_in_kg: parseFloat(e.target.value) || 0 })}
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </div>
        </Modal>

        {/* Delete Confirm Modal */}
        <Modal
          open={deleteConfirmId !== null}
          onClose={() => setDeleteConfirmId(null)}
          title="Remove Device?"
          variant="destructive"
          size="sm"
          footer={
            <>
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
                onClick={() => deleteConfirmId && handleDeleteDevice(deleteConfirmId)}
              >
                Yes, Remove
              </Button>
            </>
          }
        >
          <p className="text-sm text-muted-foreground">
            This device will be removed from your digital garage. This action cannot be undone.
          </p>
        </Modal>

        <ToastNotification toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  )
}
