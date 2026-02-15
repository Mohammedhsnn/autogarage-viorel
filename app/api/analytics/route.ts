import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

/** Record a page view (public, called from front-end). Skips /admin and /api. */
export async function POST(request: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ ok: true }, { status: 200 })

  let path = "/"
  try {
    const body = await request.json().catch(() => ({}))
    path = typeof body.path === "string" ? body.path.slice(0, 500) : "/"
  } catch {
    // ignore
  }

  if (path.startsWith("/admin") || path.startsWith("/api")) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  await supabase.from("page_views").insert([{ path }])
  return NextResponse.json({ ok: true }, { status: 200 })
}

/** Get analytics stats (admin only). */
export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  if (!token) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 })
  try {
    jwt.verify(token, JWT_SECRET)
  } catch {
    return NextResponse.json({ error: "Ongeldige sessie" }, { status: 401 })
  }

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ success: false, error: "Database niet beschikbaar" }, { status: 500 })
  }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now)
  weekStart.setDate(weekStart.getDate() - 7)
  const weekStartStr = weekStart.toISOString()

  const [
    { count: total },
    { count: today },
    { count: week },
    { data: byPath },
  ] = await Promise.all([
    supabase.from("page_views").select("*", { count: "exact", head: true }),
    supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", todayStart),
    supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", weekStartStr),
    supabase.from("page_views").select("path").gte("created_at", weekStartStr),
  ])

  const pathCounts: Record<string, number> = {}
  for (const row of byPath || []) {
    const p = row.path || "/"
    pathCounts[p] = (pathCounts[p] || 0) + 1
  }
  const topPaths = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([path, views]) => ({ path, views }))

  return NextResponse.json({
    success: true,
    stats: {
      total: total ?? 0,
      today: today ?? 0,
      thisWeek: week ?? 0,
    },
    topPaths,
  })
}
