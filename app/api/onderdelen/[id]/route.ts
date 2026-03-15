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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)
    if (Number.isNaN(numId)) {
      return NextResponse.json({ error: "Ongeldig id" }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: "Database niet geconfigureerd" }, { status: 500 })

    const { data, error } = await supabase
      .from("onderdelen")
      .select("*")
      .eq("id", numId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Onderdeel niet gevonden" }, { status: 404 })
    }
    return NextResponse.json({ success: true, onderdeel: data })
  } catch (err) {
    console.error("API onderdelen [id] GET:", err)
    return NextResponse.json({ error: "Fout bij ophalen" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 })
    jwt.verify(token, JWT_SECRET)

    const { id } = await params
    const numId = parseInt(id, 10)
    if (Number.isNaN(numId)) {
      return NextResponse.json({ error: "Ongeldig id" }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: "Database niet geconfigureerd" }, { status: 500 })

    const body = await request.json()
    const {
      name,
      description,
      artikelnummer,
      merk,
      motorcode,
      versnellingsbakcode,
      chassisnummer,
      kba_nummer,
      category,
      price,
      image_url,
      is_active,
      sort_order,
    } = body

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Naam is verplicht" }, { status: 400 })
    }

    const updates: Record<string, unknown> = {
      name: name.trim(),
      description: description?.trim() || null,
      artikelnummer: artikelnummer?.trim() || null,
      merk: merk?.trim() || null,
      motorcode: motorcode?.trim() || null,
      versnellingsbakcode: versnellingsbakcode?.trim() || null,
      chassisnummer: chassisnummer?.trim() || null,
      kba_nummer: kba_nummer?.trim() || null,
      category: category?.trim() || "overig",
      price: price != null && price !== "" ? parseInt(String(price), 10) : null,
      image_url: image_url?.trim() || null,
      is_active: is_active !== false,
      sort_order: sort_order != null && sort_order !== "" ? parseInt(String(sort_order), 10) : 0,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("onderdelen")
      .update(updates)
      .eq("id", numId)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, onderdeel: data })
  } catch (err) {
    console.error("API onderdelen [id] PATCH:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Fout bij bijwerken" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = _request.cookies.get("auth-token")?.value
    if (!token) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 })
    jwt.verify(token, JWT_SECRET)

    const { id } = await params
    const numId = parseInt(id, 10)
    if (Number.isNaN(numId)) {
      return NextResponse.json({ error: "Ongeldig id" }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: "Database niet geconfigureerd" }, { status: 500 })

    const { error } = await supabase.from("onderdelen").delete().eq("id", numId)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("API onderdelen [id] DELETE:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Fout bij verwijderen" },
      { status: 500 }
    )
  }
}
