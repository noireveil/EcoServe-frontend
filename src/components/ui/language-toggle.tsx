"use client"
import { useLanguage } from "@/context/LanguageContext"
import { Languages } from "lucide-react"

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <button
      onClick={() => setLang(lang === "en" ? "id" : "en")}
      className="flex items-center justify-between w-full py-3 px-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Languages className="w-5 h-5 text-primary" />
        <div>
          <p className="text-sm font-medium text-left">Language / Bahasa</p>
          <p className="text-xs text-muted-foreground text-left">
            {lang === "en" ? "English" : "Indonesia"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
        <span className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
          lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
        }`}>EN</span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
          lang === "id" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
        }`}>ID</span>
      </div>
    </button>
  )
}
