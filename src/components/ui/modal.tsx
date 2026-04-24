"use client"

import { useEffect, useRef, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  variant?: "default" | "destructive"
  size?: "sm" | "md" | "lg"
  hideClose?: boolean
  disableBackdropClose?: boolean
}

const sizeMap = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  variant = "default",
  size = "md",
  hideClose = false,
  disableBackdropClose = false,
}: ModalProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Body scroll lock
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = "hidden"
      const t = setTimeout(() => closeRef.current?.focus(), 50)
      return () => clearTimeout(t)
    } else {
      document.body.style.overflow = ""
      previousFocusRef.current?.focus()
    }
  }, [open])

  // ESC key to close
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  // Focus trap
  useEffect(() => {
    if (!open) return
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      const modal = document.getElementById("modal-content")
      if (!modal) return
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault()
        ;(e.shiftKey ? last : first)?.focus()
      }
    }
    document.addEventListener("keydown", handleTab)
    return () => document.removeEventListener("keydown", handleTab)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={disableBackdropClose ? undefined : onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Positioning wrapper — mobile: bottom, desktop: centered */}
          <div
            className={cn(
              "fixed inset-0 z-50 flex pointer-events-none",
              // Mobile: align to bottom, leave room for bottom navbar
              "items-end pb-18",
              // Desktop: start below top navbar (~64px), center, add padding
              "sm:top-16 sm:items-center sm:justify-center sm:pb-0 sm:p-4"
            )}
          >
            {/* Modal content */}
            <motion.div
              key="sheet"
              id="modal-content"
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "pointer-events-auto flex flex-col w-full",
                // Mobile: bottom sheet, capped height
                "max-h-[calc(100vh-6rem)] rounded-t-2xl",
                // Desktop: capped within area below top navbar
                "sm:max-h-[calc(100vh-10rem)] sm:rounded-2xl",
                "border border-border/50 bg-card",
                sizeMap[size],
                variant === "destructive" && "border-destructive/30"
              )}
            >
              {/* Header — sticky */}
              {(title || !hideClose) && (
                <div
                  className={cn(
                    "sticky top-0 z-10 flex items-center justify-between shrink-0",
                    "border-b border-border/50 px-6 py-4 bg-card",
                    "rounded-t-2xl sm:rounded-t-2xl"
                  )}
                >
                  {title && (
                    <h2
                      id={titleId}
                      className={cn(
                        "text-base font-semibold",
                        variant === "destructive" ? "text-destructive" : "text-foreground"
                      )}
                    >
                      {title}
                    </h2>
                  )}
                  {!hideClose && (
                    <button
                      ref={closeRef}
                      onClick={onClose}
                      className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Body — scrollable */}
              <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
                {children}
              </div>

              {/* Footer — sticky */}
              {footer && (
                <div className="sticky bottom-0 z-10 shrink-0 border-t border-border/50 px-6 py-4 flex gap-2 bg-card rounded-b-2xl">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
