import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
]

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

function isWeekday(date: Date) {
  const d = date.getDay()
  return d >= 1 && d <= 6
}

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10)
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ success: false, error: "Database niet beschikbaar" }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const dateParam = searchParams.get("date")

  if (dateParam) {
    const date = new Date(dateParam + "T12:00:00")
    if (isNaN(date.getTime())) {
      return NextResponse.json({ success: false, error: "Ongeldige datum" }, { status: 400 })
    }
    const dateStr = toDateString(date)
    const { data: booked, error } = await supabase
      .from("appointments")
      .select("time_slot")
      .eq("appointment_date", dateStr)
      .neq("status", "cancelled")
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    const taken = new Set((booked || []).map((r) => r.time_slot))
    const available = TIME_SLOTS.filter((slot) => !taken.has(slot))
    return NextResponse.json({ success: true, date: dateStr, available, taken: Array.from(taken) })
  }

  const token = request.cookies.get("auth-token")?.value
  if (!token) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 })
  }
  try {
    jwt.verify(token, JWT_SECRET)
  } catch {
    return NextResponse.json({ error: "Ongeldige sessie" }, { status: 401 })
  }

  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  let query = supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true })
    .order("time_slot", { ascending: true })
  if (from) query = query.gte("appointment_date", from)
  if (to) query = query.lte("appointment_date", to)
  const { data: appointments, error } = await query
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, appointments: appointments || [] })
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ success: false, error: "Database niet beschikbaar" }, { status: 500 })
  }

  let body: {
    date?: string
    time_slot?: string
    service?: string
    name?: string
    email?: string
    phone?: string
    vehicle_info?: string
    notes?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: "Ongeldige body" }, { status: 400 })
  }

  const { date, time_slot, service, name, email, phone, vehicle_info, notes } = body
  if (!date || !time_slot || !service || !name || !email || !phone) {
    return NextResponse.json(
      { success: false, error: "Vul datum, tijd, dienst, naam, e-mail en telefoon in." },
      { status: 400 }
    )
  }

  const d = new Date(date + "T12:00:00")
  if (isNaN(d.getTime())) {
    return NextResponse.json({ success: false, error: "Ongeldige datum" }, { status: 400 })
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (d < today) {
    return NextResponse.json({ success: false, error: "Kies een datum in de toekomst." }, { status: 400 })
  }
  if (!isWeekday(d)) {
    return NextResponse.json({ success: false, error: "Wij zijn op zondag gesloten. Kies een maandag t/m zaterdag." }, { status: 400 })
  }
  if (!TIME_SLOTS.includes(time_slot)) {
    return NextResponse.json({ success: false, error: "Ongeldig tijdvak." }, { status: 400 })
  }

  const dateStr = toDateString(d)
  const { data: existing } = await supabase
    .from("appointments")
    .select("id")
    .eq("appointment_date", dateStr)
    .eq("time_slot", time_slot)
    .neq("status", "cancelled")
    .limit(1)
  if (existing && existing.length > 0) {
    return NextResponse.json({ success: false, error: "Dit tijdvak is al geboekt. Kies een ander moment." }, { status: 409 })
  }

  const { data: row, error } = await supabase
    .from("appointments")
    .insert([
      {
        appointment_date: dateStr,
        time_slot,
        service: String(service).trim(),
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        vehicle_info: vehicle_info ? String(vehicle_info).trim() : null,
        notes: notes ? String(notes).trim() : null,
        status: "confirmed",
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, appointment: row }, { status: 201 })
}
