"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2, X } from "lucide-react"
import Link from "next/link"
import { getCarById, updateCar } from "@/app/actions"

const fuelTypes = ["Benzine", "Diesel", "Hybrid", "Elektrisch", "LPG"]
const transmissionTypes = ["Handgeschakeld", "Automaat"]
const statusTypes = [
  { value: "available", label: "Beschikbaar" },
  { value: "sold", label: "Verkocht" },
]

const availableFeatures = [
  "Airconditioning",
  "Navigatiesysteem",
  "Bluetooth",
  "Cruise control",
  "Elektrische ramen",
  "Centrale vergrendeling",
  "Parkeersensoren",
  "LED verlichting",
  "Leder interieur",
  "Verwarmde stoelen",
  "Sportonderstel",
  "Keyless entry",
  "Panoramadak",
  "Trekhaak",
  "Stoelverwarming",
]

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const carId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [car, setCar] = useState<any>(null)

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuel: "Benzine",
    transmission: "Handgeschakeld",
    doors: 5,
    seats: 5,
    color: "",
    description: "",
    apk_date: "",
    owners: 1,
    status: "available",
  })

  const [images, setImages] = useState<string[]>([])
  const [newImage, setNewImage] = useState("")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  useEffect(() => {
    loadCar()
  }, [carId])

  const loadCar = async () => {
    try {
      setLoading(true)
      const carData = await getCarById(Number(carId))

      if (!carData) {
        alert("Auto niet gevonden")
        router.push("/admin/cars")
        return
      }

      setCar(carData)
      setFormData({
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        price: carData.price,
        mileage: carData.mileage,
        fuel: carData.fuel,
        transmission: carData.transmission,
        doors: carData.doors,
        seats: carData.seats,
        color: carData.color,
        description: carData.description || "",
        apk_date: carData.apk_date || "",
        owners: carData.owners || 1,
        status: carData.status || "available",
      })

      setImages(carData.images?.map((img: any) => img.image_url) || [])
      setSelectedFeatures(carData.features || [])
    } catch (error) {
      console.error("Error loading car:", error)
      alert("Fout bij laden van auto")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateCar(Number(carId), {
        ...formData,
        images,
        features: selectedFeatures,
      })

      alert("Auto succesvol bijgewerkt!")
      router.push("/admin/cars")
    } catch (error) {
      console.error("Error updating car:", error)
      alert("Fout bij opslaan van auto")
    } finally {
      setSaving(false)
    }
  }

  const addImage = () => {
    if (newImage && !images.includes(newImage)) {
      setImages([...images, newImage])
      setNewImage("")
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Auto laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/cars">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Auto Bewerken</h1>
              <p className="text-sm text-gray-600">
                {car?.brand} {car?.model}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basis Informatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Merk *</Label>
                  <Input
                    id="brand"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Bouwjaar *</Label>
                  <Input
                    id="year"
                    type="number"
                    required
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Prijs (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mileage">Kilometerstand *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    required
                    min="0"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="color">Kleur *</Label>
                  <Input
                    id="color"
                    required
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fuel">Brandstof *</Label>
                  <select
                    id="fuel"
                    required
                    value={formData.fuel}
                    onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {fuelTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="transmission">Transmissie *</Label>
                  <select
                    id="transmission"
                    required
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {transmissionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="doors">Deuren *</Label>
                  <Input
                    id="doors"
                    type="number"
                    required
                    min="2"
                    max="5"
                    value={formData.doors}
                    onChange={(e) => setFormData({ ...formData, doors: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="seats">Zitplaatsen *</Label>
                  <Input
                    id="seats"
                    type="number"
                    required
                    min="2"
                    max="9"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="owners">Eigenaren *</Label>
                  <Input
                    id="owners"
                    type="number"
                    required
                    min="1"
                    value={formData.owners}
                    onChange={(e) => setFormData({ ...formData, owners: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="apk_date">APK Verloopdatum</Label>
                  <Input
                    id="apk_date"
                    type="date"
                    value={formData.apk_date}
                    onChange={(e) => setFormData({ ...formData, apk_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {statusTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Foto's</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Foto URL"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={addImage}>
                  Toevoegen
                </Button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Auto foto ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Hoofdfoto
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Uitrusting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableFeatures.map((feature) => (
                  <label key={feature} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="rounded"
                    />
                    <span className="text-sm">{feature}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Opslaan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Wijzigingen Opslaan
                </>
              )}
            </Button>
            <Link href="/admin/cars">
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
