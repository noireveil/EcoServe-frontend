"use client"

import { useState, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import { apiFetch } from "@/lib/api"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import {
  ChevronRight,
  AlertCircle,
  FileText,
  Shield,
  Info,
  LogOut,
  Wrench,
  Trash2,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Modal } from "@/components/ui/modal"
import { ToastNotification } from "@/components/ui/toast-notification"
import { useToast } from "@/hooks/useToast"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { logout } from "@/lib/logout"
import Image from "next/image"
import type { Order, Device } from "@/types"

interface MenuItem {
  icon: React.ComponentType<{ className?: string }> | null
  label: string
  href?: string
  onClick?: () => void
  sublabel?: string
  type?: string
  showChevron?: boolean
  value?: boolean
  onChange?: (v: boolean) => void
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth("customer")
  const { data: orders = [] } = useSWR(
    "/api/orders/",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  )
  const { data: devices = [] } = useSWR(
    "/api/devices/",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  )
  const [editForm, setEditForm] = useState({ full_name: "", profile_picture_url: "" })
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [modalOpen, setModalOpen] = useState<"about" | "privacy" | "terms" | "edit" | "delete" | "logout" | "report" | null>(null)
  const { toasts, removeToast, toast } = useToast()

  const completedOrders = orders.filter((o: Order) => o.Status === "COMPLETED")
  const totalCO2 = completedOrders.reduce((sum: number, o: Order) => sum + (o.EWasteSavedKg || 0), 0)
  const totalRepairs = completedOrders.length
  const eWasteSaved = devices
    .filter((d: Device) => (d.total_repairs || 0) > 0)
    .reduce((sum: number, d: Device) => sum + (d.WeightInKg || 0), 0)

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
    } catch (_err) {
      console.error("Upload error:", _err)
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
        setCachedUser({ ...user!, FullName: editForm.full_name })
        setModalOpen(null)
        toast.success("Profile updated", "Your changes have been saved.")
        setTimeout(() => window.location.reload(), 1500)
      } else {
        const data = await response.json()
        toast.error("Update failed", data.message || "Could not save your changes.")
      }
    } catch {
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
    } catch {
      toast.error("Delete failed", "Something went wrong. Please try again.")
      setModalOpen(null)
    }
  }

  const menuItems = {
    Account: [
      { icon: Smartphone, label: "My Devices", href: "/consumer/devices" },
      { icon: Wrench, label: "My Orders", href: "/consumer/orders" },
    ],
    Preferences: [],
    About: [
      { icon: Info, label: "About EcoServe", onClick: () => setModalOpen("about") },
      { icon: Shield, label: "Privacy Policy", onClick: () => setModalOpen("privacy") },
      { icon: FileText, label: "Terms of Service", onClick: () => setModalOpen("terms") },
      { icon: AlertCircle, label: "Report a Problem", onClick: () => setModalOpen("report"), showChevron: true },
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
    <div className="min-h-screen bg-background md:pb-10">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="px-4 pt-6 md:pt-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            {user?.ProfilePictureURL ? (
              <Image
                src={user.ProfilePictureURL}
                alt={user.FullName}
                width={80}
                height={80}
                unoptimized
                className="w-20 h-20 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
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
          <div className="rounded-xl p-6 text-white" style={{ background: "linear-gradient(to bottom right, #5cb83a, #4a9a2e)" }}>
            <h2 className="text-sm font-semibold mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>
              Your Impact
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold">{totalCO2.toFixed(1)} kg</div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.85)" }}>CO₂ Saved</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold">{totalRepairs}</div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.85)" }}>Repairs Done</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold">{eWasteSaved.toFixed(2)} kg</div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.85)" }}>E-waste Reduced</div>
              </div>
            </div>
          </div>
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
                {section === "Preferences" && <ThemeToggle />}
                {section === "Preferences" && <LanguageToggle />}
                {items.map((item: MenuItem, itemIndex) => {
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
                        className="flex items-center justify-between px-4 py-3 rounded-lg bg-card border border-border/50"
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
                      className="flex items-center justify-between px-4 py-3 rounded-lg bg-card border border-border/50 hover:bg-card/80 transition-colors group cursor-pointer"
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
                      {(item.href || item.showChevron) && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      )}
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
          <button
            onClick={() => setModalOpen("delete")}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </button>
          <button
            onClick={() => setModalOpen("logout")}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border border-border/50 text-muted-foreground hover:bg-secondary/50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
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
              <Image
                src={editForm.profile_picture_url}
                alt="Preview"
                width={80}
                height={80}
                unoptimized
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

Email Support
Kirim laporan detail ke:
support@ecoserve.id

Sertakan informasi berikut:
- Deskripsi masalah yang dialami
- Langkah-langkah yang dilakukan sebelum masalah terjadi
- Screenshot jika memungkinkan
- ID pesanan (jika terkait dengan transaksi)

Response Time
Kami akan merespons dalam 1x24 jam di hari kerja.

Keamanan & Fraud
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
