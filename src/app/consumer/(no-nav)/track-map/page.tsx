"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const MapWithRoute = dynamic(
  () => import("@/components/consumer/map-with-route"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
)

function TrackMapContent() {
  const { isLoading: authLoading } = useAuth("customer")
  const searchParams = useSearchParams()
  const router = useRouter()

  const techLat = searchParams.get("techLat")
  const techLng = searchParams.get("techLng")
  const custLat = searchParams.get("custLat")
  const custLng = searchParams.get("custLng")
  const techName = searchParams.get("techName") || "Technician"

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full">
      <MapWithRoute
        techLocation={[parseFloat(techLat!), parseFloat(techLng!)]}
        custLocation={[parseFloat(custLat!), parseFloat(custLng!)]}
        techName={techName}
      />

      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-[1000] bg-card/90 backdrop-blur-sm rounded-full p-2 border border-border/50 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-card/95 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg px-4 py-2">
        <p className="text-sm font-medium">🔧 {techName} is on the way</p>
      </div>
    </div>
  )
}

export default function TrackMapPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    }>
      <TrackMapContent />
    </Suspense>
  )
}
