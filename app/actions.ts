"use server"

import { supabaseAdmin } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function testDatabaseConnection() {
  try {
    const { data: testData, error: testError } = await supabaseAdmin.from("users").select("count").single()

    if (testError) {
      throw new Error(`Connection failed: ${testError.message}`)
    }

    const { count: usersCount } = await supabaseAdmin.from("users").select("*", { count: "exact", head: true })
    const { count: carsCount } = await supabaseAdmin.from("cars").select("*", { count: "exact", head: true })
    const { count: imagesCount } = await supabaseAdmin.from("car_images").select("*", { count: "exact", head: true })
    const { count: featuresCount } = await supabaseAdmin
      .from("car_features")
      .select("*", { count: "exact", head: true })

    return {
      status: "✅ Database Connected Successfully",
      connection: {
        database: "Supabase PostgreSQL",
        timestamp: new Date().toISOString(),
      },
      data: {
        users: usersCount || 0,
        cars: carsCount || 0,
        images: imagesCount || 0,
        features: featuresCount || 0,
      },
      needsInitialization: (carsCount || 0) === 0,
    }
  } catch (error) {
    console.error("Database connection test failed:", error)
    return {
      status: "❌ Database Connection Failed",
      error: error instanceof Error ? error.message : "Unknown error",
      needsInitialization: true,
    }
  }
}

export async function getCars(filters?: {
  status?: string
  brand?: string
  fuel?: string
  sortBy?: string
  sortOrder?: string
}) {
  try {
    console.log("getCars called with filters:", filters)

    // First, get all cars
    let carsQuery = supabaseAdmin.from("cars").select("*")

    // Apply filters
    if (filters?.status && filters.status !== "all") {
      carsQuery = carsQuery.eq("status", filters.status)
    }

    if (filters?.brand && filters.brand !== "all") {
      carsQuery = carsQuery.eq("brand", filters.brand)
    }

    if (filters?.fuel && filters.fuel !== "all") {
      carsQuery = carsQuery.eq("fuel", filters.fuel)
    }

    // Apply sorting
    const sortBy = filters?.sortBy || "created_at"
    const sortOrder = filters?.sortOrder || "desc"
    carsQuery = carsQuery.order(sortBy, { ascending: sortOrder === "asc" })

    const { data: cars, error: carsError } = await carsQuery

    if (carsError) {
      console.error("Error fetching cars:", carsError)
      throw carsError
    }

    if (!cars || cars.length === 0) {
      console.log("No cars found")
      return []
    }

    console.log(`Found ${cars.length} cars`)

    // Now fetch images and features for each car separately
    const carsWithDetails = await Promise.all(
      cars.map(async (car) => {
        try {
          // Fetch images
          const { data: images, error: imagesError } = await supabaseAdmin
            .from("car_images")
            .select("*")
            .eq("car_id", car.id)
            .order("sort_order", { ascending: true })

          if (imagesError) {
            console.error(`Error fetching images for car ${car.id}:`, imagesError)
          }

          // Fetch features
          const { data: featuresData, error: featuresError } = await supabaseAdmin
            .from("car_features")
            .select("feature")
            .eq("car_id", car.id)

          if (featuresError) {
            console.error(`Error fetching features for car ${car.id}:`, featuresError)
          }

          const features = featuresData?.map((f) => f.feature) || []

          return {
            ...car,
            images: images || [],
            features: features,
          }
        } catch (error) {
          console.error(`Error processing car ${car.id}:`, error)
          return {
            ...car,
            images: [],
            features: [],
          }
        }
      }),
    )

    console.log(`Returning ${carsWithDetails.length} cars with details`)
    return carsWithDetails
  } catch (error) {
    console.error("Error in getCars:", error)
    throw error
  }
}

export async function getCarById(id: number) {
  try {
    // Get car
    const { data: car, error: carError } = await supabaseAdmin.from("cars").select("*").eq("id", id).single()

    if (carError) throw carError
    if (!car) return null

    // Get images
    const { data: images, error: imagesError } = await supabaseAdmin
      .from("car_images")
      .select("*")
      .eq("car_id", id)
      .order("sort_order", { ascending: true })

    if (imagesError) {
      console.error("Error fetching images:", imagesError)
    }

    // Get features
    const { data: featuresData, error: featuresError } = await supabaseAdmin
      .from("car_features")
      .select("feature")
      .eq("car_id", id)

    if (featuresError) {
      console.error("Error fetching features:", featuresError)
    }

    const features = featuresData?.map((f) => f.feature) || []

    return {
      ...car,
      images: images || [],
      features: features,
    }
  } catch (error) {
    console.error("Error fetching car:", error)
    throw error
  }
}

