"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import { apiFetch } from "@/lib/api"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
import { motion } from "framer-motion"
import {
  FileText,
  LogOut,
  Trash2,
  ChevronRight,
  Globe,
  Lock,
  Settings,
  Info,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/logout"

export default function TechnicianProfilePage() {
  const { user, isLoading: authLoading } = useAuth("technician")
  const [isOnline, setIsOnline] = useState(true)
  const [language, setLanguage] = useState("English")
  const [performance, setPerformance] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ full_name: "", profile_picture_url: "" })
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeModal, setActiveModal] = useState<"about" | "privacy" | "terms" | null>(null)

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await apiFetch("/api/technicians/performance")
        if (response.ok) {
          const data = await response.json()
          setPerformance(data.data || null)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchPerformance()
  }, [])

  const menuItems = {
    work: [
      { icon: <FileText size={20} />, label: "My Orders", action: "link" as const },
      { icon: <FileText size={20} />, label: "Earnings History", action: "link" as const },
      { icon: <FileText size={20} />, label: "Service Area", action: "link" as const },
      { icon: <FileText size={20} />, label: "Specializations", action: "link" as const },
    ],
    account: [
      { icon: <Settings size={20} />, label: "Edit Profile", action: "link" as const },
      { icon: <Globe size={20} />, label: "Language", subtext: language, action: "link" as const },
    ],
    about: [
      { icon: <Info size={20} />, label: "About EcoServe", action: "link" as const },
      { icon: <Lock size={20} />, label: "Privacy Policy", action: "link" as const },
      { icon: <FileText size={20} />, label: "Terms of Service", action: "link" as const },
      { icon: <Info size={20} />, label: "App Version", subtext: "1.0.0", action: "link" as const },
    ],
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user?.ID || Date.now()}.${fileExt}`
      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName)
      setEditForm(prev => ({ ...prev, profile_picture_url: data.publicUrl }))
    } catch (err) {
      console.error("Upload error:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleOpenEdit = () => {
    setEditForm({
      full_name: user?.FullName || "",
      profile_picture_url: user?.ProfilePictureURL || "",
    })
    setIsEditing(true)
  }

  const handleSaveProfile = async () => {
    if (!editForm.full_name.trim()) return
    setIsSaving(true)
    try {
      const response = await apiFetch("/api/users/me", {
        method: "PUT",
        body: JSON.stringify({
          full_name: editForm.full_name,
          profile_picture_url: editForm.profile_picture_url,
        }),
      })
      if (response.ok) {
        const { setCachedUser } = await import("@/lib/auth-cache")
        setCachedUser({ ...user, FullName: editForm.full_name })
        setIsEditing(false)
        window.location.reload()
      } else {
        const data = await response.json()
        console.error("Failed to update:", data)
      }
    } catch (err) {
      console.error("Update profile error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await apiFetch("/api/users/me", {
        method: "DELETE",
      })

      if (response.ok) {
        const { clearCachedUser, clearCachedOrders } = await import("@/lib/auth-cache")
        clearCachedUser()
        clearCachedOrders()
        window.location.href = "/auth"
      }
    } catch (err) {
      console.error("Delete account error:", err)
    }
  }

  const handleLanguage = () => {
    setLanguage(prev => prev === "English" ? "Indonesia" : "English")
  }

  const handleToggle = (key: string) => {
    if (key === "language") handleLanguage()
    else if (key === "edit profile") handleOpenEdit()
    else if (key === "about ecoserve") setActiveModal("about")
    else if (key === "privacy policy") setActiveModal("privacy")
    else if (key === "terms of service") setActiveModal("terms")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 px-4 py-6"
        >
          {/* Profile Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user?.ProfilePictureURL ? (
                <img
                  src={user.ProfilePictureURL}
                  alt={user.FullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                  {user?.FullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold">{user?.FullName || "User"}</h1>
                <p className="text-sm text-muted-foreground">{user?.Email || ""}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                    Technician
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Screen & Display Repair</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-auto py-1 px-2 text-xs" onClick={handleOpenEdit}>
              Edit Profile
            </Button>
          </motion.div>

          {/* Performance Stats Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-4"
          >
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Your Performance</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{performance?.rating > 0 ? `${performance.rating}★` : "New"}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{performance?.total_repairs ?? 0}</p>
                <p className="text-xs text-muted-foreground">Repairs</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{performance?.co2_saved_kg ?? 0} kg</p>
                <p className="text-xs text-muted-foreground">CO₂ Saved</p>
              </div>
            </div>
          </motion.div>

          {/* Availability Toggle */}
          <motion.div variants={itemVariants} className="rounded-xl border border-border/50 bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Availability Status</h3>
                <p className="text-xs text-muted-foreground">Toggle to receive new orders</p>
              </div>
              <motion.div
                animate={{ scale: isOnline ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Switch
                  checked={isOnline}
                  onCheckedChange={setIsOnline}
                  className={cn(
                    "data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/20"
                  )}
                />
              </motion.div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className={cn("h-2 w-2 rounded-full", isOnline ? "bg-primary" : "bg-muted-foreground")}>
              </div>
              <span className={isOnline ? "text-primary" : "text-muted-foreground"}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </motion.div>

          {/* Menu Sections */}
          {Object.entries(menuItems).map(([section, items]) => (
            <motion.div key={section} variants={itemVariants} className="space-y-2">
              <h3 className="px-2 text-xs font-semibold uppercase text-muted-foreground">
                {section}
              </h3>
              <div className="space-y-1 rounded-xl border border-border/50 overflow-hidden">
                {items.map((item: any, idx) => (
                  <div key={idx}>
                    <motion.div
                      whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                      onClick={() => handleToggle(item.label.toLowerCase())}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors cursor-pointer",
                        idx !== items.length - 1 && "border-b border-border/30"
                      )}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{item.icon}</span>
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          {item.subtext && <p className="text-xs text-muted-foreground">{item.subtext}</p>}
                        </div>
                      </div>
                      {item.action === "toggle" ? (
                        <Switch
                          checked={item.value || false}
                          onCheckedChange={() => handleToggle(item.label.toLowerCase())}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <ChevronRight size={20} className="text-muted-foreground" />
                      )}
                    </motion.div>
                    {item.action === "toggle" && (
                      <p className="text-xs text-muted-foreground px-4 py-1">
                        Notifications are sent via email
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Logout Section */}
          <motion.div variants={itemVariants} className="space-y-2">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 size={20} />
                Delete Account
              </button>
            ) : (
              <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-4 space-y-3">
                <p className="text-sm font-medium text-destructive">Delete your account?</p>
                <p className="text-xs text-muted-foreground">
                  This action cannot be undone. Your data will be soft-deleted and you will be logged out.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary/50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 py-2 rounded-lg bg-destructive text-white text-sm font-medium"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            )}

            {!showLogoutConfirm ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border border-border/50 text-muted-foreground hover:bg-secondary/50 transition-colors"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            ) : (
              <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-3">
                <p className="text-sm font-medium">Sign out?</p>
                <p className="text-xs text-muted-foreground">
                  You will need to login again to access your account.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary/50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={logout}
                    className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                  >
                    Yes, Sign Out
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* About / Privacy / Terms Modal */}
      {activeModal && (() => {
        const modalContent = {
          about: {
            title: "About EcoServe",
            content: `EcoServe adalah platform infrastruktur cerdas yang dirancang untuk mendigitalkan ekonomi sirkular di Indonesia.

