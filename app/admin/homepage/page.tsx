"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ImagePlus, Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

type HeroImages = {
  background_image_url: string
  collage_wide_image_url: string
  collage_square_1_url: string
  collage_square_2_url: string
}

const DEFAULT_HERO_IMAGES: HeroImages = {
  background_image_url: "/over-autogarage-viorel.png",
  collage_wide_image_url: "/over-autogarage-viorel.png",
  collage_square_1_url: "/uploads/cars/0a1fec5b-b1fb-41ca-9ea7-22b11700b4dc.webp",
  collage_square_2_url: "/uploads/cars/226d9937-c230-4657-94a8-ecb2a83f6925.webp",
}

async function uploadFiles(files: FileList | File[], toast: ReturnType<typeof useToast>["toast"], router: ReturnType<typeof useRouter>) {
  const list = Array.from(files).filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|gif)$/i.test(f.name))
  if (list.length === 0) {
    toast({ title: "Geen afbeeldingen", description: "Selecteer alleen afbeeldingen (JPEG, PNG, WebP, GIF).", variant: "destructive" })
    return []
  }

  const formDataUpload = new FormData()
  list.forEach((file) => formDataUpload.append("files", file))

  const res = await fetch("/api/upload?folder=homepage", {
    method: "POST",
    body: formDataUpload,
    credentials: "include",
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg =
      res.status === 401
        ? "Sessie verlopen. Log opnieuw in bij het adminpanel."
        : (data.error as string) || "Upload mislukt. Probeer opnieuw."
    toast({ title: "Upload mislukt", description: msg, variant: "destructive" })
    if (res.status === 401) router.push("/admin")
    return []
  }

  return Array.isArray(data.urls) ? (data.urls as string[]) : []
}

export default function HomepageCmsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [heroImages, setHeroImages] = useState<HeroImages>(DEFAULT_HERO_IMAGES)

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin-logged-in")
    if (!loggedIn) {
      router.push("/admin")
      return
    }

    setIsLoggedIn(true)
    void loadHeroImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const loadHeroImages = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/page-content?pageSlug=home", { credentials: "include" })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast({ title: "Fout bij laden", description: (data.error as string) || "Kon page content niet laden.", variant: "destructive" })
        return
      }

      const content = (data?.content ?? {}) as any
      const hero = content?.hero ?? {}

      setHeroImages({
        background_image_url: typeof hero.background_image_url === "string" ? hero.background_image_url : DEFAULT_HERO_IMAGES.background_image_url,
        collage_wide_image_url: typeof hero.collage_wide_image_url === "string" ? hero.collage_wide_image_url : DEFAULT_HERO_IMAGES.collage_wide_image_url,
        collage_square_1_url:
          typeof hero.collage_square_image_urls?.[0] === "string"
            ? hero.collage_square_image_urls[0]
            : DEFAULT_HERO_IMAGES.collage_square_1_url,
        collage_square_2_url:
          typeof hero.collage_square_image_urls?.[1] === "string"
            ? hero.collage_square_image_urls[1]
            : DEFAULT_HERO_IMAGES.collage_square_2_url,
      })
    } catch (e) {
      toast({ title: "Fout bij laden", description: e instanceof Error ? e.message : "Onbekende fout.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleChange =
    (key: keyof HeroImages) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setHeroImages((prev) => ({ ...prev, [key]: value }))
    }

  const handleUpload =
    (key: keyof HeroImages) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      const urls = await uploadFiles(files, toast, router)
      if (urls.length === 0) return

      setHeroImages((prev) => ({ ...prev, [key]: urls[0] }))
      e.target.value = ""
    }

  const handleSave = async () => {
    try {
      setSaving(true)

      const payload = {
        pageSlug: "home",
        content: {
          hero: {
            background_image_url: heroImages.background_image_url,
            collage_wide_image_url: heroImages.collage_wide_image_url,
            collage_square_image_urls: [heroImages.collage_square_1_url, heroImages.collage_square_2_url],
          },
        },
      }

      const res = await fetch("/api/page-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast({ title: "Opslaan mislukt", description: (data.error as string) || "Probeer opnieuw.", variant: "destructive" })
        return
      }

      toast({ title: "Homepage CMS opgeslagen", description: "Hero-foto's zijn bijgewerkt." })
      void loadHeroImages()
    } finally {
      setSaving(false)
    }
  }

  if (!isLoggedIn || loading) {
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
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
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
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ImagePlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Homepage CMS</h1>
                  <p className="text-sm text-gray-500">Beheer hero/foto's op de homepagina</p>
                </div>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave} disabled={saving}>
              {saving ? "Opslaan..." : "Opslaan"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Hero afbeeldingen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Background */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-2">
                <Label>Hero achtergrond</Label>
                <Input value={heroImages.background_image_url} onChange={handleChange("background_image_url")} placeholder="/over-autogarage-viorel.png of https://..." />
                <div className="flex gap-3">
                  <label className="cursor-pointer flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload("background_image_url")} />
                  </label>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                <img src={heroImages.background_image_url || DEFAULT_HERO_IMAGES.background_image_url} alt="Hero achtergrond preview" className="w-full h-40 object-cover" />
              </div>
            </div>

            {/* Collage wide */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-2">
                <Label>Collage (wide) foto</Label>
                <Input value={heroImages.collage_wide_image_url} onChange={handleChange("collage_wide_image_url")} placeholder="/over-autogarage-viorel.png of https://..." />
                <div className="flex gap-3">
                  <label className="cursor-pointer flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload("collage_wide_image_url")} />
                  </label>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                <img src={heroImages.collage_wide_image_url || DEFAULT_HERO_IMAGES.collage_wide_image_url} alt="Collage wide preview" className="w-full h-40 object-cover" />
              </div>
            </div>

            {/* Square 1 */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-2">
                <Label>Collage (square) foto 1</Label>
                <Input value={heroImages.collage_square_1_url} onChange={handleChange("collage_square_1_url")} placeholder="https://... of /uploads/..." />
                <div className="flex gap-3">
                  <label className="cursor-pointer flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload("collage_square_1_url")} />
                  </label>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                <img src={heroImages.collage_square_1_url || DEFAULT_HERO_IMAGES.collage_square_1_url} alt="Collage square 1 preview" className="w-full h-40 object-cover" />
              </div>
            </div>

            {/* Square 2 */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-2">
                <Label>Collage (square) foto 2</Label>
                <Input value={heroImages.collage_square_2_url} onChange={handleChange("collage_square_2_url")} placeholder="https://... of /uploads/..." />
                <div className="flex gap-3">
                  <label className="cursor-pointer flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload("collage_square_2_url")} />
                  </label>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                <img src={heroImages.collage_square_2_url || DEFAULT_HERO_IMAGES.collage_square_2_url} alt="Collage square 2 preview" className="w-full h-40 object-cover" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

