import { apiFetch } from "@/lib/api"

interface ApiError extends Error {
  status: number
}

export async function fetcher(path: string) {
  const response = await apiFetch(path)

  if (!response.ok) {
    const error = new Error("API fetch failed") as ApiError
    error.status = response.status
    throw error
  }

  const data = await response.json()
  return data.data
}
