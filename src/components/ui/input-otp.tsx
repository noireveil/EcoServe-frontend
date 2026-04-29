import * as React from "react"
import { cn } from "@/lib/utils"

interface InputOTPProps {
  maxLength: number
  value: string
  onChange?: (value: string) => void
  children: React.ReactNode
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  ({ maxLength, value, onChange, children }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)

    return (
      <div ref={ref} className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          maxLength={maxLength}
          className="sr-only"
          value={value}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "")
            onChange?.(val)
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value) {
              onChange?.("")
            }
          }}
        />
        {children}
      </div>
    )
  }
)
InputOTP.displayName = "InputOTP"

interface InputOTPGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const InputOTPGroup = React.forwardRef<HTMLDivElement, InputOTPGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
        {children}
      </div>
    )
  }
)
InputOTPGroup.displayName = "InputOTPGroup"

interface InputOTPSlotProps extends React.HTMLAttributes<HTMLInputElement> {
  index: number
}

const InputOTPSlot = React.forwardRef<HTMLInputElement, InputOTPSlotProps>(
  ({ className, index, ...props }, ref) => {
    return (
      <input
        ref={ref}
        data-index={index}
        type="text"
        inputMode="numeric"
        maxLength={1}
        className={cn(
          "h-12 w-12 rounded-md border border-border bg-background text-center text-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        {...props}
      />
    )
  }
)
InputOTPSlot.displayName = "InputOTPSlot"

export { InputOTP, InputOTPGroup, InputOTPSlot }
