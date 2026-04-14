"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Leaf, Cpu, Smartphone, Wrench } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type Role = "customer" | "technician"

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Form states
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<Role>("customer")

  // Custom OTP States
  const [otp, setOtp] = useState("")
  const [otpArray, setOtpArray] = useState<string[]>(Array(6).fill(""))

  // UI states
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Check URL param for pre-selected role
  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam === "technician") {
      setRole("technician")
      setActiveTab("register")
    }
  }, [searchParams])

  // Sync otpArray dengan state otp utama
  useEffect(() => {
    setOtp(otpArray.join(""))
  }, [otpArray])

  // --- CUSTOM OTP HANDLERS (ANTI-BUG SHADCN) ---
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (!/^\d*$/.test(value)) return // Hanya boleh angka

    const newOtpArray = [...otpArray]
    newOtpArray[index] = value.slice(-1) // Ambil karakter terakhir
    setOtpArray(newOtpArray)

    // Otomatis geser ke kotak selanjutnya
    if (value && index < 5) {
      const nextInput = document.getElementById(`${activeTab}-otp-slot-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Otomatis mundur dan hapus jika menekan backspace
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      const prevInput = document.getElementById(`${activeTab}-otp-slot-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
        const newOtpArray = [...otpArray]
        newOtpArray[index - 1] = ""
        setOtpArray(newOtpArray)
      }
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    // Ambil teks dari clipboard, hapus selain angka, dan potong maksimal 6 digit
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pastedData) {
      const newOtpArray = [...otpArray]
      for (let i = 0; i < pastedData.length; i++) {
        newOtpArray[i] = pastedData[i]
      }
      setOtpArray(newOtpArray)

      // Fokus ke kotak terakhir yang terisi
      const focusIndex = Math.min(pastedData.length, 5)
      const focusInput = document.getElementById(`${activeTab}-otp-slot-${focusIndex}`)
      focusInput?.focus()
    }
  }
  // ---------------------------------------------

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email")
      return
    }
    if (activeTab === "register" && !fullName) {
      setError("Please enter your full name")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/auth/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim(),
            full_name: fullName.trim() || email.split("@")[0],
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || data.message || "Failed to send OTP")
      }

      setShowOtpInput(true)
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    const currentOtp = otpArray.join("")

    if (currentOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Step 1: verify OTP
      const verifyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/auth/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim(),
            code: otp,
          }),
        }
      )

      if (!verifyResponse.ok) {
        const data = await verifyResponse.json()
        throw new Error(data.error || data.message || "Invalid OTP")
      }


      // Step 2: ambil profile user untuk dapat role
      const meResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
          method: "GET",
          credentials: "include",
        }
      )

      if (!meResponse.ok) {
        throw new Error("Failed to get user profile")
      }

      const userData = await meResponse.json()

      const user = userData.data?.data || userData.data || userData
      const userRole = user?.Role || user?.role
      
      await new Promise(resolve => setTimeout(resolve, 500))

      const jwtCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('jwt='))
        ?.split('=')[1]

      if (jwtCookie) {
        document.cookie = `jwt=${jwtCookie}; path=/; max-age=86400`
      }

      console.log("All cookies:", document.cookie)
      console.log("JWT cookie:", document.cookie.split('; ').find(row => row.startsWith('jwt=')))

      if (userRole === "technician") {
        router.push("/technician/dashboard")
      } else {
        router.push("/consumer/dashboard")
      }

    } catch (err: any) {
      console.log("Error caught:", err)
      setError(err.message || "Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setShowOtpInput(false)
    setOtp("")
    setOtpArray(Array(6).fill(""))
    setError("")
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "register")
    resetForm()
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0">
        {/* Gradient overlay - Fixed Tailwind Warning */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5" />

        {/* Circuit pattern */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="circuit-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M10 10h80v80H10z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <circle cx="10" cy="10" r="3" fill="currentColor" />
              <circle cx="90" cy="10" r="3" fill="currentColor" />
              <circle cx="10" cy="90" r="3" fill="currentColor" />
              <circle cx="90" cy="90" r="3" fill="currentColor" />
              <circle cx="50" cy="50" r="5" fill="currentColor" />
              <path
                d="M10 10L50 50M90 10L50 50M10 90L50 50M90 90L50 50"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>

        {/* Floating leaf decorations */}
        <motion.div
          className="absolute left-[10%] top-[20%] text-primary/20"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf className="h-16 w-16" />
        </motion.div>
        <motion.div
          className="absolute right-[15%] top-[30%] text-primary/15"
          animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Leaf className="h-12 w-12" />
        </motion.div>
        <motion.div
          className="absolute bottom-[25%] left-[20%] text-primary/10"
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Cpu className="h-10 w-10" />
        </motion.div>
      </div>

      {/* Back to landing link */}
      <Link
        href="/"
        className="absolute left-4 top-4 z-10 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Main content */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="rounded-2xl border border-border/50 bg-card/80 p-8 shadow-2xl backdrop-blur-sm">
            {/* Logo & Tagline */}
            <div className="mb-8 text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <Leaf className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">EcoServe</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Repair. Reduce. Reimagine.
              </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2 bg-secondary">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <AnimatePresence mode="wait">
                  {!showOtpInput ? (
                    <motion.div
                      key="login-email"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-secondary/50"
                          autoComplete="off"
                          data-form-type="other"
                        />
                      </div>
                      <Button
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isLoading ? (
                          <>
                            <Spinner className="mr-2" />
                            Sending OTP...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="login-otp"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label className="block text-center">Enter OTP sent to {email}</Label>

                        {/* CUSTOM OTP COMPONENT */}
                        <div className="mt-2 flex justify-center gap-2">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <input
                              key={index}
                              id={`login-otp-slot-${index}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={otpArray[index]}
                              onChange={(e) => handleOtpChange(e, index)}
                              onKeyDown={(e) => handleOtpKeyDown(e, index)}
                              onPaste={handleOtpPaste}
                              className="h-12 w-10 rounded-md border border-input bg-secondary/50 text-center text-lg font-semibold outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                              autoComplete="off"
                            />
                          ))}
                        </div>
                        {/* END CUSTOM OTP */}

                      </div>
                      <Button
                        onClick={handleVerifyOtp}
                        disabled={isLoading}
                        className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isLoading ? (
                          <>
                            <Spinner className="mr-2" />
                            Verifying...
                          </>
                        ) : (
                          "Verify OTP"
                        )}
                      </Button>
                      <button
                        onClick={resetForm}
                        className="mt-2 w-full text-sm text-muted-foreground hover:text-foreground"
                      >
                        Use a different email
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center text-sm text-destructive"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Switch to register */}
                <p className="pt-4 text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => handleTabChange("register")}
                    className="text-primary hover:underline"
                  >
                    Register
                  </button>
                </p>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <AnimatePresence mode="wait">
                  {!showOtpInput ? (
                    <motion.div
                      key="register-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input
                          id="full-name"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="bg-secondary/50"
                          autoComplete="off"
                          data-form-type="other"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-secondary/50"
                          autoComplete="off"
                          data-form-type="other"
                        />
                      </div>

                      {/* Role Selector */}
                      <div className="space-y-2">
                        <Label>I am a...</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setRole("customer")}
                            className={cn(
                              "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                              role === "customer"
                                ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                : "border-border bg-secondary/30 hover:border-primary/50"
                            )}
                          >
                            <Smartphone
                              className={cn(
                                "h-8 w-8",
                                role === "customer" ? "text-primary" : "text-muted-foreground"
                              )}
                            />
                            <span
                              className={cn(
                                "text-sm font-medium",
                                role === "customer" ? "text-primary" : "text-muted-foreground"
                              )}
                            >
                              I need repairs
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setRole("technician")}
                            className={cn(
                              "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                              role === "technician"
                                ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                : "border-border bg-secondary/30 hover:border-primary/50"
                            )}
                          >
                            <Wrench
                              className={cn(
                                "h-8 w-8",
                                role === "technician" ? "text-primary" : "text-muted-foreground"
                              )}
                            />
                            <span
                              className={cn(
                                "text-sm font-medium",
                                role === "technician" ? "text-primary" : "text-muted-foreground"
                              )}
                            >
                              I&apos;m a Technician
                            </span>
                          </button>
                        </div>
                      </div>

                      <Button
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isLoading ? (
                          <>
                            <Spinner className="mr-2" />
                            Sending OTP...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register-otp"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label className="block text-center">Enter OTP sent to {email}</Label>

                        {/* CUSTOM OTP COMPONENT */}
                        <div className="mt-2 flex justify-center gap-2">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <input
                              key={index}
                              id={`register-otp-slot-${index}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={otpArray[index]}
                              onChange={(e) => handleOtpChange(e, index)}
                              onKeyDown={(e) => handleOtpKeyDown(e, index)}
                              onPaste={handleOtpPaste}
                              className="h-12 w-10 rounded-md border border-input bg-secondary/50 text-center text-lg font-semibold outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                              autoComplete="off"
                            />
                          ))}
                        </div>
                        {/* END CUSTOM OTP */}

                      </div>
                      <Button
                        onClick={handleVerifyOtp}
                        disabled={isLoading}
                        className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isLoading ? (
                          <>
                            <Spinner className="mr-2" />
                            Verifying...
                          </>
                        ) : (
                          "Verify OTP"
                        )}
                      </Button>
                      <button
                        onClick={resetForm}
                        className="mt-2 w-full text-sm text-muted-foreground hover:text-foreground"
                      >
                        Use a different email
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center text-sm text-destructive"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Switch to login */}
                <p className="pt-4 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => handleTabChange("login")}
                    className="text-primary hover:underline"
                  >
                    Login
                  </button>
                </p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Competition credit */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Created for the EcoServe Challenge 2025
          </p>
        </motion.div>
      </div>
    </div>
  )
}