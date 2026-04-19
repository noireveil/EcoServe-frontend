"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { MapPin, Loader2 } from "lucide-react"

const SPECIALIZATIONS = [
  "General Repair",
  "Screen & Display",
  "Battery",
  "Motherboard",
  "AC & Cooling",
  "Home Appliance",
]

export default function TechnicianOnboardingPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    specialization: "General Repair",
    experience_years: 1,
    location_description: "",
  })
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung browser ini")
      return
    }
    setIsLocating(true)
    setError("")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setIsLocating(false)
      },
      () => {
        setError("Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.")
        setIsLocating(false)
      }
    )
  }

  const handleSubmit = async () => {
    if (!coords) {
      setError("Silakan ambil lokasi GPS terlebih dahulu")
      return
    }
    if (!form.location_description.trim()) {
      setError("Deskripsi lokasi wajib diisi")
      return
    }

    setIsSubmitting(true)
    setError("")
    try {
      console.log("Payload:", JSON.stringify({
        specialization: form.specialization,
        experience_years: form.experience_years,
        latitude: coords.lat,
        longitude: coords.lng,
        location: form.location_description,
      }))

      const response = await apiFetch("/api/technicians/", {
        method: "POST",
        body: JSON.stringify({
          specialization: form.specialization,
          experience_years: form.experience_years,
          location_description: form.location_description,
          latitude: coords.lat,
          longitude: coords.lng,
        }),
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", JSON.stringify(data, null, 2))

      if (response.ok) {
        router.replace("/technician/dashboard")
      } else {
        setError(data.message || "Gagal menyimpan profil teknisi")
      }
    } catch (err) {
      console.error("Onboarding error:", err)
      setError("Terjadi kesalahan jaringan")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <span className="text-3xl">🔧</span>
          </div>
          <h1 className="text-2xl font-bold">Selamat Datang, Teknisi!</h1>
          <p className="text-sm text-muted-foreground">
            Lengkapi profil Anda untuk mulai menerima order perbaikan
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-5">

          {/* Specialization */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Spesialisasi</label>
            <select
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Experience Years */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Pengalaman (tahun)</label>
            <input
              type="number"
              min={0}
              max={50}
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Location Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Area Layanan</label>
            <input
              type="text"
              placeholder="Contoh: Jakarta Selatan"
              value={form.location_description}
              onChange={(e) => setForm({ ...form, location_description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* GPS Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Lokasi GPS</label>
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-primary/50 text-primary text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              {isLocating ? "Mengambil lokasi..." : "Set My Location"}
            </button>
            {coords && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-muted-foreground font-mono">
                📍 {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !coords}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Mulai Bekerja"}
          </button>
        </div>
      </div>
    </div>
  )
}
