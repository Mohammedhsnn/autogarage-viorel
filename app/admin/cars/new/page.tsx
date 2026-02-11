"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload, X, Car, ImagePlus, Info } from "lucide-react"
import Link from "next/link"

const features = [
  "Airconditioning",
  "Navigatiesysteem",
  "Bluetooth",
  "Cruise control",
  "Elektrische ramen",
  "Centrale vergrendeling",
  "Hybride motor",
  "Automatische transmissie",
  "Parkeersensoren",
  "LED verlichting",
  "Leder interieur",
  "Xenon koplampen",
  "Sportonderstel",
  "Verwarmde stoelen",
  "Keyless entry",
  "SYNC infotainment",
  "Adaptieve cruise control",
  "Lane keeping assist",
  "Automatische noodrem",
  "Klimaatregeling",
  "Sportvelgen",
  "IntelliLink infotainment",
  "Boordcomputer",
  "Radio/CD",
  "Parkeerhulp",
  "USB aansluiting",
]

export default function NewCarPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [uploadingImages, setUploadingImages] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel: "Benzine",
    transmission: "Handgeschakeld",
    doors: "5",
    seats: "5",
    color: "",
    description: "",
    apk: "",
    owners: "1",
    features: [] as string[],
  })

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin-logged-in")
    if (!loggedIn) {
      router.push("/admin")
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: checked ? [...prev.features, feature] : prev.features.filter((f) => f !== feature),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadingImages(true)
    try {
      const formDataUpload = new FormData()
      Array.from(files).forEach((file) => formDataUpload.append("files", file))
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: "Upload mislukt", description: data.error || "Probeer het opnieuw.", variant: "destructive" })
        return
      }
      if (data.urls && data.urls.length > 0) {
        setImages((prev) => [...prev, ...data.urls])
        toast({ title: "Foto's toegevoegd", description: `${data.urls.length} foto${data.urls.length !== 1 ? "'s" : ""} geüpload.` })
      }
    } catch {
      toast({ title: "Upload mislukt", description: "Controleer je verbinding en probeer het opnieuw.", variant: "destructive" })
    } finally {
      setUploadingImages(false)
      e.target.value = ""
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addImageByUrl = () => {
    const url = imageUrlInput.trim()
    if (!url) return
    if (!url.startsWith("http")) {
      toast({ title: "Ongeldige link", description: "Voer een volledige URL in (bijv. https://...)", variant: "destructive" })
      return
    }
    setImages((prev) => [...prev, url])
    setImageUrlInput("")
    toast({ title: "Foto toegevoegd", description: "De afbeelding staat in de lijst." })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (images.length === 0) {
      toast({ title: "Minimaal één foto", description: "Voeg ten minste één afbeelding toe (upload of link).", variant: "destructive" })
      return
    }
    setIsLoading(true)

    try {
      const carData = {
        brand: formData.brand,
        model: formData.model,
        year: Number.parseInt(formData.year),
        price: Number.parseInt(formData.price),
        mileage: Number.parseInt(formData.mileage),
        fuel: formData.fuel,
        transmission: formData.transmission,
        doors: Number.parseInt(formData.doors),
        seats: Number.parseInt(formData.seats),
        color: formData.color,
        description: formData.description || null,
        apk_date: formData.apk || null,
        owners: Number.parseInt(formData.owners),
        images,
        features: formData.features,
      }

      const response = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carData),
      })

      if (response.ok) {
        toast({ title: "Auto toegevoegd", description: `${formData.brand} ${formData.model} staat nu op de occasions-pagina.` })
        router.push("/admin/dashboard")
      } else {
        const errorData = await response.json()
        toast({ title: "Fout bij toevoegen", description: errorData.error || "Onbekende fout", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Netwerkfout", description: error instanceof Error ? error.message : "Controleer je verbinding.", variant: "destructive" })
    } finally {
      setIsLoading(false)
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
                <h1 className="text-xl font-bold text-gray-900">Nieuwe Auto Toevoegen</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start gap-3 p-4 mb-8 rounded-lg bg-blue-50 border border-blue-100">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Vul de gegevens in. De auto verschijnt direct op de pagina <strong>Occasions</strong>. Minimaal één foto is verplicht (upload of link).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basisgegevens</CardTitle>
              <CardDescription>Merk, model, bouwjaar, prijs en kilometerstand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Merk *</Label>
                  <Input id="brand" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Bijv. Volkswagen" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input id="model" name="model" value={formData.model} onChange={handleInputChange} placeholder="Bijv. Golf" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Bouwjaar *</Label>
                  <Input id="year" name="year" type="number" value={formData.year} onChange={handleInputChange} placeholder="2020" min="1990" max={new Date().getFullYear() + 1} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Prijs (€) *</Label>
                  <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="18500" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Kilometerstand *</Label>
                  <Input id="mileage" name="mileage" type="number" value={formData.mileage} onChange={handleInputChange} placeholder="45000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Kleur *</Label>
                  <Input id="color" name="color" value={formData.color} onChange={handleInputChange} placeholder="Bijv. Zwart" required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Technische gegevens</CardTitle>
              <CardDescription>Brandstof, transmissie, deuren, zitplaatsen, APK</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brandstof</label>
                  <select
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="Benzine">Benzine</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Elektrisch">Elektrisch</option>
                    <option value="LPG">LPG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmissie</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="Handgeschakeld">Handgeschakeld</option>
                    <option value="Automaat">Automaat</option>
                    <option value="Semi-automaat">Semi-automaat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aantal deuren</label>
                  <select
                    name="doors"
                    value={formData.doors}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aantal zitplaatsen</label>
                  <select
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">APK geldig tot</label>
                  <Input name="apk" type="date" value={formData.apk} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aantal eigenaren</label>
                  <select
                    name="owners"
                    value={formData.owners}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Foto's *</CardTitle>
              <CardDescription>Minimaal één foto. U kunt bestanden uploaden of een link naar een afbeelding plakken.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <Label htmlFor="image-url" className="text-sm text-gray-600">Afbeelding toevoegen via link</Label>
                    <Input
                      id="image-url"
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://voorbeeld.nl/foto.jpg"
                      className="mt-1"
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={addImageByUrl} className="sm:mt-6 shrink-0">
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Link toevoegen
                  </Button>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Of upload vanaf uw apparaat (galerij of map)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-1">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Klik om foto's uit je galerij of map te kiezen (JPEG, PNG, WebP of GIF, max 10 MB)</p>
                    <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} className="hidden" id="image-upload" disabled={uploadingImages} />
                    <label htmlFor="image-upload" className={uploadingImages ? "pointer-events-none opacity-70" : "cursor-pointer"}>
                      <Button type="button" variant="outline" className="cursor-pointer bg-transparent" disabled={uploadingImages}>
                        {uploadingImages ? "Bezig met uploaden..." : "Foto's selecteren"}
                      </Button>
                    </label>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {images.length > 0 && <p className="text-sm text-gray-500">{images.length} foto{images.length !== 1 ? "'s" : ""} toegevoegd. Eerste foto = hoofdfoto.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Uitrusting</CardTitle>
              <CardDescription>Vink de opties aan die bij deze auto horen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                    />
                    <label htmlFor={feature} className="text-sm text-gray-700">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Beschrijving</CardTitle>
              <CardDescription>Optioneel. Korte omschrijving voor op de occasions-pagina</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Bijv. Netjes onderhouden, één eigenaar, recent APK..." rows={4} />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Bezig met opslaan..." : "Auto op Occasions zetten"}
            </Button>
            <Link href="/admin/dashboard">
              <Button type="button" variant="outline">
                Annuleren
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
