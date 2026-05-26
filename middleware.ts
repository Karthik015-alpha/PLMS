import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth-server'

const PUBLIC_FILE = /\.(.*)$/

const isPublic = (pathname: string) => {
  if (pathname.startsWith('/api')) return true
  if (pathname.startsWith('/_next')) return true
  if (pathname.startsWith('/static')) return true
  if (pathname === '/favicon.ico') return true
  if (pathname.startsWith('/public')) return true
  if (pathname.startsWith('/auth')) return true
  if (PUBLIC_FILE.test(pathname)) return true
  return false
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // allow public files and public routes
  if (isPublic(pathname)) return NextResponse.next()

  // Check custom session cookie for authenticated users
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  const hasSession = Boolean(await verifySessionToken(token))

  // If user is not authenticated and tries to access protected routes, redirect to login
  const protectedPrefixes = ['/dashboard', '/planner', '/subjects']
  if (!hasSession && protectedPrefixes.some((p) => pathname.startsWith(p))) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated and tries to access an auth page, redirect to dashboard
  if (hasSession && pathname.startsWith('/auth')) {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
// const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// export async function middleware(request: NextRequest) {
//   const response = NextResponse.next();

//   const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
//     cookies: {
//       getAll() {
//         return request.cookies.getAll();
//       },
//       setAll(cookiesToSet) {
//         cookiesToSet.forEach(({ name, value, options }) => {
//           response.cookies.set(name, value, options);
//         });
//       },
//     },
//   });

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     const loginUrl = new URL('/login', request.url);
//     loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname + request.nextUrl.search);

//     return NextResponse.redirect(loginUrl);
//   }

//   try {
//     const userId = user?.id ?? null;
//     if (userId) {
//       const { data: profile } = await supabase.from('users').select('id').eq('id', userId).maybeSingle();
//       if (!profile) {
//         await supabase.from('users').upsert({ id: userId, email: user.email ?? null }, { onConflict: 'id' });
//       }

//       const { pathname } = request.nextUrl;
//       const userDashboardPath = `/dashboard/${userId}`;
//       if (pathname === '/dashboard' || pathname === '/dashboard/') {
//         return NextResponse.redirect(new URL(userDashboardPath, request.url));
//       }
//       if (pathname.startsWith('/dashboard/') && pathname !== userDashboardPath) {
//         return NextResponse.redirect(new URL(userDashboardPath, request.url));
//       }
//     }
//   } catch (error) {
//     // non-fatal profile sync failure
//     // eslint-disable-next-line no-console
//     console.warn('middleware: public.users sync failed', error);
//   }

//   return response;
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/dashboard'],
// };
