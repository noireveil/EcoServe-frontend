import { apiFetch } from "@/lib/api"

export async function fetcher(path: string) {
  const response = await apiFetch(path)

  if (!response.ok) {
    const error: any = new Error("API fetch failed")
    error.status = response.status
    throw error
  }

  const data = await response.json()
  return data.data
}
