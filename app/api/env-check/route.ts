import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Environment Variables Check",
    variables: {
      DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Not set",
      JWT_SECRET: process.env.JWT_SECRET ? "✅ Set" : "❌ Not set",
      NODE_ENV: process.env.NODE_ENV,
    },
    database_url_preview: process.env.DATABASE_URL
      ? `${process.env.DATABASE_URL.substring(0, 30)}...`
      : "Not available",
  })
}
