import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareSupabaseClient } from '@/utils/middlewareClient'

// Middleware for the user authentication
export async function middleware(req: NextRequest) {
  const { supabase, res } = createMiddlewareSupabaseClient(req);

  const { data: { session } } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith('/chat')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return res;
}
