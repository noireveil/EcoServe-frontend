'use client'

import { useState, useEffect } from 'react'
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Camera, Plus, Wand2, Brain, MapPin, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToastNotification } from '@/components/ui/toast-notification'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { apiFetch } from '@/lib/api'
import Image from 'next/image'
import type { Device } from '@/types'

type DiagnosisState = 'input' | 'loading' | 'high-confidence' | 'low-confidence'

interface NearbyTechnician {
  ID: string
  Specialization?: string
  Rating?: number
  TotalRepairs?: number
  ExperienceYears?: number
  Latitude?: number
  Longitude?: number
  DistanceKm?: number
  User?: { FullName?: string; ProfilePictureURL?: string; PhoneNumber?: string }
}

interface DiagnosisResult {
  diagnosis: {
    confidence_score: number
    category: string
    analysis: string
    mitigation?: string
  }
  is_fallback_active?: boolean
  technicians?: NearbyTechnician[]
}

export default function AIDiagnosisPage() {
  const { isLoading: authLoading } = useAuth("customer")
  const router = useRouter()
  const [state, setState] = useState<DiagnosisState>('input')
  const [selectedDevice, setSelectedDevice] = useState('')
  const [selectedDeviceObj, setSelectedDeviceObj] = useState<Device | null>(null)
  const [description, setDescription] = useState('')
  const [photoBase64, setPhotoBase64] = useState<string>('')
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null)
  const [devices, setDevices] = useState<Device[]>([])
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoBase64(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!description.trim() && !photoBase64) {
      toast.error("Input required", "Please describe the problem or upload a photo")
      return
    }
    setState('loading')

    try {
      const getLocation = (): Promise<GeolocationPosition> =>
        new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        )

      let latitude = -6.2
      let longitude = 106.8

      try {
        const position = await getLocation()
        latitude = position.coords.latitude
        longitude = position.coords.longitude
      } catch {
        console.log("Using default location")
      }

      const response = await apiFetch("/api/chatbot/triage", {
        method: "POST",
        body: JSON.stringify({
          message: description || "Analyze this device from the photo",
          latitude,
          longitude,
          ...(photoBase64 && { photo: photoBase64 }),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || "Failed to analyze")
      }

      const data = await response.json()
      const result = data.data

      setDiagnosisResult(result)

      if (result.is_fallback_active) {
        setState("low-confidence")
      } else {
        setState("high-confidence")
      }

    } catch (err) {
      console.error("Triage error:", err)
      setState("input")
      toast.error("Analysis failed", "Gagal memproses diagnosis AI. Please try again.")
    }
  }

  const handleBookTechnician = async (technicianId?: string) => {
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
          device_category: diagnosisResult?.diagnosis?.category || selectedDevice,
          problem_description: description,
          customer_latitude: latitude,
          customer_longitude: longitude,
          device_id: selectedDeviceObj?.ID || null,
          ...(technicianId && { technician_id: technicianId }),
        }),
      })

      if (response.ok) {
        toast.success("Technician booked!", "Your order has been created.")
        router.push("/consumer/orders")
      } else {
        const text = await response.text()
        console.error("Failed to book, status:", response.status, "body:", text)
        toast.error("Failed to book", "Please try again.")
      }
    } catch (err) {
      console.error("Book technician error:", err)
      toast.error("Failed to book", "Please try again.")
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
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center gap-3">
          <Link href="/consumer/dashboard">
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
          <h1 className="text-lg font-semibold">AI Diagnosis</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-20">
        <AnimatePresence mode="wait">
          {/* STATE 1: INPUT FORM */}
          {state === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 py-6"
            >
              {/* Select Device */}
              <div className="space-y-3">
                <label className="block text-sm font-medium pb-1">Select Device</label>
                {devices.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {devices.map((device) => (
                      <button
                        key={device.ID}
                        onClick={() => {
                          setSelectedDevice(device.BrandName)
                          setSelectedDeviceObj(device)
                        }}
                        className={cn(
                          'px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all',
                          selectedDevice === device.BrandName
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border bg-card hover:bg-secondary'
                        )}
                      >
                        {device.BrandName}
                      </button>
                    ))}
                    <button
                      onClick={() => router.push('/consumer/devices')}
                      className={cn(
                        'px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all',
                        'border border-border bg-card hover:bg-secondary flex items-center gap-2'
                      )}
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add a device first to use AI Diagnosis
                  </p>
                )}
              </div>

              {/* Describe Problem */}
              <div className="space-y-3">
                <label className="block text-sm font-medium pb-1">Describe the Problem</label>
                <div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what's wrong... e.g. my phone won't turn on, screen is cracked, battery drains fast"
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Describe the problem or upload a photo for AI analysis</span>
                    <span>{description.length}/500</span>
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium pb-1">Try it with Photo</label>
                {photoBase64 ? (
                  <div className="relative">
                    <Image src={photoBase64} alt="Device photo" width={400} height={180} unoptimized className="w-full h-90 object-cover rounded-xl" />
                    <button
                      onClick={() => setPhotoBase64('')}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/30">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Tap to upload photo (optional)</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!description.trim() && !photoBase64}
                className={cn(
                  "w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2",
                  description.trim() || photoBase64
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Wand2 className="w-5 h-5" />
                Analyze with AI
              </button>
              <p className="text-xs text-muted-foreground text-center">Powered by Gemini AI</p>
            </motion.div>
          )}

          {/* STATE 2: LOADING */}
          {state === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-6"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-12 h-12 text-primary" />
              </motion.div>
              <div className="text-center space-y-2">
                <p className="font-semibold">Analyzing your device...</p>
                <p className="text-sm text-muted-foreground">This usually takes a few seconds</p>
              </div>
              <motion.div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* STATE 3A: HIGH CONFIDENCE */}
          {state === 'high-confidence' && (
            <motion.div
              key="high-confidence"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 py-6"
            >
              {/* Success Card */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-lg bg-gradient-to-br from-[#4a9a2e]/30 to-[#5cb83a]/20 border border-[#7ed957]/30 p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-400 mb-2">DIY Fix Available ✓</p>
                      <p className="text-xs font-medium text-muted-foreground">
                        Confidence: {((diagnosisResult?.diagnosis?.confidence_score ?? 0) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{diagnosisResult?.diagnosis?.category}</h3>
                  <p className="text-sm text-muted-foreground">{diagnosisResult?.diagnosis?.analysis}</p>
                </div>

                {/* Steps */}
                {diagnosisResult?.diagnosis?.mitigation && (
                  <div className="space-y-3 pt-2">
                    <p className="text-sm font-semibold">Step-by-step guide:</p>
                    <ol className="space-y-2">
                      {diagnosisResult.diagnosis.mitigation.split('\n').filter((s: string) => s.trim()).map((step: string, idx: number) => (
                        <li key={idx} className="flex gap-3 text-sm">
                          <span className="font-semibold text-primary flex-shrink-0">
                            {idx + 1}.
                          </span>
                          <span className="text-muted-foreground">{step.replace(/^\d+[\.\)]\s*/, '')}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Warning */}
                <div className="flex gap-2 bg-black/20 rounded p-3 text-xs text-muted-foreground">
                  <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span>If unsure, we recommend booking a technician</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-11" onClick={() => setState('input')}>
                  Try DIY Fix
                </Button>
                <Button className="h-11 bg-primary hover:bg-primary/90" onClick={() => handleBookTechnician()}>
                  Book Technician
                </Button>
              </div>

              <button
                onClick={() => setState('input')}
                className="w-full text-sm text-primary hover:underline"
              >
                Start new diagnosis
              </button>
            </motion.div>
          )}

          {/* STATE 3B: LOW CONFIDENCE */}
          {state === 'low-confidence' && (
            <motion.div
              key="low-confidence"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 py-6"
            >
              {/* Warning Card */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-lg bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border border-yellow-500/30 p-6 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-yellow-400 mb-2">Professional Help Recommended</p>
                    <p className="text-sm font-medium">{diagnosisResult?.diagnosis?.category}</p>
                    <p className="text-xs text-muted-foreground">{diagnosisResult?.diagnosis?.analysis}</p>
                  </div>
                </div>

                {/* Map Pin Animation */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex justify-center py-4"
                >
                  <div className="relative">
                    <MapPin className="w-8 h-8 text-primary" />
                    <motion.div
                      animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 border-2 border-primary rounded-full"
                    />
                  </div>
                </motion.div>

                <p className="text-sm text-center text-muted-foreground">
                  Connecting you to nearest technician...
                </p>
              </motion.div>

              {/* Technician Card */}
              {diagnosisResult?.is_fallback_active && (
                <>
                  {!diagnosisResult?.technicians || diagnosisResult?.technicians?.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="rounded-lg border border-border bg-card p-4 space-y-4 text-center"
                    >
                      <p className="text-sm text-muted-foreground">
                        Maaf, belum ada teknisi tersedia di area Anda saat ini.
                      </p>
                      <Button
                        onClick={() => handleBookTechnician()}
                        className="w-full h-11 bg-primary hover:bg-primary/90 font-semibold"
                      >
                        Book Technician
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-3"
                    >
                      {diagnosisResult?.technicians?.map((tech: NearbyTechnician) => (
                        <div key={tech.ID} className="rounded-lg border border-border bg-card p-4 space-y-4">
                          <div className="flex items-start gap-3">
                            {tech.User?.ProfilePictureURL ? (
                              <Image
                                src={tech.User.ProfilePictureURL!}
                                alt={tech.User?.FullName || "Technician"}
                                width={48}
                                height={48}
                                unoptimized
                                className="w-12 h-12 rounded-lg object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {tech.User?.FullName
                                  ?.split(" ").map((n: string) => n[0])
                                  .join("").toUpperCase().slice(0, 2) || "T?"}
                              </div>
                            )}

                            <div className="flex-1">
                              <p className="font-semibold">{tech.User?.FullName || "Technician"}</p>
                              <p className="text-xs text-muted-foreground">
                                {tech.Specialization || "General Repair"}
                                {(tech.ExperienceYears ?? 0) > 0 ? ` • ${tech.ExperienceYears} yr exp` : ""}
                                {(tech.Rating ?? 0) > 0 ? ` • ⭐ ${tech.Rating}` : ""}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleBookTechnician(tech.ID)}
                            className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                          >
                            Book This Technician
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </>
              )}

              <button
                onClick={() => setState('input')}
                className="w-full text-sm text-primary hover:underline"
              >
                Start new diagnosis
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
