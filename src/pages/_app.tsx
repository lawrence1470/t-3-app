// src/pages/_app.tsx
import {withTRPC} from "@trpc/next";
import type {AppRouter} from "../server/router";
import type {AppType} from "next/dist/shared/lib/utils";
import superjson from "superjson";
import {useRouter} from 'next/router';
import {ClerkProvider, SignedIn, SignedOut, RedirectToSignIn} from '@clerk/nextjs';
import Layout from "../components/Layout";
import "../styles/globals.css";


//  List pages you want to be publicly accessible, or leave empty if
//  every page requires authentication. Use this naming strategy:
//   "/"              for pages/index.js
//   "/foo"           for pages/foo/index.js
//   "/foo/bar"       for pages/foo/bar.js
//   "/foo/[...bar]"  for pages/foo/[...bar].js
const publicPages: string[] = [];


const MyApp: AppType = ({Component, pageProps}) => {
    const {pathname} = useRouter();


    // Check if the current route matches a public page
    const isPublicPage = publicPages.includes(pathname);

    return (
        <ClerkProvider {...pageProps} >
            {isPublicPage ? (
                <Component {...pageProps}/>
            ) : (
                <>
                    <SignedIn>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </SignedIn>
                    <SignedOut>
                        <RedirectToSignIn/>
                    </SignedOut>
                </>
            )}
        </ClerkProvider>
    );
};

const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return "";
    }
    if (process.browser) return ""; // Browser should use current path
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
    config({ctx}) {
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         */
        const url = `${getBaseUrl()}/api/trpc`;

        return {
            url,
            transformer: superjson,
            /**
             * @link https://react-query.tanstack.com/reference/QueryClient
             */
            // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
        };
    },
    /**
     * @link https://trpc.io/docs/ssr
     */
    ssr: false,
})(MyApp);
