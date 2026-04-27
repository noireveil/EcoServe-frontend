"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import { apiFetch } from "@/lib/api"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FileText,
  LogOut,
  Trash2,
  Lock,
  Settings,
  Info,
  AlertCircle,
  ClipboardList,
  DollarSign,
  MapPin,
  Wrench,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Modal } from "@/components/ui/modal"
import { ToastNotification } from "@/components/ui/toast-notification"
import { useToast } from "@/hooks/useToast"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/logout"

export default function TechnicianProfilePage() {
  const { user, isLoading: authLoading } = useAuth("technician")
  const [isOnline, setIsOnline] = useState(false)
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false)
  const { data: performance } = useSWR(
    "/api/technicians/performance",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  )
  const [editForm, setEditForm] = useState({ full_name: "", profile_picture_url: "" })
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [modalOpen, setModalOpen] = useState<"about" | "privacy" | "terms" | "edit" | "delete" | "logout" | "report" | null>(null)
  const { toasts, removeToast, toast } = useToast()

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await apiFetch("/api/technicians/availability")
        if (response.ok) {
          const data = await response.json()
          setIsOnline(data.data?.is_available ?? false)
        }
      } catch (err) {
        console.error("Failed to fetch availability:", err)
      }
    }
    fetchAvailability()
  }, [])


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
    setModalOpen("edit")
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
        setModalOpen(null)
        toast.success("Profile updated", "Your changes have been saved.")
        setTimeout(() => window.location.reload(), 1500)
      } else {
        const data = await response.json()
        toast.error("Update failed", data.message || "Could not save your changes.")
      }
    } catch (err) {
      toast.error("Update failed", "Something went wrong. Please try again.")
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
      } else {
        toast.error("Delete failed", "Could not delete your account. Please try again.")
        setModalOpen(null)
      }
    } catch (err) {
      toast.error("Delete failed", "Something went wrong. Please try again.")
      setModalOpen(null)
    }
  }

  const handleToggleAvailability = async (value: boolean) => {
    setIsTogglingAvailability(true)
    try {
      const response = await apiFetch("/api/technicians/availability", {
        method: "PUT",
        body: JSON.stringify({ is_available: value }),
      })

      if (response.ok) {
        setIsOnline(value)
        toast.success(
          value ? "You are now Online" : "You are now Offline",
          value ? "You will receive incoming orders" : "You won't receive new orders"
        )
      } else {
        const data = await response.json()
        toast.error("Failed to update status", data.message || "Please try again")
      }
    } catch (err) {
      console.error("Toggle availability error:", err)
      toast.error("Failed to update status", "Please try again")
    } finally {
      setIsTogglingAvailability(false)
    }
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
    <div className="min-h-screen bg-background pb-4">
      <div className="max-w-2xl mx-auto">
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
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
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
            className="rounded-xl border border-primary/20 bg-linear-to-br from-primary/10 to-accent/10 p-4"
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
                  onCheckedChange={handleToggleAvailability}
                  disabled={isTogglingAvailability}
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

          {/* Section: Work */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Work</h3>
            <div className="space-y-1">
              <Link href="/technician/orders" className="flex items-center justify-between py-3 px-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">My Orders</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link href="/technician/earnings" className="flex items-center justify-between py-3 px-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Earnings History</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-border/50 bg-card opacity-50">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Service Area</span>
                </div>
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">Soon</span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-border/50 bg-card opacity-50">
                <div className="flex items-center gap-3">
                  <Wrench className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Specializations</span>
                </div>
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">Soon</span>
              </div>
            </div>
          </motion.div>

          {/* Section: Preferences */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Preferences</h3>
            <button
              onClick={handleOpenEdit}
              className="flex items-center justify-between w-full py-3 px-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Edit Profile</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <ThemeToggle />
            <LanguageToggle />
          </motion.div>

          {/* Section: About */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">About</h3>
            <div className="space-y-1">
              <button onClick={() => setModalOpen("about")} className="flex items-center w-full py-3 px-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">About EcoServe</span>
                </div>
              </button>
              <button onClick={() => setModalOpen("privacy")} className="flex items-center w-full py-3 px-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Privacy Policy</span>
                </div>
              </button>
              <button onClick={() => setModalOpen("terms")} className="flex items-center w-full py-3 px-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Terms of Service</span>
                </div>
              </button>
              <button
                onClick={() => setModalOpen("report")}
                className="flex items-center justify-between w-full py-3 px-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Report a Problem</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-border/50 bg-card">
                <span className="text-sm font-medium">App Version</span>
                <span className="text-xs text-muted-foreground">1.0.0</span>
              </div>
            </div>
          </motion.div>

          {/* Logout Section */}
          <motion.div variants={itemVariants} className="space-y-2">
            <button
              onClick={() => setModalOpen("delete")}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 size={20} />
              Delete Account
            </button>
            <button
              onClick={() => setModalOpen("logout")}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border border-border/50 text-muted-foreground hover:bg-secondary/50 transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        open={modalOpen === "delete"}
        onClose={() => setModalOpen(null)}
        title="Delete Account?"
        variant="destructive"
        size="sm"
        footer={
          <>
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(null)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
              onClick={handleDeleteAccount}
            >
              Yes, Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. Your data will be soft-deleted and you will be logged out.
        </p>
      </Modal>

      {/* Sign Out Modal */}
      <Modal
        open={modalOpen === "logout"}
        onClose={() => setModalOpen(null)}
        title="Sign Out?"
        size="sm"
        footer={
          <>
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(null)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={logout}>
              Yes, Sign Out
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          You will need to login again to access your account.
        </p>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        open={modalOpen === "edit"}
        onClose={() => setModalOpen(null)}
        title="Edit Profile"
        size="md"
        footer={
          <>
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(null)} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSaveProfile}
              disabled={isSaving || !editForm.full_name.trim()}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
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
        </div>
      </Modal>

      {/* About / Privacy / Terms Modals */}
      <ToastNotification toasts={toasts} onRemove={removeToast} />

      {/* Report a Problem Modal */}
      <Modal
        open={modalOpen === "report"}
        onClose={() => setModalOpen(null)}
        title="Report a Problem"
        size="md"
        footer={
          <div className="flex gap-2 w-full">
            <button
              onClick={() => setModalOpen(null)}
              className="flex-1 py-2 rounded-lg border border-border text-sm text-muted-foreground"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                window.location.href = "mailto:support@ecoserve.id?subject=Report%20a%20Problem%20-%20EcoServe&body=Halo%20EcoServe%2C%0A%0ASaya%20ingin%20melaporkan%3A%0A%0A"
                setModalOpen(null)
              }}
              className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
            >
              Buka Email
            </button>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{`Mengalami masalah dengan EcoServe? Kami siap membantu!

📧 Email Support
Kirim laporan detail ke:
support@ecoserve.id

Sertakan informasi berikut:
- Deskripsi masalah yang dialami
- Langkah-langkah yang dilakukan sebelum masalah terjadi
- Screenshot jika memungkinkan
- ID pesanan (jika terkait dengan transaksi)

⏱️ Response Time
Kami akan merespons dalam 1x24 jam di hari kerja.

🔒 Keamanan & Fraud
Untuk melaporkan teknisi yang mencurigakan atau
transaksi yang bermasalah, tambahkan subjek:
[FRAUD REPORT] di email Anda.

Terima kasih telah membantu kami menjadi lebih baik! 🌱`}</p>
      </Modal>

      {(["about", "privacy", "terms"] as const).map((key) => {
        const content = {
          about: {
            title: "About EcoServe",
            body: `EcoServe adalah platform infrastruktur cerdas yang dirancang untuk mendigitalkan ekonomi sirkular di Indonesia.

Kami menjembatani konsumen dengan teknisi perbaikan ahli melalui lapisan kecerdasan buatan (AI) dan pemetaan geospasial presisi — memastikan setiap perangkat rusak mendapat penanganan terbaik dari teknisi terdekat yang tepat.

🌱 Misi Kami
Memperpanjang usia perangkat elektronik dan secara aktif mengurangi jejak karbon limbah elektronik (e-waste) demi kelestarian bumi. Setiap perbaikan yang berhasil kami fasilitasi berkontribusi langsung pada pengurangan emisi karbon yang terukur menggunakan metodologi EPA WARM.

⚡ Teknologi
Ditenagai oleh Gemini AI untuk diagnostik cerdas, PostGIS untuk routing geospasial presisi, dan Digital Product Passport (DPP) untuk melacak siklus hidup setiap perangkat elektronik Anda.

🏆 Dibangun untuk kompetisi Web Development I/O Festival 2026 — BEM FTI Universitas Tarumanagara.`,
          },
          privacy: {
            title: "Privacy Policy",
            body: `EcoServe berkomitmen penuh untuk melindungi privasi dan keamanan data pengguna.

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
            body: `Dengan menggunakan EcoServe, Anda menyetujui seluruh ketentuan layanan berikut.

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
        }[key]
        return (
          <Modal
            key={key}
            open={modalOpen === key}
            onClose={() => setModalOpen(null)}
            title={content.title}
            size="md"
            footer={
              <Button className="flex-1" onClick={() => setModalOpen(null)}>
                Got it
              </Button>
            }
          >
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {content.body}
            </p>
          </Modal>
        )
      })}
    </div>
  )
}
