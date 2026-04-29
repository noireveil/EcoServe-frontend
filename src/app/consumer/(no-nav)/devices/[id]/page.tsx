"use client"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Smartphone, Laptop, Zap, Calendar, Weight, Leaf } from "lucide-react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { useAuth } from "@/hooks/useAuth"

function CategoryIcon({ category, className }: { category: string; className?: string }) {
  if (category === "Smartphone") return <Smartphone className={className} />
  if (category === "Laptop") return <Laptop className={className} />
  return <Zap className={className} />
}

export default function DeviceDetailPage() {
  const { isLoading: authLoading } = useAuth("customer")
  const params = useParams()
  const router = useRouter()

  const { data: device, isLoading } = useSWR(
    params.id ? `/api/devices/${params.id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  )

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
        <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(to bottom right, #5cb83a, #4a9a2e)" }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-white/20
                            flex items-center justify-center">
              <CategoryIcon category={device.Category} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{device.BrandName}</h2>
              <p style={{ color: "rgba(255,255,255,0.85)" }}>{device.Category}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">
                {device.total_repairs || 0}
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>Repairs</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">
                {device.WeightInKg}
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>kg</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-lg font-bold">Active</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>Status</p>
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
        <div className="rounded-xl border border-[#7ed957]/30
                        bg-[#7ed957]/5 p-4">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <Leaf className="w-5 h-5 text-[#5fc036]" />
            Eco Impact
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#7ed957]/10 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-[#5fc036]">
                {((device.total_repairs || 0) *
                  device.WeightInKg * 70).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">
                kg CO₂ Avoided
              </p>
            </div>
            <div className="bg-[#7ed957]/10 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-[#5fc036]">
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
