"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import { apiFetch } from "@/lib/api"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
import { motion } from "framer-motion"
import {
  ChevronRight,
  Bell,
  Globe,
  FileText,
  Shield,
  Info,
  LogOut,
  Wrench,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { logout } from "@/lib/logout"

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth("customer")
  const [language, setLanguage] = useState("English")
  const [orders, setOrders] = useState<any[]>([])
  const [devices, setDevices] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ full_name: "", profile_picture_url: "" })
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeModal, setActiveModal] = useState<"about" | "privacy" | "terms" | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiFetch("/api/orders/")
        if (response.ok) {
          const data = await response.json()
          setOrders(data.data || [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchOrders()
  }, [])

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await apiFetch("/api/devices/")
        if (response.ok) {
          const data = await response.json()
          setDevices(data.data || [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchDevices()
  }, [])

  const completedOrders = orders.filter(o => o.Status === "COMPLETED")
  const totalCO2 = completedOrders.reduce((sum, o) => sum + (o.EWasteSavedKg || 0), 0)
  const totalRepairs = completedOrders.length
  const eWasteSaved = devices
    .filter(d => (d.total_repairs || 0) > 0)
    .reduce((sum, d) => sum + (d.WeightInKg || 0), 0)

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

  const menuItems = {
    Account: [
      { icon: Wrench, label: "My Devices", href: "/consumer/devices" },
      { icon: Bell, label: "My Orders", href: "/consumer/orders" },
    ],
    Preferences: [
      { icon: Globe, label: "Language", sublabel: language, type: "link", onClick: () => setLanguage(prev => prev === "English" ? "Indonesia" : "English") },
    ],
    About: [
      { icon: Info, label: "About EcoServe", onClick: () => setActiveModal("about") },
      { icon: Shield, label: "Privacy Policy", onClick: () => setActiveModal("privacy") },
      { icon: FileText, label: "Terms of Service", onClick: () => setActiveModal("terms") },
      {
        icon: null,
        label: "App Version",
        sublabel: "1.0.0",
        type: "text",
      },
    ],
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="px-4 pt-6 md:pt-[90px] pb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            {user?.ProfilePictureURL ? (
              <img
                src={user.ProfilePictureURL}
                alt={user.FullName}
                className="w-20 h-20 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                {user?.FullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
              </div>
            )}

            <div>
              <h1 className="text-2xl font-bold">{user?.FullName || "User"}</h1>
              <p className="text-muted-foreground text-sm">{user?.Email || ""}</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="border-primary text-primary bg-transparent"
              >
                Consumer
              </Badge>
              <Button variant="outline" size="sm" onClick={handleOpenEdit}>
                Edit Profile
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Eco Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mx-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 p-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-6">
              Your Impact
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-primary">{totalCO2.toFixed(1)} kg</div>
                <div className="text-xs text-muted-foreground mt-1">CO₂ Saved</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-primary">{totalRepairs}</div>
                <div className="text-xs text-muted-foreground mt-1">Repairs Done</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-primary">{eWasteSaved.toFixed(2)} kg</div>
                <div className="text-xs text-muted-foreground mt-1">E-waste Reduced</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Menu Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-8 px-4"
        >
          {Object.entries(menuItems).map(([section, items], sectionIndex) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section}
              </h3>
              <div className="space-y-2">
                {items.map((item: any, itemIndex) => {
                  if (item.type === "toggle") {
                    return (
                      <div key={item.label}>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-card/50 border border-border/50 hover:bg-card/80 transition-colors"
                        >
                          <div>
                            <div className="text-sm font-medium">{item.label}</div>
                            {item.sublabel && (
                              <div className="text-xs text-muted-foreground">{item.sublabel}</div>
                            )}
                          </div>
                          <Switch
                            checked={item.value}
                            onCheckedChange={item.onChange}
                          />
                        </motion.div>
                        <p className="text-xs text-muted-foreground px-4 mt-1">
                          Notifications are sent via email
                        </p>
                      </div>
                    )
                  } else if (item.type === "text") {
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                        className="flex items-center justify-between px-4 py-3 rounded-lg bg-card/50 border border-border/50"
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.sublabel}
                        </span>
                      </motion.div>
                    )
                  }

                  const Icon = item.icon || ChevronRight

                  return (
                    <motion.a
                      key={item.label}
                      href={item.onClick ? undefined : (item.href || "#")}
                      onClick={item.onClick}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                      className="flex items-center justify-between px-4 py-3 rounded-lg bg-card/50 border border-border/50 hover:bg-card/80 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div>
                          <div className="text-sm font-medium">{item.label}</div>
                          {item.sublabel && (
                            <div className="text-xs text-muted-foreground">
                              {item.sublabel}
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Sign Out & Delete Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="px-4 mt-8 mb-4 space-y-2"
        >
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
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
              <LogOut className="w-5 h-5" />
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
      </div>

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
    </div>
  )
}
