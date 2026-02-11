import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// GET single car
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const carId = Number.parseInt(params.id)

    const { data, error } = await supabaseAdmin
      .from("cars")
      .select(
        `
        *,
        images:car_images(*),
        features:car_features(feature)
      `,
      )
      .eq("id", carId)
      .single()

    if (error) {
      console.error("Error fetching car:", error)
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    // Transform the data
    const car = {
      ...data,
      images: data.images || [],
      features: (data.features || []).map((f: any) => f.feature),
    }

    return NextResponse.json({ car })
  } catch (error) {
    console.error("Error fetching car:", error)
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 })
  }
}

// PUT update car (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
      jwt.verify(token, JWT_SECRET)
    } catch (jwtError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const carId = Number.parseInt(params.id)
    const carData = await request.json()

    console.log("Updating car:", carId, carData)

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
      status,
      images,
      features,
    } = carData

    // Update car
    const { data: updatedCar, error: carError } = await supabaseAdmin
      .from("cars")
      .update({
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
        status: status || "available",
        updated_at: new Date().toISOString(),
      })
      .eq("id", carId)
      .select()
      .single()

    if (carError) {
      console.error("Error updating car:", carError)
      return NextResponse.json({ error: carError.message }, { status: 500 })
    }

    // Update images if provided
    if (images && Array.isArray(images)) {
      // Delete existing images
      await supabaseAdmin.from("car_images").delete().eq("car_id", carId)

      // Insert new images
      if (images.length > 0) {
        const imageData = images.map((url: string, index: number) => ({
          car_id: carId,
          image_url: url,
          is_primary: index === 0,
          sort_order: index + 1,
        }))

        const { error: imagesError } = await supabaseAdmin.from("car_images").insert(imageData)

        if (imagesError) {
          console.error("Error updating images:", imagesError)
        }
      }
    }

    // Update features if provided
    if (features && Array.isArray(features)) {
      // Delete existing features
      await supabaseAdmin.from("car_features").delete().eq("car_id", carId)

      // Insert new features
      if (features.length > 0) {
        const featureData = features.map((feature: string) => ({
          car_id: carId,
          feature,
        }))

        const { error: featuresError } = await supabaseAdmin.from("car_features").insert(featureData)

        if (featuresError) {
          console.error("Error updating features:", featuresError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Car updated successfully",
      car: updatedCar,
    })
  } catch (error) {
    console.error("Error updating car:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update car" },
      { status: 500 },
    )
  }
}

// DELETE car (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
      jwt.verify(token, JWT_SECRET)
    } catch (jwtError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const carId = Number.parseInt(params.id)

    // Delete related images
    await supabaseAdmin.from("car_images").delete().eq("car_id", carId)

    // Delete related features
    await supabaseAdmin.from("car_features").delete().eq("car_id", carId)

    // Delete car
    const { error } = await supabaseAdmin.from("cars").delete().eq("id", carId)

    if (error) {
      console.error("Error deleting car:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Car deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting car:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete car" },
      { status: 500 },
    )
  }
}
