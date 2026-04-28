"use client"
import { useState, useEffect } from "react"

export function useRateLimit() {
  const [isLimited, setIsLimited] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const triggerLimit = (seconds: number) => {
    setIsLimited(true)
    setCountdown(seconds)
  }

  useEffect(() => {
    if (countdown <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLimited(false)
      return
    }
    const timer = setTimeout(() => {
      setCountdown(c => c - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  return { isLimited, countdown, triggerLimit }
}
