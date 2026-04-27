"use client"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="flex items-center justify-between w-full py-3 px-4 rounded-xl border border-border/50 bg-card animate-pulse h-15" />
  )

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-between w-full py-3 px-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        {theme === "dark" ? (
          <Moon className="w-5 h-5 text-primary" />
        ) : (
          <Sun className="w-5 h-5 text-primary" />
        )}
        <div>
          <p className="text-sm font-medium text-left">
            {theme === "dark" ? "Dark Mode" : "Light Mode"}
          </p>
          <p className="text-xs text-muted-foreground text-left">
            {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          </p>
        </div>
      </div>
      <div className={`relative w-11 h-6 rounded-full transition-colors ${
        theme === "dark" ? "bg-primary" : "bg-muted"
      }`}>
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          theme === "dark" ? "translate-x-5" : "translate-x-0.5"
        }`} />
      </div>
    </button>
  )
}
