// TODO https://stackoverflow.com/questions/69061240/nextjs-importing-next-document-outside-of-pages-document-error
// eslint-disable-next-line @next/next/no-server-import-in-page
import {NextResponse} from 'next/server';
import {getAuth, withClerkMiddleware} from '@clerk/nextjs/server';

export const middleware = withClerkMiddleware(request => {
  const {userId, claims} = getAuth(request);

  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  /*
    Check if the user is part of an organization
  */
  if (!claims?.org_role) {
    return NextResponse.redirect(new URL('/organizations', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/landlord') && claims.org_role !== 'admin') {
    return NextResponse.redirect(new URL('/tenant/dashboard', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/tenant') && claims.org_role !== 'basic_member') {
    console.log('here');
    return NextResponse.redirect(new URL('/landlord/dashboard', request.url));
  }

  return NextResponse.next();
});

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ['/landlord/:path*', '/tenant/:path*'],
};
