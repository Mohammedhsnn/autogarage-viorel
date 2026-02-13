import { neon } from "@neondatabase/serverless"

// Lazy init: geen throw bij import, zodat build op Vercel slaagt als DATABASE_URL alleen runtime is gezet
let _sql: ReturnType<typeof neon> | null = null
function getSql(): ReturnType<typeof neon> {
  if (!_sql) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set")
    }
    _sql = neon(databaseUrl)
  }
  return _sql
}

export const sql = new Proxy({} as ReturnType<typeof neon>, {
  apply(_, __, args: unknown[]) {
    return getSql()(args[0] as TemplateStringsArray, ...(args.slice(1) as unknown[]))
  },
})

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
