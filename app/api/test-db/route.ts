import { NextResponse } from "next/server"
import { testDatabaseConnection } from "@/app/actions"

export async function GET() {
  try {
    const result = await testDatabaseConnection()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Database test error:", error)

    return NextResponse.json(
      {
        status: "❌ Database Connection Failed",
        error: error instanceof Error ? error.message : "Unknown error",
        troubleshooting: {
          check_env: "Verify Supabase credentials are set in .env.local",
          check_supabase: "Ensure Supabase project is active and accessible",
          check_tables: "Run the SQL script to create tables",
          restart_server: "Restart your development server after adding environment variables",
        },
        debug_info: {
          has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          node_env: process.env.NODE_ENV,
        },
      },
      { status: 500 },
    )
  }
}
