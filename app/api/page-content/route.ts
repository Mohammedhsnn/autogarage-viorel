import { type NextRequest, NextResponse } from "next/server"
import * as jwt from "jsonwebtoken"
import { supabaseAdmin } from "@/lib/supabase"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

function getPageSlugFromRequest(request: NextRequest): string | null {
  const { searchParams } = new URL(request.url)
  return searchParams.get("pageSlug") || searchParams.get("page_slug") || searchParams.get("slug")
}

export async function GET(request: NextRequest) {
  try {
    const pageSlug = getPageSlugFromRequest(request)
    if (!pageSlug) {
      return NextResponse.json({ success: false, error: "Missing pageSlug" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("page_content")
      .select("content")
      .eq("page_slug", pageSlug)
      .maybeSingle()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || "Failed to fetch page content" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      content: (data?.content ?? {}) as Record<string, unknown>,
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to fetch page content" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    jwt.verify(token, JWT_SECRET)

    const body = (await request.json()) as {
      pageSlug?: string
      page_slug?: string
      content?: Record<string, unknown>
    }

    const pageSlug = body.pageSlug || body.page_slug
    if (!pageSlug) {
      return NextResponse.json({ error: "Missing pageSlug" }, { status: 400 })
    }

    const content = (body.content ?? {}) as Record<string, unknown>

    const { data, error } = await supabaseAdmin
      .from("page_content")
      .upsert(
        [
          {
            page_slug: pageSlug,
            content,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "page_slug" },
      )
      .select("content")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message || "Failed to update page content" }, { status: 500 })
    }

    return NextResponse.json({ success: true, content: (data?.content ?? {}) as Record<string, unknown> })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update page content"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

