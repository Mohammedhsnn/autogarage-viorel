import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// GET all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const activeOnly = searchParams.get("active") !== "false"

    let query = supabaseAdmin.from("services").select("*")

    if (category) {
      query = query.eq("category", category)
    }

    if (activeOnly) {
      query = query.eq("is_active", true)
    }

    query = query.order("sort_order", { ascending: true })

    const { data: services, error } = await query

    if (error) {
      console.error("Error fetching services:", error)
      throw error
    }

    return NextResponse.json({
      success: true,
      services: services || [],
      count: services?.length || 0,
    })
  } catch (error) {
    console.error("API Error fetching services:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch services",
        services: [],
      },
      { status: 500 },
    )
  }
}

// POST create new service
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    jwt.verify(token, JWT_SECRET)

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

    const { data: newService, error: serviceError } = await supabaseAdmin
      .from("services")
      .insert([
        {
          name,
          description,
          category: category || "main",
          price: price || null,
          price_label: price_label || null,
          icon_name: icon_name || "Settings",
          icon_color: icon_color || "blue",
          features: features || [],
          badge_text: badge_text || null,
          badge_color: badge_color || "blue",
          button_text: button_text || "Meer informatie",
          button_color: button_color || "blue",
          is_pricing_card: is_pricing_card || false,
          sort_order: sort_order || 0,
          is_active: is_active !== undefined ? is_active : true,
        },
      ])
      .select()
      .single()

    if (serviceError) throw serviceError

    return NextResponse.json(
      {
        success: true,
        message: "Service created successfully",
        service: newService,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
