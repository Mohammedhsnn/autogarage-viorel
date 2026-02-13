import { type NextRequest, NextResponse } from "next/server"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

type JwtPayload = { sub?: string; userId?: string; role?: string }

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload

    // Password-only admin login: token bevat sub === "admin"
    if (decoded.sub === "admin") {
      return NextResponse.json({
        user: { id: "admin", name: "Admin", role: "admin" },
      })
    }

    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
