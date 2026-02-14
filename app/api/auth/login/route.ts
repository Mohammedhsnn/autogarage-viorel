import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

/** Haal optionele ADMIN_PASSWORD_HASH uit env (plain $2b$... of base64) */
function getEnvPasswordHash(): string | null {
  let raw = (process.env.ADMIN_PASSWORD_HASH ?? "").trim().replace(/\r?\n/g, "").replace(/^["']|["']$/g, "")
  if (!raw) return null
  // Plain bcrypt-hash: gebruik direct (niet strippen, anders verdwijnen de $)
  if (raw.startsWith("$2")) return raw
  // Base64: strip alleen rand-tekens die geen base64 zijn
  raw = raw.replace(/^[^A-Za-z0-9+/=]+|[^A-Za-z0-9+/=]+$/g, "")
  if (!raw) return null
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8")
    return decoded.startsWith("$2") ? decoded : null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password = typeof body?.password === "string" ? body.password : ""

    if (!password) {
      return NextResponse.json({ error: "Vul het wachtwoord in." }, { status: 400 })
    }

    let adminPasswordHash: string | null = null
    let adminName = "Admin"

    // 1) Probeer admin uit Supabase (users-tabel, role = admin)
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (url && key) {
        const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
        const { data: users, error } = await supabase
          .from("users")
          .select("id, password_hash, name, role")
          .eq("role", "admin")
          .limit(1)
        if (!error && users?.[0]?.password_hash) {
          adminPasswordHash = users[0].password_hash
          adminName = users[0].name ?? "Admin"
        }
      }
    } catch (e) {
      console.error("Login Supabase:", e)
    }

    // 2) Fallback: ADMIN_PASSWORD_HASH uit env (Vercel/lokaal)
    if (!adminPasswordHash) {
      adminPasswordHash = getEnvPasswordHash()
    }

    if (!adminPasswordHash || !adminPasswordHash.startsWith("$2")) {
      const envLen = (process.env.ADMIN_PASSWORD_HASH ?? "").length
      console.error("Login: no valid admin hash. Env ADMIN_PASSWORD_HASH length:", envLen)
      return NextResponse.json(
        {
          error:
            "Geen admin-wachtwoord op de server. Zet in Vercel → Settings → Environment Variables de variabele ADMIN_PASSWORD_HASH (waarde: base64 JDIyYiQxMCRDOHJDWmxLSjl3TTZ5bE9zOHdqdHZ1Mi9LYWI3V2hzSVNOeG90dmRDQWdIaS8yRno4VHhIRw== voor wachtwoord ViorelAdmin12), daarna Redeploy.",
        },
        { status: 500 },
      )
    }

    let isValid: boolean
    try {
      isValid = await bcrypt.compare(password, adminPasswordHash)
    } catch (bcryptError) {
      console.error("Login bcrypt.compare error:", bcryptError)
      return NextResponse.json(
        { error: "Wachtwoordcontrole mislukt. Controleer of ADMIN_PASSWORD_HASH een geldige bcrypt-hash is (of base64 daarvan)." },
        { status: 500 },
      )
    }
    if (!isValid) {
      return NextResponse.json({ error: "Ongeldig wachtwoord" }, { status: 401 })
    }

    const token = jwt.sign({ sub: "admin", role: "admin" }, JWT_SECRET, { expiresIn: "24h" })

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: "admin", name: adminName, role: "admin" },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    })

    return response
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error("Login error:", err.message, err.stack)
    return NextResponse.json(
      { error: "Er is een fout opgetreden. Bekijk Vercel → Project → Logs voor details." },
      { status: 500 },
    )
  }
}
