import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const RDW_BASE = "https://opendata.rdw.nl/resource/v3f4-hhw2.json"

/** Normaliseer kenteken: alleen cijfers en letters, hoofdletters (RDW zonder streepjes) */
function normalizeKenteken(kenteken: string): string {
  return kenteken.replace(/[\s\-\.]/g, "").toUpperCase().slice(0, 8)
}

export interface RdwVehicle {
  kenteken?: string
  voertuigsoort?: string
  merk?: string
  handelsbenaming?: string
  datum_eerste_toelating?: string
  eerste_kleur?: string
  [key: string]: unknown
}

export async function GET(request: NextRequest) {
  const kentekenParam = request.nextUrl.searchParams.get("kenteken")
  if (!kentekenParam || !kentekenParam.trim()) {
    return NextResponse.json(
      { success: false, error: "Kenteken is verplicht" },
      { status: 400 }
    )
  }

  const kenteken = normalizeKenteken(kentekenParam.trim())
  if (kenteken.length < 4) {
    return NextResponse.json(
      { success: false, error: "Kenteken te kort" },
      { status: 400 }
    )
  }

  try {
    // 1. RDW Open Data: voertuiggegevens ophalen
    const rdwUrl = `${RDW_BASE}?kenteken=${encodeURIComponent(kenteken)}`
    const rdwRes = await fetch(rdwUrl, { next: { revalidate: 86400 } }) // cache 24h
    if (!rdwRes.ok) {
      return NextResponse.json(
        { success: false, error: "Kon voertuiggegevens niet ophalen" },
        { status: 502 }
      )
    }
    const rdwData: RdwVehicle[] = await rdwRes.json()
    const vehicle = Array.isArray(rdwData) && rdwData.length > 0 ? rdwData[0] : null

    if (!vehicle || !vehicle.merk) {
      return NextResponse.json({
        success: true,
        autosoort: null,
        merk: null,
        message: "Geen voertuig gevonden voor dit kenteken.",
      })
    }

    // 2. Gemini: korte Nederlandse zin "wat voor auto is dit" voor onderdelen zoeken
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    let autosoort: string | null = null

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        const jaar = vehicle.datum_eerste_toelating
          ? String(vehicle.datum_eerste_toelating).slice(0, 4)
          : ""
        const prompt = `Je bent een assistent voor een Nederlandse autogarage. Geef exact één korte zin in het Nederlands die dit voertuig beschrijft voor een klant die onderdelen zoekt. Gebruik alleen de gegevens hieronder. Geen uitleg, alleen de zin.

Merk: ${vehicle.merk || "onbekend"}
Type/handelsbenaming: ${vehicle.handelsbenaming || "onbekend"}
Voertuigsoort: ${vehicle.voertuigsoort || "onbekend"}
Eerste toelating (jaar): ${jaar}
Kleur: ${vehicle.eerste_kleur || "onbekend"}

Voorbeelden van gewenste antwoorden: "Volkswagen Golf uit 2015", "BMW 3-serie personenauto", "Ford Focus uit 2012".`

        const result = await model.generateContent(prompt)
        const text = result.response?.text?.()?.trim()
        if (text) autosoort = text.replace(/^["']|["']$/g, "").trim()
      } catch (geminiErr) {
        // Fallback zonder Gemini: eigen korte omschrijving
        const jaar = vehicle.datum_eerste_toelating
          ? String(vehicle.datum_eerste_toelating).slice(0, 4)
          : ""
        autosoort = [vehicle.merk, vehicle.handelsbenaming, jaar].filter(Boolean).join(" ")
      }
    } else {
      const jaar = vehicle.datum_eerste_toelating
        ? String(vehicle.datum_eerste_toelating).slice(0, 4)
        : ""
      autosoort = [vehicle.merk, vehicle.handelsbenaming, jaar].filter(Boolean).join(" ")
    }

    return NextResponse.json({
      success: true,
      autosoort,
      merk: vehicle.merk || null,
      vehicleData: {
        merk: vehicle.merk,
        handelsbenaming: vehicle.handelsbenaming,
        voertuigsoort: vehicle.voertuigsoort,
        datum_eerste_toelating: vehicle.datum_eerste_toelating,
      },
    })
  } catch (err) {
    console.error("kenteken-lookup error:", err)
    return NextResponse.json(
      { success: false, error: "Er ging iets mis bij het opzoeken." },
      { status: 500 }
    )
  }
}
