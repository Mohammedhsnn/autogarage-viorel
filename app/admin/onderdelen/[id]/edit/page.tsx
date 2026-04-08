"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Package, Loader2, Upload, X } from "lucide-react"
import Link from "next/link"

const CATEGORIEEN = [
  "Banden", "Motor", "Versnellingsbak", "Remmen", "Ophanging", "Uitlaat",
  "Elektrisch", "Carrosserie", "Interieur", "Verlichting", "Overig",
]

export default function EditOnderdeelPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    barcode: "",
    description: "",
    voorraad: "",
    waarde: "",
    price: "",
    artikelnummer: "",
    category: "Overig",
    image_url: "",
    is_active: true,
    sort_order: "0",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin-logged-in")
    if (!loggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
    if (!id) return
    const fetchOne = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/onderdelen/${id}`, { credentials: "include" })
        const data = await res.json()
        if (res.ok && data.onderdeel) {
          const o = data.onderdeel
          setForm({
            barcode: o.barcode ?? "",
            description: o.description ?? "",
            voorraad: o.voorraad != null ? String(o.voorraad) : "",
            waarde: o.waarde != null ? String(o.waarde) : "",
            price: o.price != null ? String(o.price) : "",
            artikelnummer: o.artikelnummer ?? "",
            category: o.category?.trim() || "Overig",
            image_url: o.image_url ?? "",
            is_active: o.is_active !== false,
            sort_order: o.sort_order != null ? String(o.sort_order) : "0",
          })
        } else {
          toast({ title: "Niet gevonden", description: "Onderdeel bestaat niet.", variant: "destructive" })
          router.push("/admin/onderdelen")
        }
      } catch {
        toast({ title: "Fout", description: "Kon onderdeel niet laden.", variant: "destructive" })
        router.push("/admin/onderdelen")
      } finally {
        setLoading(false)
      }
    }
    fetchOne()
  }, [id, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.description.trim()) next.description = "Omschrijving is verplicht"
    if (!form.artikelnummer.trim()) next.artikelnummer = "Onderdeelnummer is verplicht"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const uploadFile = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|gif)$/i.test(f.name))
    if (list.length === 0) {
      toast({ title: "Geen afbeelding", description: "Selecteer een afbeelding (JPEG, PNG, WebP, GIF).", variant: "destructive" })
      return
    }
    setUploadingImage(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", list[0])
      const res = await fetch("/api/upload?folder=onderdelen", {
        method: "POST",
        body: formDataUpload,
        credentials: "include",
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = res.status === 401 ? "Sessie verlopen. Log opnieuw in." : (data.error || "Probeer het opnieuw.")
        toast({ title: "Upload mislukt", description: msg, variant: "destructive" })
        if (res.status === 401) router.push("/admin")
        return
      }
      if (data.urls && data.urls.length > 0) {
        setForm((prev) => ({ ...prev, image_url: data.urls[0] }))
        toast({ title: "Afbeelding geüpload", description: "De foto is toegevoegd aan dit onderdeel." })
      }
    } catch {
      toast({ title: "Upload mislukt", description: "Controleer je verbinding en probeer het opnieuw.", variant: "destructive" })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    await uploadFile(files)
    e.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!uploadingImage) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (uploadingImage) return
    const files = e.dataTransfer.files
    if (!files || files.length === 0) return
    await uploadFile(files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !id) return
    setSaving(true)
    try {
      const res = await fetch(`/api/onderdelen/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          description: form.description.trim(),
          artikelnummer: form.artikelnummer.trim(),
          barcode: form.barcode.trim() || null,
          voorraad: form.voorraad.trim() ? parseInt(form.voorraad, 10) : null,
          waarde: form.waarde.trim() ? parseInt(form.waarde, 10) : null,
          category: form.category.trim() || "Overig",
          price: form.price.trim() ? parseInt(form.price, 10) : null,
          image_url: form.image_url.trim() || null,
          is_active: form.is_active,
          sort_order: form.sort_order.trim() ? parseInt(form.sort_order, 10) : 0,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast({ title: "Opgeslagen", description: form.artikelnummer + " is bijgewerkt." })
        router.push("/admin/onderdelen")
      } else {
        toast({
          title: "Fout",
          description: data.error || "Kon onderdeel niet bijwerken",
          variant: "destructive",
        })
      }
    } catch {
      toast({ title: "Fout", description: "Netwerkfout", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Onderdeel laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/admin/onderdelen">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Onderdeel bewerken</h1>
                <p className="text-sm text-gray-500">Voorraad en waarde alleen zichtbaar in admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Gegevens onderdeel</CardTitle>
            <CardDescription>Wijzigingen verschijnen direct op /onderdelen (bij actief). Voorraad en waarde niet voor klanten.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input id="barcode" name="barcode" value={form.barcode} onChange={handleChange} placeholder="Scan of typ barcode" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Omschrijving *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Korte omschrijving"
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="voorraad">Voorraad</Label>
                  <Input id="voorraad" name="voorraad" type="number" min={0} value={form.voorraad} onChange={handleChange} />
                  <p className="text-xs text-gray-500">Alleen admin</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waarde">Waarde (€)</Label>
                  <Input id="waarde" name="waarde" type="number" min={0} value={form.waarde} onChange={handleChange} />
                  <p className="text-xs text-gray-500">Alleen admin</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prijs (€)</Label>
                  <Input id="price" name="price" type="number" min={0} value={form.price} onChange={handleChange} placeholder="Verkoopprijs" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artikelnummer">Onderdeelnummer *</Label>
                  <Input
                    id="artikelnummer"
                    name="artikelnummer"
                    value={form.artikelnummer}
                    onChange={handleChange}
                    className={errors.artikelnummer ? "border-red-500" : ""}
                  />
                  {errors.artikelnummer && <p className="text-sm text-red-600">{errors.artikelnummer}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categorie (filter op website)</Label>
                <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIEEN.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Afbeelding</Label>
                <p className="text-sm text-gray-500">Optioneel. Upload een foto of plak een link.</p>
                <div className="flex-1">
                  <Input
                    id="image_url"
                    name="image_url"
                    type="url"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder="https://... (of upload hieronder)"
                  />
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageInputChange}
                    className="sr-only"
                    aria-hidden
                    tabIndex={-1}
                    disabled={uploadingImage}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        fileInputRef.current?.click()
                      }
                    }}
                    className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/50"
                    } ${uploadingImage ? "pointer-events-none opacity-70" : "cursor-pointer"}`}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      {isDragging ? "Laat los om te uploaden" : "Sleep een foto hierheen"}
                    </p>
                    <p className="text-sm text-gray-500">of klik om een bestand te kiezen (JPEG, PNG, WebP, GIF – max 10 MB)</p>
                    {uploadingImage && (
                      <p className="text-sm text-blue-600 mt-2 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Bezig met uploaden...
                      </p>
                    )}
                  </div>
                </div>
                {form.image_url && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border bg-gray-100 shrink-0">
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200"
                      onClick={() => setForm((p) => ({ ...p, image_url: "" }))}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Verwijderen
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_active"
                  checked={form.is_active}
                  onCheckedChange={(c) => setForm((p) => ({ ...p, is_active: !!c }))}
                />
                <Label htmlFor="is_active" className="cursor-pointer">Actief (zichtbaar op zoekpagina)</Label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Opslaan
                </Button>
                <Link href="/admin/onderdelen">
                  <Button type="button" variant="outline">Annuleren</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
