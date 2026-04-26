import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser-side Supabase client.
 * Use this in Client Components.
 */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Note: For Server Components, use a separate server-side client implementation
// typically found in lib/supabase/server.ts using createServerClient.
