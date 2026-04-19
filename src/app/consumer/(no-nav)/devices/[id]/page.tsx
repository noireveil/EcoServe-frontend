"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Smartphone, Laptop,
         Zap, Calendar, Weight, Wrench,
         Leaf } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

export default function DeviceDetailPage() {
  const { user, isLoading: authLoading } = useAuth("customer")
  const params = useParams()
  const router = useRouter()
  const [device, setDevice] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await apiFetch(`/api/devices/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          console.log("Device detail:", JSON.stringify(data, null, 2))
          setDevice(data.data || data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    if (params.id) fetchDevice()
  }, [params.id])

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center
                      justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  if (!device) {
    return (
      <div className="flex min-h-screen items-center
                      justify-center bg-background">
        <p className="text-muted-foreground">Device not found</p>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    if (category === "Smartphone") return Smartphone
    if (category === "Laptop") return Laptop
    return Zap
  }

  const Icon = getCategoryIcon(device.Category)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border/50
                      bg-background/95 backdrop-blur">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 text-muted-foreground
                                  hover:text-foreground" />
          </button>
          <h1 className="text-lg font-semibold">Device Passport</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">

        {/* Device Hero Card */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600
                        to-emerald-800 p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-white/20
                            flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{device.BrandName}</h2>
              <p className="text-emerald-100">{device.Category}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">
                {device.total_repairs || 0}
              </p>
              <p className="text-xs text-emerald-100">Repairs</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">
                {device.WeightInKg}
              </p>
              <p className="text-xs text-emerald-100">kg</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-lg font-bold">Active</p>
              <p className="text-xs text-emerald-100">Status</p>
            </div>
          </div>
        </div>

        {/* Device Info */}
        <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
          <h3 className="font-semibold">Device Information</h3>

          <div className="space-y-2">
            <div className="flex justify-between py-2
                            border-b border-border/30">
              <span className="text-sm text-muted-foreground
                               flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Brand & Model
              </span>
              <span className="text-sm font-medium">
                {device.BrandName}
              </span>
            </div>

            <div className="flex justify-between py-2
                            border-b border-border/30">
              <span className="text-sm text-muted-foreground
                               flex items-center gap-2">
                <Zap className="w-4 h-4" /> Category
              </span>
              <span className="text-sm font-medium">
                {device.Category}
              </span>
            </div>

            <div className="flex justify-between py-2
                            border-b border-border/30">
              <span className="text-sm text-muted-foreground
                               flex items-center gap-2">
                <Weight className="w-4 h-4" /> Weight
              </span>
              <span className="text-sm font-medium">
                {device.WeightInKg} kg
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground
                               flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Registered
              </span>
              <span className="text-sm font-medium">
                {new Date(device.CreatedAt)
                  .toLocaleDateString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Eco Impact */}
        <div className="rounded-xl border border-emerald-500/30
                        bg-emerald-500/5 p-4">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <Leaf className="w-5 h-5 text-emerald-400" />
            Eco Impact
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-500/10 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-emerald-400">
                {((device.total_repairs || 0) *
                  device.WeightInKg * 70).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">
                kg CO₂ Avoided
              </p>
            </div>
            <div className="bg-emerald-500/10 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-emerald-400">
                {device.total_repairs || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                Times Repaired
              </p>
            </div>
          </div>
        </div>

        {/* DPP ID */}
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <h3 className="font-semibold mb-2">Digital Product Passport</h3>
          <p className="text-xs text-muted-foreground font-mono
                        break-all bg-secondary/50 p-2 rounded-lg">
            {device.ID}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Unique identifier for this device in EcoServe ecosystem
          </p>
        </div>

      </div>
    </div>
  )
}
