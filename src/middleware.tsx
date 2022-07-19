// TODO https://stackoverflow.com/questions/69061240/nextjs-importing-next-document-outside-of-pages-document-error
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from "next/server";
import { requireAuth, WithAuthProp } from "@clerk/nextjs/api";
import e from "express";
import { ParamsDictionary } from "express-serve-static-core";
import QueryString from "qs";

type ClerkReq = WithAuthProp<e.Request<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>>

export const middleware = requireAuth((request: ClerkReq) => {

  /*
    Check if the user is part of an organization
  */
  if (!request.auth.claims?.orgs) {
    return NextResponse.redirect(new URL("/organization/create", request.url));
  }
});

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ["/abouts/:path*", "/dashboard/:path*", "/"]
};