"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { ToastNotification } from "@/components/ui/toast-notification"
import { useToast } from "@/hooks/useToast"
import Link from "next/link"

export default function ReportDamagePage() {
  const { isLoading: authLoading } = useAuth("customer")
  const router = useRouter()

  const [devices, setDevices] = useState<any[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const { toasts, removeToast, toast } = useToast()

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await apiFetch("/api/devices/")
        if (response.ok) {
          const data = await response.json()
          setDevices(data.data || [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchDevices()
  }, [])

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please describe the problem")
      return
    }
    if (!selectedCategory) {
      setError("Please select a device category")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      let latitude = -6.2
      let longitude = 106.8

      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
        )
        latitude = position.coords.latitude
        longitude = position.coords.longitude
      } catch {
        console.log("Using default location")
      }

      const response = await apiFetch("/api/orders/", {
        method: "POST",
        body: JSON.stringify({
          device_category: selectedCategory,
          problem_description: description,
          customer_latitude: latitude,
          customer_longitude: longitude,
          ...(selectedDeviceId && { device_id: selectedDeviceId }),
        }),
      })

      if (response.ok) {
        toast.success("Order submitted!", "Technicians in your area will be notified.")
        setTimeout(() => {
          router.push("/consumer/orders")
        }, 1500)
      } else {
        const data = await response.json()
        const msg = data.message || "Failed to submit order"
        setError(msg)
        toast.error("Failed to submit", msg)
      }
    } catch (err) {
      console.error(err)
      setError("Failed to submit. Please try again.")
      toast.error("Failed to submit", "Please try again.")
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
    <div className="min-h-screen bg-background">
      <ToastNotification toasts={toasts} onRemove={removeToast} />
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href="/consumer/dashboard">
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
          <h1 className="text-lg font-semibold">Report Damage</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">

        {/* Select Device */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Select Device (Optional)
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {devices.map((device) => (
              <button
                key={device.ID}
                onClick={() => {
                  setSelectedDeviceId(device.ID)
                  setSelectedCategory(device.Category)
                }}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  selectedDeviceId === device.ID
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card hover:bg-secondary"
                }`}
              >
                {device.BrandName}
              </button>
            ))}
          </div>
        </div>

        {/* Device Category */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Device Category *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Smartphone",
              "Laptop",
              "IT & Gadget",
              "Pendingin & Komersial",
              "Peralatan Rumah Tangga",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                  selectedCategory === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Describe the Problem *
          </label>
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what's wrong with your device..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {description.length}/500
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
          <p className="text-xs text-primary">
            💡 Your order will be visible to all nearby technicians.
            The first available technician will accept your order.
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Repair Request"}
        </button>
      </div>
    </div>
  )
}
