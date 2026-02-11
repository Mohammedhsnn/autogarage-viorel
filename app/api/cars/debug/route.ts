import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("🔍 Debug API called")

    // Test basic connection first
    const connectionTest = await sql`SELECT NOW() as current_time`
    console.log("✅ Database connection OK:", connectionTest[0].current_time)

    // Get simple car count
    const countResult = await sql`SELECT COUNT(*) as total FROM cars`
    const totalCars = Number(countResult[0].total)
    console.log("📊 Total cars in database:", totalCars)

    // Get cars with a simpler query first
    const simpleCars = await sql`
      SELECT id, brand, model, year, price, status 
      FROM cars 
      ORDER BY created_at DESC 
      LIMIT 10
    `
    console.log("🚗 Simple cars query result:", {
      type: typeof simpleCars,
      isArray: Array.isArray(simpleCars),
      length: simpleCars.length,
      sample: simpleCars[0],
    })

    // Now try the complex query
    let complexCars: any[] = []
    try {
      complexCars = await sql`
        SELECT 
          c.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', ci.id,
                'image_url', ci.image_url,
                'is_primary', ci.is_primary,
                'sort_order', ci.sort_order
              ) ORDER BY ci.sort_order, ci.id
            ) FILTER (WHERE ci.id IS NOT NULL), 
            '[]'::json
          ) as images,
          COALESCE(
            json_agg(DISTINCT cf.feature) FILTER (WHERE cf.feature IS NOT NULL), 
            '[]'::json
          ) as features
        FROM cars c
        LEFT JOIN car_images ci ON c.id = ci.car_id
        LEFT JOIN car_features cf ON c.id = cf.car_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
        LIMIT 5
      `
      console.log("🔧 Complex cars query result:", {
        type: typeof complexCars,
        isArray: Array.isArray(complexCars),
        length: complexCars.length,
      })
    } catch (complexError) {
      console.error("❌ Complex query failed:", complexError)
      complexCars = []
    }

    // Get counts by status
    const statusCounts = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM cars 
      GROUP BY status
    `

    return NextResponse.json({
      success: true,
      connection: {
        timestamp: connectionTest[0].current_time,
        status: "OK",
      },
      counts: {
        total: totalCars,
        by_status: statusCounts.reduce((acc: any, row: any) => {
          acc[row.status] = Number(row.count)
          return acc
        }, {}),
      },
      simple_cars: {
        count: simpleCars.length,
        cars: simpleCars,
      },
      complex_cars: {
        count: complexCars.length,
        cars: complexCars.slice(0, 2), // Just first 2 for debugging
      },
      debug_info: {
        database_url_exists: !!process.env.DATABASE_URL,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("❌ Debug API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        debug_info: {
          database_url_exists: !!process.env.DATABASE_URL,
          timestamp: new Date().toISOString(),
          error_type: typeof error,
          error_name: error instanceof Error ? error.name : "Unknown",
        },
      },
      { status: 500 },
    )
  }
}
