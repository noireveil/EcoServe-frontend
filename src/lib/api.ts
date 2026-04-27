export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const url = path.startsWith("/") ? path : `/${path}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  })

  if (response.status === 429) {
    throw { type: "RATE_LIMITED", seconds: 60 }
  }

  return response
}
