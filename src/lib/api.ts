export async function apiFetch(
  path: string,
  options?: RequestInit
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${path}`,
    {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    }
  )

  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After")
    const seconds = retryAfter ? parseInt(retryAfter) : 60
    throw {
      type: "RATE_LIMITED",
      seconds,
      message: `Too many requests. Please wait ${seconds} seconds.`
    }
  }

  return response
}
