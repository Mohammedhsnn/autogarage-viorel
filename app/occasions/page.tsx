"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import {
  Phone,
  Calendar,
  Fuel,
  Gauge,
  Cog,
  CheckCircle,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"

interface CarImage {
  id: number
  car_id: number
  image_url: string
  is_primary: boolean
  sort_order: number
}

interface Car {
  id: number
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel: string
  transmission: string
  doors: number
  seats: number
  color: string
  description: string | null
  apk_date: string | null
  owners: number
  status: string
  created_at: string
  updated_at: string
  images?: CarImage[]
  features?: string[]
}

export default function OccasionsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterBrand, setFilterBrand] = useState<string>("all")
  const [filterFuel, setFilterFuel] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("created_at")

  useEffect(() => {
    fetchCars()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [cars, filterBrand, filterFuel, sortBy])

  const fetchCars = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/cars?status=available")
      const data = await response.json()

      if (data.success && Array.isArray(data.cars)) {
        setCars(data.cars)
      } else {
        throw new Error(data.error || "Failed to load cars")
      }
    } catch (err) {
      console.error("Error fetching cars:", err)
      setError(err instanceof Error ? err.message : "Failed to load cars")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...cars]

    if (filterBrand !== "all") {
      result = result.filter((car) => car.brand === filterBrand)
    }

    if (filterFuel !== "all") {
      result = result.filter((car) => car.fuel === filterFuel)
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "year-desc") {
      result.sort((a, b) => b.year - a.year)
    } else if (sortBy === "mileage-asc") {
      result.sort((a, b) => a.mileage - b.mileage)
    }

    setFilteredCars(result)
  }

  const brands = Array.from(new Set(cars.map((car) => car.brand))).sort()
  const fuels = Array.from(new Set(cars.map((car) => car.fuel))).sort()

  const resetFilters = () => {
    setFilterBrand("all")
    setFilterFuel("all")
    setSortBy("created_at")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/occasions" />

      {/* Hero Section */}
      <section className="relative pt-36 pb-16 lg:pt-40 lg:pb-20 bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80"
            alt="Occasions"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Alle auto's met garantie</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-balance">Ons aanbod</h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl">
              Ontdek ons uitgebreide aanbod van kwaliteit occasions. Alle auto's zijn 
              grondig gecontroleerd en komen met garantie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+31188809802">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                  <Phone className="w-5 h-5 mr-2" />
                  Bel voor advies
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 bg-transparent w-full sm:w-auto"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Proefrit plannen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-4 lg:py-6 bg-white border-b sticky top-[80px] lg:top-[120px] z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-stretch sm:items-center">
              <div className="grid grid-cols-2 sm:flex gap-3 lg:gap-4">
                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger className="w-full sm:w-40 lg:w-44 bg-white">
                    <SelectValue placeholder="Alle merken" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle merken</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterFuel} onValueChange={setFilterFuel}>
                  <SelectTrigger className="w-full sm:w-40 lg:w-44 bg-white">
                    <SelectValue placeholder="Alle brandstoffen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle brandstoffen</SelectItem>
                    {fuels.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="flex-1 sm:w-48 lg:w-52 bg-white">
                    <SelectValue placeholder="Sorteren" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Nieuwste eerst</SelectItem>
                    <SelectItem value="price-asc">Prijs (laag-hoog)</SelectItem>
                    <SelectItem value="price-desc">Prijs (hoog-laag)</SelectItem>
                    <SelectItem value="year-desc">Bouwjaar (nieuw-oud)</SelectItem>
                    <SelectItem value="mileage-asc">Kilometerstand (laag-hoog)</SelectItem>
                  </SelectContent>
                </Select>

                {(filterBrand !== "all" || filterFuel !== "all") && (
                  <Button variant="ghost" onClick={resetFilters} className="text-gray-600 whitespace-nowrap">
                    Filters wissen
                  </Button>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600 font-medium text-center lg:text-right">
              {filteredCars.length} auto{filteredCars.length !== 1 ? "'s" : ""} gevonden
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
              <span className="text-gray-600 text-lg">Occasions laden...</span>
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-red-900 mb-2">Er is een fout opgetreden</h3>
                    <p className="text-red-700 mb-4">{error}</p>
                    <Button onClick={fetchCars} className="bg-blue-600 hover:bg-blue-700">
                      Opnieuw proberen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Cars Grid */}
      {!loading && !error && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {filteredCars.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {cars.length === 0 ? "Nog geen occasions beschikbaar" : "Geen auto's gevonden"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {cars.length === 0
                    ? "Ons actuele aanbod wordt hier getoond. Neem gerust contact op voor informatie."
                    : "Er zijn geen auto's die voldoen aan uw zoekcriteria. Pas uw filters aan of neem contact met ons op."}
                </p>
                <div className="flex gap-4 justify-center">
                  {cars.length > 0 && (
                    <Button onClick={resetFilters} variant="outline" className="bg-transparent">
                      Filters wissen
                    </Button>
                  )}
                  <a href="tel:+31188809802">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {filteredCars.map((car) => (
                  <Link key={car.id} href={`/occasions/${car.id}`}>
                    <Card className="group h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white cursor-pointer">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={
                            car.images && car.images.length > 0
                              ? car.images[0].image_url
                              : "/placeholder.svg?height=300&width=400&text=Geen+afbeelding"
                          }
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {car.images && car.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            +{car.images.length - 1} foto&apos;s
                          </div>
                        )}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="inline-flex items-center gap-1 bg-white/90 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full">
                            Bekijken
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-5">
                        <div className="mb-3">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {car.brand} {car.model}
                          </h3>
                        </div>

                        <div className="text-2xl font-bold text-blue-600 mb-4">
                          € {car.price?.toLocaleString("nl-NL")},-
                        </div>

                        <div className="border-t pt-4">
                          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{car.year}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Gauge className="w-4 h-4 text-gray-400" />
                              <span>{car.mileage?.toLocaleString("nl-NL")} km</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Fuel className="w-4 h-4 text-gray-400" />
                              <span>{car.fuel}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Cog className="w-4 h-4 text-gray-400" />
                              <span>{car.transmission}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
      <FloatingActions />
    </div>
  )
}
