import { type NextRequest, NextResponse } from "next/server"
import { getCars } from "@/app/actions"
import { supabaseAdmin } from "@/lib/supabase"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      status: searchParams.get("status") || "available",
      brand: searchParams.get("brand") || undefined,
      fuel: searchParams.get("fuel") || undefined,
      sortBy: searchParams.get("sortBy") || "created_at",
      sortOrder: searchParams.get("sortOrder") || "desc",
    }

    const cars = await getCars(filters)
    return NextResponse.json({
      success: true,
      cars: cars,
      count: cars.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch cars"
    const isConfigError = message.includes("Missing Supabase") || message.includes("Configure NEXT_PUBLIC_SUPABASE")

    // Bij ontbrekende Supabase-config: geen crash, lege lijst zodat /occasions gewoon laadt
    if (isConfigError) {
      return NextResponse.json({
        success: true,
        cars: [],
        count: 0,
        configMissing: true,
      })
    }

    console.error("API Error fetching cars:", error)
    return NextResponse.json(
      {
        success: false,
        error: message,
        cars: [],
      },
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

    const carData = await request.json()

    const {
      brand,
      model,
      year,
      price,
      mileage,
      fuel,
      transmission,
      doors,
      seats,
      color,
      description,
      apk_date,
      owners,
      images,
      features,
    } = carData

    const { data: newCar, error: carError } = await supabaseAdmin
      .from("cars")
      .insert([
        {
          brand,
          model,
          year,
          price,
          mileage,
          fuel,
          transmission,
          doors,
          seats,
          color,
          description,
          apk_date,
          owners: owners || 1,
          status: "available",
        },
      ])
      .select()
      .single()

    if (carError) throw carError

    if (images && Array.isArray(images) && images.length > 0) {
      const imageData = images.map((url: string, index: number) => ({
        car_id: newCar.id,
        image_url: url,
        is_primary: index === 0,
        sort_order: index + 1,
      }))

      await supabaseAdmin.from("car_images").insert(imageData)
    }

    if (features && Array.isArray(features) && features.length > 0) {
      const featureData = features.map((feature: string) => ({
        car_id: newCar.id,
        feature,
      }))

      await supabaseAdmin.from("car_features").insert(featureData)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Car created successfully",
        car: newCar,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating car:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
