import { neon } from "@neondatabase/serverless"

// Check if DATABASE_URL exists
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// Create the SQL client
export const sql = neon(databaseUrl)

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
