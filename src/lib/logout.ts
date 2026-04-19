import { clearCachedUser, clearCachedOrders } from "@/lib/auth-cache"

export async function logout() {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    )
  } catch (err) {
    console.error("Logout error:", err)
  } finally {
    clearCachedUser()
    clearCachedOrders()
    window.location.href = "/auth"
  }
}
