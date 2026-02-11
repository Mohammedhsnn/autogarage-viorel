"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Database, Car, Eye } from "lucide-react"
import Link from "next/link"

export default function DebugCarsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchDebugData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/cars/debug")
      const result = await response.json()
      console.log("Debug data:", result)
      setData(result)
    } catch (error) {
      console.error("Error fetching debug data:", error)
      setData({ success: false, error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Database className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cars Debug Panel</h1>
          <p className="text-gray-600">Check what cars are actually in the database</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button onClick={fetchDebugData} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </>
            )}
          </Button>
          <Link href="/occasions">
            <Button variant="outline" className="bg-transparent">
              <Eye className="w-4 h-4 mr-2" />
              View Occasions Page
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" className="bg-transparent">
              <Car className="w-4 h-4 mr-2" />
              Admin Panel
            </Button>
          </Link>
        </div>

        {data && (
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className={data.success ? "text-green-600" : "text-red-600"}>
                  {data.success ? "✅ Database Connection OK" : "❌ Database Error"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.success ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{data.counts?.total || 0}</div>
                      <div className="text-sm text-gray-600">Total Cars</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{data.counts?.available || 0}</div>
                      <div className="text-sm text-gray-600">Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{data.counts?.sold || 0}</div>
                      <div className="text-sm text-gray-600">Sold</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{data.total_found || 0}</div>
                      <div className="text-sm text-gray-600">Found in Query</div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
                    <p className="text-red-700">{data.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cars List */}
            {data.success && data.cars && (
              <Card>
                <CardHeader>
                  <CardTitle>Cars in Database ({data.cars.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.cars.length === 0 ? (
                    <div className="text-center py-8">
                      <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Cars Found</h3>
                      <p className="text-gray-600 mb-4">The database is empty. Try adding some cars first.</p>
                      <Link href="/admin/cars/new">
                        <Button className="bg-blue-600 hover:bg-blue-700">Add First Car</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">ID</th>
                            <th className="text-left py-3 px-4">Car</th>
                            <th className="text-left py-3 px-4">Price</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Images</th>
                            <th className="text-left py-3 px-4">Features</th>
                            <th className="text-left py-3 px-4">Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.cars.map((car: any) => (
                            <tr key={car.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-mono text-sm">{car.id}</td>
                              <td className="py-3 px-4">
                                <div className="font-medium">
                                  {car.brand} {car.model}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {car.year} • {car.color}
                                </div>
                              </td>
                              <td className="py-3 px-4 font-medium">€{car.price?.toLocaleString()}</td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    car.status === "available"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {car.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {Array.isArray(car.images) ? car.images.length : 0} images
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {Array.isArray(car.features) ? car.features.length : 0} features
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-500">
                                {new Date(car.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Debug Info */}
            <Card>
              <CardHeader>
                <CardTitle>Debug Information</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(data.debug_info, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
