import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password = typeof body?.password === "string" ? body.password : ""

    if (!password) {
      return NextResponse.json({ error: "Vul het wachtwoord in." }, { status: 400 })
    }

    // Hash: plain ($2b$12$...) of base64 (aanbevolen op Vercel i.v.m. $ in env)
    let raw = (process.env.ADMIN_PASSWORD_HASH ?? "").trim().replace(/\r?\n/g, "").replace(/^["']|["']$/g, "")
    if (raw && !raw.startsWith("$2")) {
      // Verwijder leading/trailing niet-base64 tekens (bijv. per ongeluk spaties/punten in Vercel)
      raw = raw.replace(/^[^A-Za-z0-9+/=]+|[^A-Za-z0-9+/=]+$/g, "")
      try {
        raw = Buffer.from(raw, "base64").toString("utf8")
      } catch {
        raw = ""
      }
    }
    const adminPasswordHash = raw
    if (!adminPasswordHash || !adminPasswordHash.startsWith("$2")) {
      console.error("Login: ADMIN_PASSWORD_HASH ontbreekt of ongeldig (controleer Vercel → Env vars → Production)")
      return NextResponse.json(
        { error: "Inloggen is niet geconfigureerd. Neem contact op met de beheerder." },
        { status: 500 },
      )
    }

    // Constant-time comparison via bcrypt (voorkomt timing attacks)
    const isValid = await bcrypt.compare(password, adminPasswordHash)
    if (!isValid) {
      return NextResponse.json({ error: "Ongeldig wachtwoord" }, { status: 401 })
    }

    const token = jwt.sign(
      { sub: "admin", role: "admin" },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: "admin", name: "Admin", role: "admin" },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400, // 24 uur
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Er is een fout opgetreden. Probeer het later opnieuw." },
      { status: 500 },
    )
  }
}