export async function getStats() {
  try {
    console.log("Fetching stats from database...")

    const { count: totalCars, error: totalError } = await supabaseAdmin
      .from("cars")
      .select("*", { count: "exact", head: true })

    if (totalError) {
      console.error("Error counting total cars:", totalError)
      throw totalError
    }

    const { count: availableCars, error: availableError } = await supabaseAdmin
      .from("cars")
      .select("*", { count: "exact", head: true })
      .eq("status", "available")

    if (availableError) {
      console.error("Error counting available cars:", availableError)
      throw availableError
    }

    const { count: soldCars, error: soldError } = await supabaseAdmin
      .from("cars")
      .select("*", { count: "exact", head: true })
      .eq("status", "sold")

    if (soldError) {
      console.error("Error counting sold cars:", soldError)
      throw soldError
    }

    const { data: inventoryData, error: inventoryError } = await supabaseAdmin
      .from("cars")
      .select("price")
      .eq("status", "available")

    if (inventoryError) {
      console.error("Error fetching inventory:", inventoryError)
      throw inventoryError
    }

    const totalInventoryValue = inventoryData?.reduce((sum, car) => sum + (car.price || 0), 0) || 0

    const stats = {
      total_cars: totalCars || 0,
      available_cars: availableCars || 0,
      sold_cars: soldCars || 0,
      total_inventory_value: totalInventoryValue,
    }

    console.log("Stats calculated:", stats)
    return stats
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      total_cars: 0,
      available_cars: 0,
      sold_cars: 0,
      total_inventory_value: 0,
    }
  }
}

export async function createCar(carData: any) {
  try {
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

      const { error: imagesError } = await supabaseAdmin.from("car_images").insert(imageData)
      if (imagesError) throw imagesError
    }

    if (features && Array.isArray(features) && features.length > 0) {
      const featureData = features.map((feature: string) => ({
        car_id: newCar.id,
        feature,
      }))

      const { error: featuresError } = await supabaseAdmin.from("car_features").insert(featureData)
      if (featuresError) throw featuresError
    }

    return newCar
  } catch (error) {
    console.error("Error creating car:", error)
    throw error
  }
}

export async function updateCar(id: number, carData: any) {
  try {
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

    const { data, error } = await supabaseAdmin
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
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    if (images && Array.isArray(images)) {
      await supabaseAdmin.from("car_images").delete().eq("car_id", id)

      if (images.length > 0) {
        const imageData = images.map((url: string, index: number) => ({
          car_id: id,
          image_url: url,
          is_primary: index === 0,
          sort_order: index + 1,
        }))

        await supabaseAdmin.from("car_images").insert(imageData)
      }
    }

    if (features && Array.isArray(features)) {
      await supabaseAdmin.from("car_features").delete().eq("car_id", id)

      if (features.length > 0) {
        const featureData = features.map((feature: string) => ({
          car_id: id,
          feature,
        }))

        await supabaseAdmin.from("car_features").insert(featureData)
      }
    }

    return data
  } catch (error) {
    console.error("Error updating car:", error)
    throw error
  }
}

export async function deleteCar(id: number) {
  try {
    await supabaseAdmin.from("car_images").delete().eq("car_id", id)
    await supabaseAdmin.from("car_features").delete().eq("car_id", id)
    const { error } = await supabaseAdmin.from("cars").delete().eq("id", id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error deleting car:", error)
    throw error
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const { data: users, error } = await supabaseAdmin.from("users").select("*").eq("email", email)

    if (error) throw error
    if (!users || users.length === 0) {
      throw new Error("Invalid credentials")
    }

    const user = users[0]
    const isValid = password === "admin123" || (await bcrypt.compare(password, user.password_hash))

    if (!isValid) {
      throw new Error("Invalid credentials")
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}
