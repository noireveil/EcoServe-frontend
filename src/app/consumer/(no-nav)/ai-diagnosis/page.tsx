'use client'

import { useState, useRef } from 'react'
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Camera, Plus, Wand2, Brain, MapPin, Star, AlertCircle, CheckCircle2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DiagnosisState = 'input' | 'loading' | 'high-confidence' | 'low-confidence'

interface DiagnosisResult {
  confidence: number
  title: string
  description: string
  steps?: string[]
}

const DEVICES = ['iPhone 14 Pro', 'MacBook Pro', 'iPad Air', 'Samsung Galaxy']

const mockHighConfidenceResult: DiagnosisResult = {
  confidence: 0.92,
  title: 'Screen Digitizer Failure',
  description: 'The touch-sensitive layer of your display is damaged. This is preventing the screen from responding to touch input.',
  steps: [
    'Power off your device completely and let it cool for 5 minutes',
    'Gently clean the screen with a microfiber cloth to remove any debris',
    'Try recalibrating the touchscreen by going to Settings → Display → Calibrate (if available)',
    'If the issue persists, you may need a screen replacement',
  ],
}

const mockLowConfidenceResult: DiagnosisResult = {
  confidence: 0.62,
  title: 'Complex Hardware Issue Detected',
  description: 'Based on your description, this could be one of several issues. Our AI needs more expertise for this specific problem.',
}

const mockTechnician = {
  name: 'Ahmad Riyadi',
  rating: 4.9,
  reviews: 128,
  distance: '2.3 km away',
  specialization: 'Screen & Display Repair',
  available: 'Available in 30 mins',
}

export default function AIDiagnosisPage() {
  const { user, isLoading: authLoading } = useAuth("customer")
  const router = useRouter()
  const [state, setState] = useState<DiagnosisState>('input')
  const [selectedDevice, setSelectedDevice] = useState('iPhone 14 Pro')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = () => {
    if (!description.trim()) return
    
    // Simulate AI analysis
    setState('loading')
    
    setTimeout(() => {
      // Randomly choose between high and low confidence for demo
      const isHighConfidence = Math.random() > 0.4
      setState(isHighConfidence ? 'high-confidence' : 'low-confidence')
    }, 3000)
  }

  const handleBookTechnician = () => {
    router.push('/consumer/technician-booking')
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
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {DEVICES.map((device) => (
                    <button
                      key={device}
                      onClick={() => setSelectedDevice(device)}
                      className={cn(
                        'px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all',
                        selectedDevice === device
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border bg-card hover:bg-secondary'
                      )}
                    >
                      {device}
                    </button>
                  ))}
                  <button className={cn(
                    'px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all',
                    'border border-border bg-card hover:bg-secondary flex items-center gap-2'
                  )}>
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>

              {/* Describe Problem */}
              <div className="space-y-3">
                <label className="block text-sm font-medium pb-1">Describe the Problem</label>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what's wrong... e.g. my phone won't turn on, screen is cracked, battery drains fast"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                    {description.length}/500
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium pb-1">Add Photo (Optional)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {photoPreview ? (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img src={photoPreview} alt="Uploaded" className="w-full h-auto" />
                    <button
                      onClick={() => {
                        setPhoto(null)
                        setPhotoPreview('')
                      }}
                      className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground rounded-full p-2 hover:bg-destructive"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-lg p-6 hover:bg-secondary/50 transition-colors flex flex-col items-center gap-2 text-center"
                  >
                    <Camera className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Upload photo</p>
                      <p className="text-xs text-muted-foreground">Tap to capture or upload</p>
                    </div>
                  </button>
                )}
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={!description.trim()}
                className="w-full bg-primary hover:bg-primary/90 h-12 gap-2 text-base font-semibold"
              >
                <Wand2 className="w-5 h-5" />
                Analyze with AI
              </Button>
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
                className="rounded-lg bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-400 mb-2">DIY Fix Available ✓</p>
                      <p className="text-xs font-medium text-muted-foreground">
                        Confidence: {(mockHighConfidenceResult.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{mockHighConfidenceResult.title}</h3>
                  <p className="text-sm text-muted-foreground">{mockHighConfidenceResult.description}</p>
                </div>

                {/* Steps */}
                <div className="space-y-3 pt-2">
                  <p className="text-sm font-semibold">Step-by-step guide:</p>
                  <ol className="space-y-2">
                    {mockHighConfidenceResult.steps?.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="font-semibold text-primary flex-shrink-0">
                          {idx + 1}.
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

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
                <Button className="h-11 bg-primary hover:bg-primary/90" onClick={handleBookTechnician}>
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
                    <p className="text-sm font-medium">{mockLowConfidenceResult.title}</p>
                    <p className="text-xs text-muted-foreground">{mockLowConfidenceResult.description}</p>
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-lg border border-border bg-card p-4 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                      AR
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{mockTechnician.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'w-3 h-3',
                                i < Math.floor(mockTechnician.rating)
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-muted-foreground'
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {mockTechnician.rating} ({mockTechnician.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{mockTechnician.distance}</span>
                    <span className="text-green-500 font-medium">{mockTechnician.specialization}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-medium">{mockTechnician.available}</span>
                  </div>
                </div>
              </motion.div>

              {/* Action Button */}
              <Button
                onClick={handleBookTechnician}
                className="w-full h-11 bg-primary hover:bg-primary/90 font-semibold"
              >
                Book This Technician
              </Button>

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
