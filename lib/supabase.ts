import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Server-side client with service role key (has full access)
// Only create client if environment variables are available at runtime
let _supabaseAdminInstance: SupabaseClient | null = null

function getSupabaseAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase environment variables. Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel: Project → Settings → Environment Variables (Production), then Redeploy."
    )
  }
  
  if (!_supabaseAdminInstance) {
    _supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  
  return _supabaseAdminInstance
}

// Export as a getter function
export const getSupabaseAdmin = getSupabaseAdminClient

// Export a proxy object that lazily initializes the client
// This allows using `supabaseAdmin.from(...)` syntax while deferring initialization
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabaseAdminClient()
    const value = client[prop as keyof SupabaseClient]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

// Client-side Supabase client
export function createClientComponentClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables for client. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel → Settings → Environment Variables."
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export interface Car {
  id: number
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel: string
  transmission: string
  doors: number
  seats: number
  color: string
  description: string | null
  apk_date: string | null
  owners: number
  status: "available" | "sold"
  created_at: string
  updated_at: string
  images?: CarImage[]
  features?: string[]
}

export interface CarImage {
  id: number
  car_id: number
  image_url: string
  is_primary: boolean
  sort_order: number
}

export interface User {
  id: number
  email: string
  name: string
  role: string
}
