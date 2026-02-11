import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
    env_check: {
      has_database_url: !!process.env.DATABASE_URL,
      has_jwt_secret: !!process.env.JWT_SECRET,
      node_env: process.env.NODE_ENV,
    },
  })
}
