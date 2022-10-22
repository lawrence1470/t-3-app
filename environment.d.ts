declare namespace NodeJS {
  interface ProcessEnv {
    CLERK_API_KEY: string;
    NEXT_PUBLIC_MAP_BOX_TOKEN: string;
    NEXT_PUBLIC_CLERK_BASE_URL: string;
    NEXT_PUBLIC_STRIPE_SECRET: string;
  }
}
