// Simple in-memory cache untuk user data
let cachedUser: any = null
let cacheTime: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 menit

// Cache untuk orders
let cachedOrders: any[] | null = null
let ordersCacheTime: number = 0
const ORDERS_CACHE_DURATION = 2 * 60 * 1000 // 2 menit

export function getCachedUser() {
  if (cachedUser && Date.now() - cacheTime < CACHE_DURATION) {
    return cachedUser
  }
  return null
}

export function setCachedUser(user: any) {
  cachedUser = user
  cacheTime = Date.now()
}

export function clearCachedUser() {
  cachedUser = null
  cacheTime = 0
}

export function getCachedOrders() {
  if (cachedOrders && Date.now() - ordersCacheTime < ORDERS_CACHE_DURATION) {
    return cachedOrders
  }
  return null
}

export function setCachedOrders(orders: any[]) {
  cachedOrders = orders
  ordersCacheTime = Date.now()
}

export function clearCachedOrders() {
  cachedOrders = null
  ordersCacheTime = 0
}
