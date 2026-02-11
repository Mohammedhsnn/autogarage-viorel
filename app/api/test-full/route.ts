import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[],
    summary: {
      passed: 0,
      failed: 0,
      total: 0,
    },
  }

  // Test 1: Environment Variables
  try {
    const envTest = {
      name: "Environment Variables",
      status: "PASS",
      details: {
        DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
        JWT_SECRET: process.env.JWT_SECRET ? "✅ Set" : "❌ Missing",
        NODE_ENV: process.env.NODE_ENV || "development",
      },
    }

    if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
      envTest.status = "FAIL"
      results.summary.failed++
    } else {
      results.summary.passed++
    }

    results.tests.push(envTest)
    results.summary.total++
  } catch (error) {
    results.tests.push({
      name: "Environment Variables",
      status: "FAIL",
      error: error instanceof Error ? error.message : "Unknown error",
    })
    results.summary.failed++
    results.summary.total++
  }

  // Test 2: Database Connection
  try {
    const dbResult = await sql`SELECT NOW() as current_time, version() as db_version`
    results.tests.push({
      name: "Database Connection",
      status: "PASS",
      details: {
        connected: true,
        timestamp: dbResult[0].current_time,
        version: dbResult[0].db_version.split(" ").slice(0, 2).join(" "),
      },
    })
    results.summary.passed++
  } catch (error) {
    results.tests.push({
      name: "Database Connection",
      status: "FAIL",
      error: error instanceof Error ? error.message : "Unknown error",
    })
    results.summary.failed++
  }
  results.summary.total++

  // Test 3: Tables Exist
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'cars', 'car_images', 'car_features')
      ORDER BY table_name
    `

    const foundTables = tables.map((t) => t.table_name)
    const expectedTables = ["users", "cars", "car_images", "car_features"]
    const missingTables = expectedTables.filter((expected) => !foundTables.includes(expected))

    results.tests.push({
      name: "Database Tables",
      status: missingTables.length === 0 ? "PASS" : "FAIL",
      details: {
        expected: expectedTables,
        found: foundTables,
        missing: missingTables,
      },
    })

    if (missingTables.length === 0) {
      results.summary.passed++
    } else {
      results.summary.failed++
    }
  } catch (error) {
    results.tests.push({
      name: "Database Tables",
      status: "FAIL",
      error: error instanceof Error ? error.message : "Unknown error",
    })
    results.summary.failed++
  }
  results.summary.total++

  // Test 4: Data Counts
  try {
    const userCount = await sql`SELECT COUNT(*) as count FROM users`
    const carCount = await sql`SELECT COUNT(*) as count FROM cars`
    const imageCount = await sql`SELECT COUNT(*) as count FROM car_images`
    const featureCount = await sql`SELECT COUNT(*) as count FROM car_features`

    results.tests.push({
      name: "Data Counts",
      status: "PASS",
      details: {
        users: Number.parseInt(userCount[0].count),
        cars: Number.parseInt(carCount[0].count),
        images: Number.parseInt(imageCount[0].count),
        features: Number.parseInt(featureCount[0].count),
      },
    })
    results.summary.passed++
  } catch (error) {
    results.tests.push({
      name: "Data Counts",
      status: "FAIL",
      error: error instanceof Error ? error.message : "Unknown error",
    })
    results.summary.failed++
  }
  results.summary.total++

  // Test 5: Sample Car Insert
  try {
    // Try to insert a test car
    const testCar = await sql`
      INSERT INTO cars (brand, model, year, price, mileage, fuel, transmission, doors, seats, color, description, status)
      VALUES ('TEST', 'Debug Car', 2024, 1000, 0, 'Benzine', 'Handgeschakeld', 5, 5, 'Rood', 'Test car for debugging', 'available')
      RETURNING id, brand, model
    `

    // Delete the test car immediately
    await sql`DELETE FROM cars WHERE id = ${testCar[0].id}`

    results.tests.push({
      name: "Car Insert/Delete Test",
      status: "PASS",
      details: {
        inserted_id: testCar[0].id,
        car: `${testCar[0].brand} ${testCar[0].model}`,
        deleted: true,
      },
    })
    results.summary.passed++
  } catch (error) {
    results.tests.push({
      name: "Car Insert/Delete Test",
      status: "FAIL",
      error: error instanceof Error ? error.message : "Unknown error",
    })
    results.summary.failed++
  }
  results.summary.total++

  return NextResponse.json(results)
}

// POST endpoint to test car creation
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Insert test car
    const newCar = await sql`
      INSERT INTO cars (
        brand, model, year, price, mileage, fuel, transmission,
        doors, seats, color, description, status
      ) VALUES (
        ${body.brand || "TEST"}, 
        ${body.model || "API Test"}, 
        ${body.year || 2024}, 
        ${body.price || 1000}, 
        ${body.mileage || 0}, 
        ${body.fuel || "Benzine"}, 
        ${body.transmission || "Handgeschakeld"},
        ${body.doors || 5}, 
        ${body.seats || 5}, 
        ${body.color || "Blauw"}, 
        ${body.description || "Test car created via API"}, 
        'available'
      ) RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: "Test car created successfully",
      car: newCar[0],
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
