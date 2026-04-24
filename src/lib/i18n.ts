export type Language = "en" | "id"

export const translations = {
  en: {
    // Navigation
    home: "Home",
    devices: "Devices",
    orders: "Orders",
    profile: "Profile",
    map: "Map",
    earnings: "Earnings",

    // Dashboard Consumer
    welcomeBack: "Welcome back",
    yourEcoImpact: "Your Eco Impact",
    co2Avoided: "CO₂ Avoided",
    repairs: "Repairs",
    eWasteSaved: "E-waste saved",
    activeOrder: "Active Order",
    recentRepairs: "Recent Repairs",
    seeAll: "See all",
    noActiveOrders: "No active orders",
    noRepairsYet: "No completed repairs yet",
    waitingForTechnician: "Waiting for technician...",
    reportDamage: "Report Damage",
    myGarage: "My Garage",
    trackOrder: "Track Order",
    aiDiagnosis: "AI Diagnosis",

    // Orders
    myOrders: "My Orders",
    active: "Active",
    completed: "Completed",
    all: "All",
    cancelOrder: "Cancel Order",
    rateThisRepair: "Rate this repair",
    reviewed: "✓ Reviewed",
    waitingTechnician: "Waiting for technician...",

    // Devices
    myDevices: "My Devices",
    addDevice: "Add Device",
    yourDigitalGarage: "Your Digital Garage",
    noDevicesYet: "No devices yet",
    addFirstDevice: "Add First Device",
    viewPassport: "View Passport",

    // Profile
    editProfile: "Edit Profile",
    language: "Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    deleteAccount: "Delete Account",
    signOut: "Sign Out",
    yourImpact: "Your Impact",
    kgCO2Saved: "kg CO₂ Saved",
    repairsDone: "Repairs Done",
    kgEwaste: "kg E-waste",
    account: "Account",
    preferences: "Preferences",
    about: "About",
    aboutEcoServe: "About EcoServe",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",

    // Auth
    login: "Login",
    register: "Register",
    sendOtp: "Send OTP",
    verifyOtp: "Verify OTP",
    resendOtp: "Resend OTP",

    // Common
    save: "Save",
    cancel: "Cancel",
    loading: "Loading...",
    gotIt: "Got it",
    submit: "Submit",
    confirm: "Confirm",
    delete: "Delete",
  },
  id: {
    // Navigation
    home: "Beranda",
    devices: "Perangkat",
    orders: "Pesanan",
    profile: "Profil",
    map: "Peta",
    earnings: "Pendapatan",

    // Dashboard Consumer
    welcomeBack: "Selamat datang kembali",
    yourEcoImpact: "Dampak Eco Anda",
    co2Avoided: "CO₂ Dihindari",
    repairs: "Perbaikan",
    eWasteSaved: "E-waste Diselamatkan",
    activeOrder: "Pesanan Aktif",
    recentRepairs: "Perbaikan Terkini",
    seeAll: "Lihat semua",
    noActiveOrders: "Tidak ada pesanan aktif",
    noRepairsYet: "Belum ada perbaikan selesai",
    waitingForTechnician: "Menunggu teknisi...",
    reportDamage: "Laporkan Kerusakan",
    myGarage: "Garasi Saya",
    trackOrder: "Lacak Pesanan",
    aiDiagnosis: "Diagnosa AI",

    // Orders
    myOrders: "Pesanan Saya",
    active: "Aktif",
    completed: "Selesai",
    all: "Semua",
    cancelOrder: "Batalkan Pesanan",
    rateThisRepair: "Beri Ulasan",
    reviewed: "✓ Sudah Diulas",
    waitingTechnician: "Menunggu teknisi...",

    // Devices
    myDevices: "Perangkat Saya",
    addDevice: "Tambah Perangkat",
    yourDigitalGarage: "Garasi Digital Anda",
    noDevicesYet: "Belum ada perangkat",
    addFirstDevice: "Tambah Perangkat Pertama",
    viewPassport: "Lihat Paspor",

    // Profile
    editProfile: "Edit Profil",
    language: "Bahasa",
    darkMode: "Mode Gelap",
    lightMode: "Mode Terang",
    deleteAccount: "Hapus Akun",
    signOut: "Keluar",
    yourImpact: "Dampak Anda",
    kgCO2Saved: "kg CO₂ Diselamatkan",
    repairsDone: "Perbaikan Selesai",
    kgEwaste: "kg E-waste",
    account: "Akun",
    preferences: "Preferensi",
    about: "Tentang",
    aboutEcoServe: "Tentang EcoServe",
    privacyPolicy: "Kebijakan Privasi",
    termsOfService: "Syarat Layanan",

    // Auth
    login: "Masuk",
    register: "Daftar",
    sendOtp: "Kirim OTP",
    verifyOtp: "Verifikasi OTP",
    resendOtp: "Kirim Ulang OTP",

    // Common
    save: "Simpan",
    cancel: "Batal",
    loading: "Memuat...",
    gotIt: "Mengerti",
    submit: "Kirim",
    confirm: "Konfirmasi",
    delete: "Hapus",
  },
} as const

export function t(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key] ?? translations.en[key]
}
