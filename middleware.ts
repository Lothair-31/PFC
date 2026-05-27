// middleware.ts (root of project)
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next({
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
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              res.cookies.set(name, value, options)
            })
          } catch {
            // Ignore errors in middleware
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes
  const protectedPaths = ['/account', '/dashboard', '/subscription']
  
  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path)) && !user) {
    return NextResponse.redirect(new URL('/account', request.url))
  }

  // Redirect logged-in users away from auth pages if needed
  const authPaths = ['/account'] // since your login/signup is combined
  if (authPaths.some(path => request.nextUrl.pathname.startsWith(path)) && user) {
    // Optional: redirect to dashboard or stay on account
  }

  return res
}

export const config = {
  matcher: [
    '/account/:path*',
    '/dashboard/:path*',
    '/subscription/:path*',
  ],
}