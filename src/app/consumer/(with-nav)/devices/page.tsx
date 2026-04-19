'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/hooks/useAuth"
import { apiFetch } from "@/lib/api"
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronRight, Wrench, Smartphone, Laptop, Zap, Leaf, X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    const confirmed = window.confirm(
      "Hapus perangkat ini dari garasi digital?"
    )
    if (!confirmed) return

    try {
      const response = await apiFetch(`/api/devices/${deviceId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDevices(prev => prev.filter(d => d.ID !== deviceId))
      } else {
        console.error("Failed to delete device")
      }
    } catch (err) {
      console.error("Delete device error:", err)
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
      }
    } catch (err) {
      console.error("Failed to add device:", err)
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
      <div className="max-w-5xl mx-auto">
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
        <div className="px-4 md:pt-[72px] pb-6 space-y-6">
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
                                  onClick={() => handleDeleteDevice(device.ID)}
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
        <AnimatePresence>
          {showModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="fixed inset-0 z-50 bg-black/50"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-border/50 bg-card p-6 max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Add Device</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Category Selector */}
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

                  {/* Brand Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium block pb-1">Brand Name</Label>
                    <Input
                      placeholder="e.g., Apple, Samsung"
                      value={form.brand_name}
                      onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>

                  {/* Weight */}
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

                  {/* Buttons */}
                  <div className="space-y-2 pt-4">
                    <Button
                      onClick={handleAddDevice}
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Device"}
                    </Button>
                    <Button
                      onClick={() => setShowModal(false)}
                      variant="outline"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
