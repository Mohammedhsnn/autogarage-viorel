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

/** Verwijdert interne velden voor bezoekers (niet-ingelogde API). */
function stripOnderdeelForPublic<T extends Record<string, unknown>>(row: T): T {
  const { voorraad: _v, waarde: _w, ...rest } = row
  return rest as T
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ success: true, onderdelen: [], count: 0 })
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q")?.trim() || ""
    const merk = searchParams.get("merk")?.trim() || ""
    const artikelnummer = searchParams.get("artikelnummer")?.trim() || ""
    const motorcode = searchParams.get("motorcode")?.trim() || ""
    const versnellingsbakcode = searchParams.get("versnellingsbakcode")?.trim() || ""
    const chassisnummer = searchParams.get("chassisnummer")?.trim() || ""
    const kba_nummer = searchParams.get("kba_nummer")?.trim() || ""
    const category = searchParams.get("category")?.trim() || ""
    const wantAll = searchParams.get("active") === "false"
    const token = request.cookies.get("auth-token")?.value
    let isAdmin = false
    if (token) {
      try {
        jwt.verify(token, JWT_SECRET)
        isAdmin = true
      } catch {
        /* not admin */
      }
    }
    const activeOnly = wantAll ? !isAdmin : true

    let query = supabase
      .from("onderdelen")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
    if (activeOnly) query = query.eq("is_active", true)

    if (merk) query = query.ilike("merk", `%${merk}%`)
    if (artikelnummer) query = query.or(`artikelnummer.ilike.%${artikelnummer}%,name.ilike.%${artikelnummer}%`)
    if (motorcode) query = query.ilike("motorcode", `%${motorcode}%`)
    if (versnellingsbakcode) query = query.ilike("versnellingsbakcode", `%${versnellingsbakcode}%`)
    if (chassisnummer) query = query.ilike("chassisnummer", `%${chassisnummer}%`)
    if (kba_nummer) query = query.ilike("kba_nummer", `%${kba_nummer}%`)
    if (category) query = query.eq("category", category)
    if (q) {
      query = query.or(
        `name.ilike.%${q}%,description.ilike.%${q}%,artikelnummer.ilike.%${q}%,merk.ilike.%${q}%,motorcode.ilike.%${q}%,barcode.ilike.%${q}%`
      )
    }

    const { data: onderdelen, error } = await query

    if (error) {
      console.error("Onderdelen fetch error:", error)
      return NextResponse.json({ success: true, onderdelen: [], count: 0 })
    }

    const rows = onderdelen || []
    const safeList = isAdmin ? rows : rows.map((r) => stripOnderdeelForPublic(r as Record<string, unknown>))

    return NextResponse.json({
      success: true,
      onderdelen: safeList,
      count: safeList.length,
    })
  } catch (err) {
    console.error("API onderdelen GET:", err)
    return NextResponse.json({ success: true, onderdelen: [], count: 0 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 })
    jwt.verify(token, JWT_SECRET)

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: "Database niet geconfigureerd" }, { status: 500 })

    const body = await request.json()
    const {
      name,
      description,
      artikelnummer,
      barcode,
      voorraad,
      waarde,
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

    const desc = typeof description === "string" ? description.trim() : ""
    const artNr = typeof artikelnummer === "string" ? artikelnummer.trim() : ""
    const explicitName = typeof name === "string" ? name.trim() : ""
    const derivedName =
      explicitName ||
      (desc ? (desc.length > 255 ? `${desc.slice(0, 252)}...` : desc) : artNr ? `Onderdeel ${artNr}` : "")

    if (!derivedName) {
      return NextResponse.json({ error: "Omschrijving of onderdeelnummer is verplicht" }, { status: 400 })
    }

    const parseIntOrNull = (v: unknown) => {
      if (v === null || v === undefined || v === "") return null
      const n = parseInt(String(v), 10)
      return Number.isFinite(n) ? n : null
    }

    const { data: row, error } = await supabase
      .from("onderdelen")
      .insert([
        {
          name: derivedName,
          description: desc || null,
          artikelnummer: artNr || null,
          barcode: typeof barcode === "string" ? barcode.trim() || null : barcode != null ? String(barcode) : null,
          voorraad: parseIntOrNull(voorraad),
          waarde: parseIntOrNull(waarde),
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
        },
      ])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, onderdeel: row }, { status: 201 })
  } catch (err) {
    console.error("API onderdelen POST:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Fout bij aanmaken" },
      { status: 500 }
    )
  }
}
