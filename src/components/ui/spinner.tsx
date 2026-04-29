import { cn } from "@/lib/utils"

type SpinnerProps = React.HTMLAttributes<HTMLDivElement>

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
      {...props}
    />
  )
}
