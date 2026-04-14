"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { getCachedUser, setCachedUser } from "@/lib/auth-cache"

export function useAuth(requiredRole?: "customer" | "technician") {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // Cek cache dulu
      const cached = getCachedUser()
      if (cached) {
        setUser(cached)
        setIsLoading(false)
        return
      }

      // Kalau tidak ada cache, baru hit API
      try {
        const response = await apiFetch("/api/users/me")

        if (response.status === 401) {
          router.replace("/auth")
          return
        }

        if (response.status === 429) {
          // Rate limited, jangan redirect - user masih login
          // Coba lagi setelah 60 detik
          setTimeout(() => checkAuth(), 60000)
          setIsLoading(false)
          return
        }

        if (!response.ok) {
          setIsLoading(false)
          return
        }

        const data = await response.json()
        const userData = data.data?.data || data.data || data

        // Setelah dapat data, simpan ke cache
        setCachedUser(userData)
        setUser(userData)

        if (requiredRole && userData.Role !== requiredRole) {
          if (userData.Role === "technician") {
            router.replace("/technician/dashboard")
          } else {
            router.replace("/consumer/dashboard")
          }
        }
      } catch (err: any) {
        if (err?.type === "RATE_LIMITED") {
          setTimeout(() => checkAuth(), (err.seconds || 60) * 1000)
          setIsLoading(false)
          return
        }
        // Network error - jangan redirect
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { user, isLoading }
}