Kami menjembatani konsumen dengan teknisi perbaikan ahli melalui lapisan kecerdasan buatan (AI) dan pemetaan geospasial presisi — memastikan setiap perangkat rusak mendapat penanganan terbaik dari teknisi terdekat yang tepat.

🌱 Misi Kami
Memperpanjang usia perangkat elektronik dan secara aktif mengurangi jejak karbon limbah elektronik (e-waste) demi kelestarian bumi. Setiap perbaikan yang berhasil kami fasilitasi berkontribusi langsung pada pengurangan emisi karbon yang terukur menggunakan metodologi EPA WARM.

⚡ Teknologi
Ditenagai oleh Gemini AI untuk diagnostik cerdas, PostGIS untuk routing geospasial presisi, dan Digital Product Passport (DPP) untuk melacak siklus hidup setiap perangkat elektronik Anda.

🏆 Dibangun untuk kompetisi Web Development I/O Festival 2026 — BEM FTI Universitas Tarumanagara.`,
          },
          privacy: {
            title: "Privacy Policy",
            content: `EcoServe berkomitmen penuh untuk melindungi privasi dan keamanan data pengguna.

📋 Data yang Kami Kumpulkan
- Alamat email untuk autentikasi OTP
- Titik koordinat GPS sementara selama proses perbaikan berlangsung
- Spesifikasi perangkat keras (Digital Product Passport)
- Riwayat transaksi perbaikan untuk kalkulasi dampak lingkungan

