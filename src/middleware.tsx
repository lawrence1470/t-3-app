import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
}

// Supports both a single string value or an array of matchers
export const config = {
    matcher: ['/abouts/:path*', '/dashboard/:path*'],
}