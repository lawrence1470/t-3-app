// TODO https://stackoverflow.com/questions/69061240/nextjs-importing-next-document-outside-of-pages-document-error
// eslint-disable-next-line @next/next/no-server-import-in-page
import {NextResponse} from 'next/server';
import {getAuth, withClerkMiddleware} from '@clerk/nextjs/server';

export const middleware = withClerkMiddleware(request => {
  const {sessionId, claims} = getAuth(request);

  if (!sessionId) {
    const destination = request.nextUrl.href;
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('redirect_url', destination);
    return NextResponse.redirect(url);
  }

  /*
    Check if the user is part of an organization
  */
  // if (!claims?.orgs) {
  //   return NextResponse.redirect(new URL('/organization', request.url));
  // }

  return NextResponse.next();
});

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ['/dashboard/:path*', '/properties'],
};
