import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { supabaseAdmin } from "@/lib/supabase"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password = typeof body?.password === "string" ? body.password : ""

    if (!password) {
      return NextResponse.json({ error: "Vul het wachtwoord in." }, { status: 400 })
    }

    // Admin-gebruiker ophalen uit Supabase (users-tabel, role = admin)
    const { data: users, error: dbError } = await supabaseAdmin
      .from("users")
      .select("id, password_hash, name, role")
      .eq("role", "admin")
      .limit(1)

    if (dbError) {
      console.error("Login Supabase error:", dbError.message)
      return NextResponse.json(
        { error: "Inloggen is niet geconfigureerd. Controleer de database (Supabase)." },
        { status: 500 },
      )
    }

    const adminUser = users?.[0]
    if (!adminUser?.password_hash) {
      console.error("Login: geen admin-gebruiker in Supabase (users-tabel, role=admin)")
      return NextResponse.json(
        { error: "Inloggen is niet geconfigureerd. Voeg een admin-gebruiker toe in Supabase." },
        { status: 500 },
      )
    }

    const isValid = await bcrypt.compare(password, adminUser.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: "Ongeldig wachtwoord" }, { status: 401 })
    }

    const token = jwt.sign(
      { sub: "admin", role: "admin", userId: adminUser.id },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: adminUser.id, name: adminUser.name ?? "Admin", role: adminUser.role ?? "admin" },
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
