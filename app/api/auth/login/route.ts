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

    // Hash kan als plain ($2b$12$...) of als base64 in env staan (voorkomt $ expansion)
    let adminPasswordHash = (process.env.ADMIN_PASSWORD_HASH ?? "").trim().replace(/^["']|["']$/g, "")
    if (adminPasswordHash && !adminPasswordHash.startsWith("$2")) {
      try {
        adminPasswordHash = Buffer.from(adminPasswordHash, "base64").toString("utf8")
      } catch {
        adminPasswordHash = ""
      }
    }
    if (!adminPasswordHash || !adminPasswordHash.startsWith("$2")) {
      console.error("ADMIN_PASSWORD_HASH / ADMIN_PASSWORD_HASH_B64 is not set or invalid")
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
      sameSite: "strict",
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
