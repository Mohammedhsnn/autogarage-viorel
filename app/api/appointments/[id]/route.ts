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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("auth-token")?.value
  if (!token) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 })
  try {
    jwt.verify(token, JWT_SECRET)
  } catch {
    return NextResponse.json({ error: "Ongeldige sessie" }, { status: 401 })
  }

  const { id } = await params
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: "Database niet beschikbaar" }, { status: 500 })

  let body: { status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Ongeldige body" }, { status: 400 })
  }
  if (body.status !== "cancelled" && body.status !== "completed") {
    return NextResponse.json({ error: "Ongeldige status" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("appointments")
    .update({ status: body.status })
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, appointment: data })
}
