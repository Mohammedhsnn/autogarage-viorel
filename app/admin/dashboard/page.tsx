"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Plus, Settings, Users, BarChart3, LogOut, Edit, Trash2, Database, AlertTriangle, Wrench, Package, Calendar, Eye } from "lucide-react"
import Link from "next/link"
import { getStats, getCars, deleteCar } from "@/app/actions"

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cars, setCars] = useState<any[]>([])
  const [stats, setStats] = useState({
    total_cars: 0,
    available_cars: 0,
    sold_cars: 0,
    total_inventory_value: 0,
  })
  const [visitorsToday, setVisitorsToday] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin-logged-in")
    if (!loggedIn) {
      router.push("/admin")
    } else {
      setIsLoggedIn(true)
      loadData()
    }
  }, [router])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Loading dashboard data...")

      // Load stats
      const statsData = await getStats()
      console.log("Stats loaded:", statsData)
      setStats(statsData)

      // Load all cars
      const carsData = await getCars({ status: "all" })
      console.log("Cars loaded:", carsData)
      setCars(carsData)

      // Load analytics (bezoekers vandaag)
      try {
        const analyticsRes = await fetch("/api/analytics", { credentials: "include" })
        const analyticsData = await analyticsRes.json()
        if (analyticsData.success && analyticsData.stats) {
          setVisitorsToday(analyticsData.stats.today)
        }
      } catch {
        setVisitorsToday(null)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin-logged-in")
    router.push("/admin")
  }

  const handleDeleteCar = async (id: number) => {
    if (confirm("Weet u zeker dat u deze auto wilt verwijderen?")) {
      try {
        await deleteCar(id)
        await loadData() // Reload data
      } catch (error) {
        console.error("Error deleting car:", error)
        alert("Fout bij verwijderen van auto")
      }
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">Autogarage Viorel</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/occasions">
                <Button variant="outline">Website bekijken</Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" className="text-red-600 border-red-200 bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Uitloggen
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Dashboard gegevens laden...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800 mb-2">Fout bij laden</h3>
                  <p className="text-yellow-700 mb-4">{error}</p>
                  <Button onClick={loadData} variant="outline" className="bg-transparent">
                    Opnieuw proberen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Content */}
        {!loading && !error && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Beschikbare Auto's</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.available_cars}</p>
                    </div>
                    <Car className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Verkochte Auto's</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.sold_cars}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Totale Voorraadwaarde</p>
                      <p className="text-2xl font-bold text-gray-900">
                        €{stats.total_inventory_value.toLocaleString()}
                      </p>
                    </div>
                    <Settings className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Totaal Auto's</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total_cars}</p>
                    </div>
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Link href="/admin/analytics">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Bezoekers vandaag</p>
                        <p className="text-2xl font-bold text-gray-900">{visitorsToday ?? "–"}</p>
                      </div>
                      <Eye className="w-8 h-8 text-sky-600" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Snelle Acties</h2>
              <div className="flex flex-wrap gap-4">
                <Link href="/admin/cars/new">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nieuwe Auto Toevoegen
                  </Button>
                </Link>
                <Link href="/admin/cars">
                  <Button variant="outline">
                    <Car className="w-4 h-4 mr-2" />
                    Alle Auto's Beheren
                  </Button>
                </Link>
                <Link href="/admin/services">
                  <Button variant="outline">
                    <Wrench className="w-4 h-4 mr-2" />
                    Diensten Beheren
                  </Button>
                </Link>
                <Link href="/admin/onderdelen">
                  <Button variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Onderdelen Beheren
                  </Button>
                </Link>
                <Link href="/admin/appointments">
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Afspraken Beheren
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
                <Button onClick={loadData} variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Vernieuwen
                </Button>
              </div>
            </div>

            {/* Recent Cars */}
            <Card>
              <CardHeader>
                <CardTitle>Recente Auto's</CardTitle>
              </CardHeader>
              <CardContent>
                {cars.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Geen auto's gevonden</h3>
                    <p className="text-gray-600 mb-4">Voeg uw eerste auto toe om te beginnen.</p>
                    <Link href="/admin/cars/new">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Eerste Auto Toevoegen
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Auto</th>
                          <th className="text-left py-3 px-4">Prijs</th>
                          <th className="text-left py-3 px-4">KM Stand</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Acties</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cars.slice(0, 5).map((car) => (
                          <tr key={car.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={car.images?.[0]?.image_url || "/placeholder.svg"}
                                  alt={`${car.brand} ${car.model}`}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <div className="font-medium">
                                    {car.brand} {car.model}
                                  </div>
                                  <div className="text-sm text-gray-500">{car.year}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium">€{car.price?.toLocaleString()}</td>
                            <td className="py-3 px-4">{car.mileage?.toLocaleString()} km</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  car.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {car.status === "available" ? "Beschikbaar" : "Verkocht"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Link href={`/admin/cars/${car.id}/edit`}>
                                  <Button size="sm" variant="outline">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteCar(car.id)}>
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
