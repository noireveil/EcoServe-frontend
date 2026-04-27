"use client"

import { useState, useCallback } from "react"
import type { Toast, ToastType } from "@/components/ui/toast-notification"

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string, duration?: number) => {
      const id = Date.now().toString()
      setToasts((prev) => [...prev, { id, type, title, message, duration }])
    },
    []
  )

  const toast = {
    success: (title: string, message?: string, duration?: number) =>
      addToast("success", title, message, duration),
    error: (title: string, message?: string, duration?: number) =>
      addToast("error", title, message, duration),
    warning: (title: string, message?: string, duration?: number) =>
      addToast("warning", title, message, duration),
  }

  return { toasts, removeToast, toast }
}
