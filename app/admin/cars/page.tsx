"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Search, Edit, Trash2, Car, Loader2, Facebook, Copy, Link2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getOccasionPublicUrl } from "@/lib/site-url"

function buildFacebookPostText(car: {
  id: number
  brand: string
  model: string
  year: number
  price?: number
  mileage?: number
  fuel?: string
  transmission?: string
  color?: string
  doors?: number
}): string {
  const url = getOccasionPublicUrl(car.id)
  const price =
    car.price != null && !Number.isNaN(Number(car.price))
      ? `€ ${Number(car.price).toLocaleString("nl-NL")},-`
      : "Prijs op aanvraag"
  const km =
    car.mileage != null && !Number.isNaN(Number(car.mileage))
      ? `${Number(car.mileage).toLocaleString("nl-NL")} km`
      : null

  const lines: string[] = [
    `🚗 ${car.brand} ${car.model} (${car.year})`,
    "",
    `💰 ${price}`,
  ]
  if (km) lines.push(`📏 ${km}`)
  const specBits = [car.fuel, car.transmission, car.color, car.doors != null ? `${car.doors} deuren` : null].filter(Boolean)
  if (specBits.length) lines.push(specBits.join(" • "))
  lines.push(
    "",
    "Bekijk deze occasion op onze website:",
    url,
    "",
    "— Autogarage Viorel",
    "Terneuzen",
  )

  return lines.join("\n")
}

export default function CarsManagementPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cars, setCars] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [facebookShareCar, setFacebookShareCar] = useState<(typeof cars)[0] | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin-logged-in")
    if (!loggedIn) {
      router.push("/admin")
    } else {
      setIsLoggedIn(true)
      loadCars()
    }
  }, [router])

  const loadCars = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cars?status=all")
      if (response.ok) {
        const data = await response.json()
        setCars(data.cars || [])
      }
    } catch (error) {
      console.error("Error loading cars:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyFacebookFullText = async () => {
    if (!facebookShareCar) return
    const text = buildFacebookPostText(facebookShareCar)
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Tekst gekopieerd",
        description: "Open Facebook hieronder, maak een post en plak met Ctrl+V (of lang indrukken op je telefoon).",
      })
    } catch {
      toast({
        title: "Kopiëren mislukt",
        description: "Selecteer de tekst in het vak en kopieer handmatig (Ctrl+C).",
        variant: "destructive",
      })
    }
  }

  const copyOccasionLinkOnly = async () => {
    if (!facebookShareCar) return
    const shareUrl = getOccasionPublicUrl(facebookShareCar.id)
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({ title: "Link gekopieerd", description: shareUrl })
    } catch {
      toast({ title: "Kopiëren mislukt", variant: "destructive" })
    }
  }

  const openFacebookNewPost = () => {
    window.open("https://www.facebook.com/", "_blank", "noopener,noreferrer")
  }

  const openFacebookShareWithPreview = () => {
    if (!facebookShareCar) return
    const shareUrl = getOccasionPublicUrl(facebookShareCar.id)
    const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(fb, "_blank", "noopener,noreferrer")
  }

  const deleteCar = async (id: number) => {
    if (!confirm("Weet u zeker dat u deze auto wilt verwijderen?")) return

    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCars(cars.filter((car) => car.id !== id))
        alert("Auto succesvol verwijderd!")
      } else {
        alert("Fout bij verwijderen van auto")
      }
    } catch (error) {
      console.error("Error deleting car:", error)
      alert("Netwerkfout bij verwijderen")
    }
  }

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.color?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || car.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
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
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Terug
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Auto's Beheren</h1>
              </div>
            </div>
            <Link href="/admin/cars/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nieuwe Auto
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Zoek op merk, model of kleur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">Alle statussen</option>
                  <option value="available">Beschikbaar</option>
                  <option value="sold">Verkocht</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Auto's laden...</p>
          </div>
        )}

        {/* Cars Grid */}
        {!isLoading && filteredCars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <Card key={car.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={car.images?.[0]?.image_url || "/placeholder.svg?height=300&width=400"}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          car.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {car.status === "available" ? "Beschikbaar" : "Verkocht"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {car.year} • {car.color}
                    </p>
                    <div className="text-xl font-bold text-blue-600 mb-4">€{car.price?.toLocaleString()}</div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                      <div>{car.mileage?.toLocaleString()} km</div>
                      <div>{car.fuel}</div>
                      <div>{car.transmission}</div>
                      <div>{car.doors} deuren</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/cars/${car.id}/edit`} className="min-w-0 flex-1">
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          <Edit className="w-4 h-4 mr-2" />
                          Bewerken
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        onClick={() => setFacebookShareCar(car)}
                        title="Tekst kopiëren en uitleg voor Facebook"
                      >
                        <Facebook className="w-4 h-4 mr-2 shrink-0" />
                        Facebook
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteCar(car.id)}
                        className="text-red-600 hover:bg-red-50"
                        aria-label="Verwijderen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredCars.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Geen auto's gevonden</h3>
            <p className="text-gray-600 mb-4">Probeer uw zoekopdracht aan te passen of voeg een nieuwe auto toe.</p>
            <Link href="/admin/cars/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Eerste Auto Toevoegen
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Dialog open={!!facebookShareCar} onOpenChange={(open) => !open && setFacebookShareCar(null)}>
        <DialogContent className="max-h-[min(90vh,800px)] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Deel op Facebook</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-left text-sm text-muted-foreground">
                <p>
                  Facebook laat geen kant-en-klare tekst of foto’s automatisch in het venster zetten (beleid). Wel kunt u
                  hieronder de tekst <strong className="text-foreground">kopiëren en plakken</strong>, en de link deelt een{" "}
                  <strong className="text-foreground">automatische voorbeeldfoto</strong> van de occasion-pagina.
                </p>
                <p className="text-xs">
                  Staat het voorbeeld nog niet goed? Eenmalig{" "}
                  <a
                    href={
                      facebookShareCar
                        ? `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(getOccasionPublicUrl(facebookShareCar.id))}`
                        : "https://developers.facebook.com/tools/debug/"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Facebook opnieuw laten scrapen
                  </a>{" "}
                  (Sharing Debugger).
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          {facebookShareCar && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tekst voor uw post (plakken in Facebook)</label>
                <textarea
                  readOnly
                  rows={16}
                  className="w-full resize-y rounded-md border border-input bg-muted/30 px-3 py-2 text-sm leading-relaxed"
                  value={buildFacebookPostText(facebookShareCar)}
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <DialogFooter className="flex-col gap-2 sm:flex-col">
                <div className="flex flex-wrap gap-2">
                  <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={copyFacebookFullText}>
                    <Copy className="mr-2 h-4 w-4" />
                    Kopieer hele tekst
                  </Button>
                  <Button type="button" variant="outline" onClick={copyOccasionLinkOnly}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Kopieer alleen link
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" onClick={openFacebookNewPost}>
                    Open Facebook (plak daar de tekst)
                  </Button>
                  <Button type="button" variant="outline" className="border-blue-200 text-blue-800" onClick={openFacebookShareWithPreview}>
                    <Facebook className="mr-2 h-4 w-4" />
                    Deel link met fotovoorbeeld
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
