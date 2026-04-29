"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { useSearchParams, useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { ArrowLeft } from "lucide-react"
import type { Order } from "@/types"

const MapWithRouting = dynamic(
  () => import("@/components/technician/map-with-routing"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center bg-secondary h-full w-full">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
)

import { Suspense } from "react"

function TechnicianMapContent() {
  const { isLoading: authLoading } = useAuth("technician")
  const searchParams = useSearchParams()
  const router = useRouter()

  const targetLat = searchParams.get("lat")
  const targetLng = searchParams.get("lng")

  const locationSet = useRef(false)
  const [userLocation, setUserLocation] = useState<[number, number]>([-6.2088, 106.8456])
  const [nearbyOrders, setNearbyOrders] = useState<Order[]>([])
  const [instructions, setInstructions] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (locationSet.current) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!locationSet.current) {
          locationSet.current = true
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ])
        }
      },
      () => {
        locationSet.current = true
      }
    )
  }, [])

  useEffect(() => {
    const fetchIncoming = async () => {
      try {
        const response = await apiFetch("/api/orders/incoming")
        if (response.ok) {
          const data = await response.json()
          setNearbyOrders(data.data || [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchIncoming()
  }, [])

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full">
      <MapWithRouting
        userLocation={userLocation}
        targetLat={targetLat ? parseFloat(targetLat) : null}
        targetLng={targetLng ? parseFloat(targetLng) : null}
        nearbyOrders={nearbyOrders}
        onInstructions={setInstructions}
      />

      {/* Floating back button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-[1000] bg-card/90 backdrop-blur-sm rounded-full p-2 border border-border/50 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Floating instructions card */}
      {targetLat && targetLng && instructions.length > 0 && (
        <div className="absolute bottom-24 right-4 z-[1000] w-64 bg-card/95 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl overflow-hidden">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-between px-4 py-3 border-b border-border/50"
          >
            <span className="text-sm font-semibold">🗺 Navigation</span>
            <span className="text-xs text-muted-foreground">
              {isCollapsed ? "Show" : "Hide"}
            </span>
          </button>

          {!isCollapsed && (
            <div className="max-h-48 overflow-y-auto px-4 py-2 space-y-2">
              {instructions.map((step, idx) => (
                <div key={idx} className="flex gap-2 text-xs">
                  <span className="text-primary font-semibold shrink-0">{idx + 1}.</span>
                  <span className="text-foreground">{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function TechnicianMapPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    }>
      <TechnicianMapContent />
    </Suspense>
  )
}
