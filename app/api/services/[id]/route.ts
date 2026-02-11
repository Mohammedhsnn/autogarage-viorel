import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// GET single service by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const { data: service, error } = await supabaseAdmin.from("services").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching service:", error)
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      service: service,
    })
  } catch (error) {
    console.error("API Error fetching service:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch service",
      },
      { status: 500 },
    )
  }
}

// PUT update service
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    jwt.verify(token, JWT_SECRET)

    const { id } = params
    const serviceData = await request.json()

    const {
      name,
      description,
      category,
      price,
      price_label,
      icon_name,
      icon_color,
      features,
      badge_text,
      badge_color,
      button_text,
      button_color,
      is_pricing_card,
      sort_order,
      is_active,
    } = serviceData

    const { data: updatedService, error: updateError } = await supabaseAdmin
      .from("services")
      .update({
        name,
        description,
        category,
        price,
        price_label,
        icon_name,
        icon_color,
        features,
        badge_text,
        badge_color,
        button_text,
        button_color,
        is_pricing_card,
        sort_order,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// DELETE service
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    jwt.verify(token, JWT_SECRET)

    const { id } = params

    const { error: deleteError } = await supabaseAdmin.from("services").delete().eq("id", id)

    if (deleteError) throw deleteError

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
