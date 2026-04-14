"use client"
import { AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface RateLimitAlertProps {
  isLimited: boolean
  countdown: number
  totalSeconds?: number
}

export function RateLimitAlert({
  isLimited,
  countdown,
  totalSeconds = 60
}: RateLimitAlertProps) {
  if (!isLimited) return null

  const progress = (countdown / totalSeconds) * 100

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="rounded-lg border border-yellow-500/30
                   bg-yellow-500/10 p-3 mb-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500
                                    flex-shrink-0" />
          <p className="text-sm text-yellow-400">
            Too many requests. Please wait {countdown}s
          </p>
        </div>
        <div className="h-1.5 rounded-full bg-yellow-500/20">
          <motion.div
            className="h-full rounded-full bg-yellow-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