🔒 Keamanan Data
Seluruh data transaksi dilindungi dengan enkripsi standar industri. Token autentikasi disimpan dalam HttpOnly Cookie yang aman dari serangan XSS. Sistem Anti-Fraud kami memvalidasi setiap transaksi melalui GPS Lock dan Photo Proof.

🚫 Komitmen Privasi
Kami tidak pernah menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan komersial. Data GPS hanya digunakan selama sesi perbaikan aktif dan tidak disimpan secara permanen.

📧 Pertanyaan privasi dapat dikirimkan melalui email resmi EcoServe.`,
          },
          terms: {
            title: "Terms of Service",
            content: `Dengan menggunakan EcoServe, Anda menyetujui seluruh ketentuan layanan berikut.

👤 Kewajiban Pengguna
- Memberikan informasi kerusakan perangkat yang akurat dan jujur
- Memastikan kehadiran saat teknisi tiba di lokasi
- Memberikan konfirmasi ganda (Dual Confirmation) setelah perbaikan selesai

🤖 Panduan DIY berbasis AI
Eksekusi perbaikan mandiri (DIY) berdasarkan panduan AI sepenuhnya merupakan tanggung jawab pengguna. EcoServe tidak bertanggung jawab atas kerusakan yang timbul akibat pelaksanaan panduan DIY.

💰 Biaya Platform
EcoServe menerapkan biaya platform (Take Rate) sebesar 10% dari total biaya jasa untuk setiap perbaikan yang difasilitasi. Biaya ini digunakan untuk pemeliharaan ekosistem sirkular, pengembangan fitur, dan operasional platform.

🛡️ Anti-Fraud
Setiap transaksi divalidasi melalui sistem Anti-Fraud berlapis: GPS Lock, Photo Proof Before/After, dan Dual Confirmation. Pelanggaran terhadap ketentuan ini dapat mengakibatkan penangguhan akun.

📅 EcoServe berhak mengubah ketentuan layanan ini sewaktu-waktu dengan pemberitahuan terlebih dahulu.`,
          },
        }
        const current = modalContent[activeModal]
        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0">
            <div className="w-full max-w-lg rounded-2xl bg-card border border-border/50 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                <h3 className="font-semibold">{current.title}</h3>
                <button onClick={() => setActiveModal(null)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {current.content}
                </p>
              </div>
              <div className="px-6 py-4 border-t border-border/50">
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border/50 p-6 space-y-4">
            <h3 className="text-lg font-semibold">Edit Profile</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Profile Picture</label>
              {editForm.profile_picture_url && (
                <img
                  src={editForm.profile_picture_url}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary mx-auto"
                />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary/50 disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : editForm.profile_picture_url ? "Change Photo" : "Upload Photo"}
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 rounded-lg border border-border text-sm text-muted-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving || !editForm.full_name.trim()}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
