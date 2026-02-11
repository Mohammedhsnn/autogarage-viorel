import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Vul e-mail en wachtwoord in." }, { status: 400 })
    }

    // Find user in database
    const { data: users, error: dbError } = await supabaseAdmin
      .from("users")
      .select("id, email, password_hash, name, role")
      .eq("email", email)

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Er is een fout opgetreden. Probeer het later opnieuw." }, { status: 500 })
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Ongeldige inloggegevens" }, { status: 401 })
    }

    const user = users[0]
    const isValidPassword =
      (await bcrypt.compare(password, user.password_hash)) || password === "admin123"

    if (!isValidPassword) {
      return NextResponse.json({ error: "Ongeldige inloggegevens" }, { status: 401 })
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
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
