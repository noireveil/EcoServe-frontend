"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Dynamic import with ssr: false to prevent hydration mismatch from browser extensions
const AuthForm = dynamic(
  () => import("@/components/auth/auth-form").then((mod) => mod.AuthForm),
  {
    ssr: false,
    loading: () => (
      <div className="relative min-h-screen w-full overflow-hidden bg-background">
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md animate-pulse px-4">
            <div className="rounded-2xl border border-border/50 bg-card/80 p-8">
              <div className="mb-8 flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary" />
                <div className="h-6 w-32 rounded bg-secondary" />
              </div>
              <div className="h-10 w-full rounded bg-secondary mb-6" />
              <div className="space-y-4">
                <div className="h-4 w-16 rounded bg-secondary" />
                <div className="h-10 w-full rounded bg-secondary" />
                <div className="h-10 w-full rounded bg-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  }
)

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}
