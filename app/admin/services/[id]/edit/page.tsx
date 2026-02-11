"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Settings, CheckCircle2, AlertCircle, Loader2, Plus, X } from "lucide-react"
import Link from "next/link"

const ICON_OPTIONS = [
  { value: "Wrench", label: "Sleutel (Onderhoud)" },
  { value: "Shield", label: "Schild (APK)" },
  { value: "Car", label: "Auto (Occasions)" },
  { value: "Battery", label: "Batterij (Accu)" },
  { value: "Wind", label: "Wind (Airco)" },
  { value: "Gauge", label: "Meter (Diagnose)" },
  { value: "Cog", label: "Tandwiel (Distributie)" },
  { value: "Settings", label: "Instellingen (Algemeen)" },
]

const COLOR_OPTIONS = [
  { value: "blue", label: "Blauw" },
  { value: "green", label: "Groen" },
  { value: "orange", label: "Oranje" },
  { value: "red", label: "Rood" },
  { value: "purple", label: "Paars" },
  { value: "gray", label: "Grijs" },
]

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string
  const { toast } = useToast()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "main",
    price: "",
    price_label: "",
    icon_name: "Settings",
    icon_color: "blue",
    badge_text: "",
    badge_color: "blue",
    button_text: "Meer informatie",
    button_color: "blue",
    is_pricing_card: false,
    sort_order: "0",
    is_active: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin-logged-in")
    if (!loggedIn) {
      router.push("/admin")
    } else {
      setIsLoggedIn(true)
      loadService()
    }
  }, [router, serviceId])

  const loadService = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/services/${serviceId}`)
      if (response.ok) {
        const data = await response.json()
        const service = data.service

        setFormData({
          name: service.name || "",
          description: service.description || "",
          category: service.category || "main",
          price: service.price ? service.price.toString() : "",
          price_label: service.price_label || "",
          icon_name: service.icon_name || "Settings",
          icon_color: service.icon_color || "blue",
          badge_text: service.badge_text || "",
          badge_color: service.badge_color || "blue",
          button_text: service.button_text || "Meer informatie",
          button_color: service.button_color || "blue",
          is_pricing_card: service.is_pricing_card || false,
          sort_order: service.sort_order?.toString() || "0",
          is_active: service.is_active !== undefined ? service.is_active : true,
        })

        setFeatures(service.features || [])
      } else {
        toast({
          title: "Fout",
          description: "Kon dienst niet laden",
          variant: "destructive",
        })
        router.push("/admin/services")
      }
    } catch (error) {
      console.error("Error loading service:", error)
      toast({
        title: "Fout",
        description: "Netwerkfout bij laden",
        variant: "destructive",
      })
      router.push("/admin/services")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures((prev) => [...prev, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Naam is verplicht"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validatiefout",
        description: "Controleer de ingevulde gegevens",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const serviceData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        price: formData.price ? Number.parseInt(formData.price) : null,
        price_label: formData.price_label.trim() || null,
        icon_name: formData.icon_name,
        icon_color: formData.icon_color,
        features: features,
        badge_text: formData.badge_text.trim() || null,
        badge_color: formData.badge_color,
        button_text: formData.button_text.trim(),
        button_color: formData.button_color,
        is_pricing_card: formData.is_pricing_card,
        sort_order: Number.parseInt(formData.sort_order) || 0,
        is_active: formData.is_active,
      }

      const response = await fetch(`/api/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      })

      if (response.ok) {
        toast({
          title: "Dienst succesvol bijgewerkt!",
          description: `${formData.name} is bijgewerkt`,
        })
        router.push("/admin/services")
      } else {
        const errorData = await response.json()
        toast({
          title: "Fout bij bijwerken",
          description: errorData.error || "Er is iets misgegaan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Netwerkfout",
        description: error instanceof Error ? error.message : "Controleer je internetverbinding",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isLoggedIn || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/services">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Terug
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Dienst Bewerken</h1>
                  <p className="text-sm text-gray-500">Wijzig de gegevens van de dienst</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basis Informatie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Basis Informatie
              </CardTitle>
              <CardDescription>Vul de belangrijkste gegevens van de dienst in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Naam van de dienst *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Bijv. APK Keuring"
                    className={errors.name ? "border-red-500" : ""}
                    required
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Beschrijving</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Beschrijf de dienst..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categorie</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Hoofddienst</SelectItem>
                      <SelectItem value="additional">Aanvullende Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">Volgorde</Label>
                  <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">Lager nummer = eerder getoond</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prijs Informatie */}
          <Card>
            <CardHeader>
              <CardTitle>Prijs & Tarieven</CardTitle>
              <CardDescription>Stel de prijs en weergave in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prijs (in centen)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="3900"
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Bijv. 3900 voor €39,00. Laat leeg voor "Op aanvraag"</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_label">Prijs Label</Label>
                  <Input
                    id="price_label"
                    name="price_label"
                    value={formData.price_label}
                    onChange={handleInputChange}
                    placeholder="Bijv. €39 of Vanaf €89"
                  />
                  <p className="text-xs text-gray-500">Dit wordt getoond op de website</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_pricing_card"
                  checked={formData.is_pricing_card}
                  onCheckedChange={(checked) => handleCheckboxChange("is_pricing_card", checked as boolean)}
                />
                <Label htmlFor="is_pricing_card" className="cursor-pointer">
                  Toon als prijzen card (in prijzen sectie)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Uiterlijk */}
          <Card>
            <CardHeader>
              <CardTitle>Uiterlijk & Styling</CardTitle>
              <CardDescription>Kies iconen en kleuren</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon_name">Icon</Label>
                  <Select value={formData.icon_name} onValueChange={(value) => handleSelectChange("icon_name", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon_color">Icon Kleur</Label>
                  <Select value={formData.icon_color} onValueChange={(value) => handleSelectChange("icon_color", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_OPTIONS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          {color.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="button_text">Button Tekst</Label>
                  <Input
                    id="button_text"
                    name="button_text"
                    value={formData.button_text}
                    onChange={handleInputChange}
                    placeholder="Meer informatie"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="button_color">Button Kleur</Label>
                  <Select value={formData.button_color} onValueChange={(value) => handleSelectChange("button_color", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_OPTIONS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          {color.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badge_text">Badge Tekst (optioneel)</Label>
                  <Input
                    id="badge_text"
                    name="badge_text"
                    value={formData.badge_text}
                    onChange={handleInputChange}
                    placeholder="Bijv. Populair of 2 jaar garantie"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badge_color">Badge Kleur</Label>
                  <Select value={formData.badge_color} onValueChange={(value) => handleSelectChange("badge_color", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_OPTIONS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          {color.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Inbegrepen Items / Features</CardTitle>
              <CardDescription>Voeg items toe die bij deze dienst zijn inbegrepen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Bijv. Grote onderhoudsbeurt"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature}>
                  <Plus className="w-4 h-4 mr-2" />
                  Toevoegen
                </Button>
              </div>

              {features.length > 0 && (
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleCheckboxChange("is_active", checked as boolean)}
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Dienst is actief (zichtbaar op website)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4 justify-end pt-4 border-t">
            <Link href="/admin/services">
              <Button type="button" variant="outline" disabled={isSaving}>
                Annuleren
              </Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[150px]" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Opslaan...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Wijzigingen Opslaan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
