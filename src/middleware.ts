import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Bypass route protection in development
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) {
    return supabaseResponse
  }

  const { pathname } = request.nextUrl

  // Protect /consumer/* routes
  if (pathname.startsWith('/consumer')) {
    if (!user) {
      const redirectUrl = new URL('/auth', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role_type')
      .eq('id', user.id)
      .single()

    if (profile?.role_type !== 'consumer') {
      const redirectUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Protect /technician/* routes
  if (pathname.startsWith('/technician')) {
    if (!user) {
      const redirectUrl = new URL('/auth', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role_type')
      .eq('id', user.id)
      .single()

    if (profile?.role_type !== 'technician') {
      const redirectUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/consumer/:path*',
    '/technician/:path*',
  ],
}
