"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  DEFAULT_HOME_PAGE_CONTENT,
  type HomePageContent,
  homePageContentToJson,
  mergeHomePageContent,
} from "@/lib/homepage-content"

async function uploadHomepageImage(
  files: FileList | File[],
  toast: ReturnType<typeof useToast>["toast"],
  router: ReturnType<typeof useRouter>,
): Promise<string[]> {
  const list = Array.from(files).filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|gif)$/i.test(f.name))
  if (list.length === 0) {
    toast({
      title: "Geen afbeeldingen",
      description: "Selecteer alleen afbeeldingen (JPEG, PNG, WebP, GIF).",
      variant: "destructive",
    })
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
        : (data.error as string) || "Upload mislukt."
    toast({ title: "Upload mislukt", description: msg, variant: "destructive" })
    if (res.status === 401) router.push("/admin")
    return []
  }
  return Array.isArray(data.urls) ? (data.urls as string[]) : []
}

export default function HomepageSiteContentEditor() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<HomePageContent>(() => structuredClone(DEFAULT_HOME_PAGE_CONTENT))

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/page-content?pageSlug=home", { credentials: "include" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast({ title: "Fout bij laden", description: (data.error as string) || "Kon inhoud niet laden.", variant: "destructive" })
        return
      }
      const merged = mergeHomePageContent((data?.content ?? {}) as Record<string, unknown>)
      setContent(merged)
    } catch (e) {
      toast({ title: "Fout bij laden", description: e instanceof Error ? e.message : "Onbekende fout.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin-logged-in")
    if (!loggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
    void load()
  }, [router, load])

  const save = async () => {
    try {
      setSaving(true)
      const res = await fetch("/api/page-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSlug: "home", content: homePageContentToJson(content) }),
        credentials: "include",
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast({ title: "Opslaan mislukt", description: (data.error as string) || "Probeer opnieuw.", variant: "destructive" })
        return
      }
      toast({ title: "Opgeslagen", description: "Homepagina-inhoud is bijgewerkt." })
      void load()
    } finally {
      setSaving(false)
    }
  }

  const setHero = (patch: Partial<HomePageContent["hero"]>) => {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, ...patch } }))
  }

  const setStat = (index: 0 | 1 | 2, patch: Partial<{ title: string; subtitle: string }>) => {
    setContent((prev) => {
      const stats = [...prev.stats] as [typeof prev.stats[0], typeof prev.stats[1], typeof prev.stats[2]]
      stats[index] = { ...stats[index], ...patch }
      return { ...prev, stats: stats }
    })
  }

  const setOfferCard = (index: 0 | 1 | 2, patch: Partial<HomePageContent["offer_cards"][0]>) => {
    setContent((prev) => {
      const cards = [...prev.offer_cards] as HomePageContent["offer_cards"]
      cards[index] = { ...cards[index], ...patch }
      return { ...prev, offer_cards: cards }
    })
  }

  const setUsp = (index: 0 | 1 | 2 | 3, patch: Partial<{ title: string; subtitle: string }>) => {
    setContent((prev) => {
      const usps = [...prev.usps] as HomePageContent["usps"]
      usps[index] = { ...usps[index], ...patch }
      return { ...prev, usps: usps }
    })
  }

  const setAboutStat = (index: 0 | 1 | 2, patch: Partial<{ value: string; label: string }>) => {
    setContent((prev) => {
      const stats = [...prev.about.stats] as HomePageContent["about"]["stats"]
      stats[index] = { ...stats[index], ...patch }
      return { ...prev, about: { ...prev.about, stats } }
    })
  }

  const setServiceItem = (index: 0 | 1 | 2 | 3, patch: Partial<{ title: string; description: string }>) => {
    setContent((prev) => {
      const items = [...prev.services_detail.items] as HomePageContent["services_detail"]["items"]
      items[index] = { ...items[index], ...patch }
      return { ...prev, services_detail: { ...prev.services_detail, items } }
    })
  }

  const handleHeroUpload =
    (key: "background_image_url" | "collage_wide_image_url" | "collage_square_image_urls") =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files?.length) return
      const urls = await uploadHomepageImage(files, toast, router)
      if (!urls.length) return
      if (key === "collage_square_image_urls") {
        setHero({
          collage_square_image_urls: [urls[0] ?? content.hero.collage_square_image_urls[0], content.hero.collage_square_image_urls[1]],
        })
      } else {
        setHero({ [key]: urls[0] } as Partial<HomePageContent["hero"]>)
      }
      e.target.value = ""
    }

  const handleSquareUpload = (index: 0 | 1) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    const urls = await uploadHomepageImage(files, toast, router)
    if (!urls.length) return
    const next = [...content.hero.collage_square_image_urls] as [string, string]
    next[index] = urls[0]
    setHero({ collage_square_image_urls: next })
    e.target.value = ""
  }

  const handleOfferCardUpload = (index: 0 | 1 | 2) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    const urls = await uploadHomepageImage(files, toast, router)
    if (!urls.length) return
    setOfferCard(index, { image_url: urls[0] })
    e.target.value = ""
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

  const h = content.hero

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link href="/admin/cms">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Site inhoud
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Homepagina beheren</h1>
                <p className="text-sm text-gray-500">Teksten en afbeeldingen voor de startpagina</p>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 shrink-0" onClick={save} disabled={saving}>
              {saving ? "Opslaan..." : "Alles opslaan"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero tekst */}
        <Card>
          <CardHeader>
            <CardTitle>Hero — teksten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Badge (boven titel)</Label>
                <Input value={h.badge_text} onChange={(e) => setHero({ badge_text: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Slider ondertitel (brede foto)</Label>
                <Input value={h.slider_caption_wide} onChange={(e) => setHero({ slider_caption_wide: e.target.value })} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kop regel 1</Label>
                <Input value={h.headline_line1} onChange={(e) => setHero({ headline_line1: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Kop regel 2 (accent)</Label>
                <Input value={h.headline_highlight} onChange={(e) => setHero({ headline_highlight: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Introductietekst</Label>
              <Textarea rows={3} value={h.intro} onChange={(e) => setHero({ intro: e.target.value })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bullet 1</Label>
                <Input value={h.bullet1} onChange={(e) => setHero({ bullet1: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Bullet 2</Label>
                <Input value={h.bullet2} onChange={(e) => setHero({ bullet2: e.target.value })} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Knop primair</Label>
                <Input value={h.cta_primary} onChange={(e) => setHero({ cta_primary: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Knop secundair</Label>
                <Input value={h.cta_secondary} onChange={(e) => setHero({ cta_secondary: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero foto’s */}
        <Card>
          <CardHeader>
            <CardTitle>Hero — afbeeldingen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(
              [
                ["background_image_url", "Achtergrond (hero)"] as const,
                ["collage_wide_image_url", "Collage breed"] as const,
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="grid md:grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                  <Label>{label}</Label>
                  <Input value={h[key]} onChange={(e) => setHero({ [key]: e.target.value } as Partial<HomePageContent["hero"]>)} />
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm">
                    <Upload className="w-4 h-4 text-blue-600" />
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload(key)} />
                  </label>
                </div>
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                  <img src={h[key] || "/placeholder.svg"} alt="" className="w-full h-36 object-cover" />
                </div>
              </div>
            ))}
            {([0, 1] as const).map((idx) => (
              <div key={idx} className="grid md:grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                  <Label>Collage vierkant {idx + 1}</Label>
                  <Input
                    value={h.collage_square_image_urls[idx]}
                    onChange={(e) => {
                      const next = [...h.collage_square_image_urls] as [string, string]
                      next[idx] = e.target.value
                      setHero({ collage_square_image_urls: next })
                    }}
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm">
                    <Upload className="w-4 h-4 text-blue-600" />
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleSquareUpload(idx)} />
                  </label>
                </div>
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                  <img src={h.collage_square_image_urls[idx] || "/placeholder.svg"} alt="" className="w-full h-36 object-cover" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistieken (3 blokken onder hero)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {([0, 1, 2] as const).map((i) => (
              <div key={i} className="grid sm:grid-cols-2 gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                <div className="space-y-2">
                  <Label>Titel {i + 1}</Label>
                  <Input value={content.stats[i].title} onChange={(e) => setStat(i, { title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Ondertitel {i + 1}</Label>
                  <Input value={content.stats[i].subtitle} onChange={(e) => setStat(i, { subtitle: e.target.value })} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ons aanbod sectie + kaarten */}
        <Card>
          <CardHeader>
            <CardTitle>Sectie “Ons aanbod” + 3 kaarten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sectietitel</Label>
                <Input
                  value={content.offer_section.title}
                  onChange={(e) => setContent((p) => ({ ...p, offer_section: { ...p.offer_section, title: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Sectie ondertitel</Label>
                <Input
                  value={content.offer_section.subtitle}
                  onChange={(e) => setContent((p) => ({ ...p, offer_section: { ...p.offer_section, subtitle: e.target.value } }))}
                />
              </div>
            </div>
            {([0, 1, 2] as const).map((i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 space-y-3">
                <p className="font-medium text-gray-900">Kaart {i + 1}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Titel</Label>
                    <Input value={content.offer_cards[i].title} onChange={(e) => setOfferCard(i, { title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Link (pad)</Label>
                    <Input value={content.offer_cards[i].href} onChange={(e) => setOfferCard(i, { href: e.target.value })} placeholder="/occasions" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tekst</Label>
                  <Textarea rows={2} value={content.offer_cards[i].description} onChange={(e) => setOfferCard(i, { description: e.target.value })} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Knoptekst</Label>
                    <Input value={content.offer_cards[i].cta} onChange={(e) => setOfferCard(i, { cta: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Afbeelding URL</Label>
                    <Input value={content.offer_cards[i].image_url} onChange={(e) => setOfferCard(i, { image_url: e.target.value })} />
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm">
                      <Upload className="w-4 h-4 text-blue-600" />
                      Upload foto
                      <input type="file" accept="image/*" className="hidden" onChange={handleOfferCardUpload(i)} />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Featured occasions */}
        <Card>
          <CardHeader>
            <CardTitle>Occasions uitgelicht</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input
                value={content.featured.title}
                onChange={(e) => setContent((p) => ({ ...p, featured: { ...p.featured, title: e.target.value } }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Knoptekst</Label>
              <Input
                value={content.featured.button_label}
                onChange={(e) => setContent((p) => ({ ...p, featured: { ...p.featured, button_label: e.target.value } }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Ondertitel</Label>
              <Input
                value={content.featured.subtitle}
                onChange={(e) => setContent((p) => ({ ...p, featured: { ...p.featured, subtitle: e.target.value } }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* USPs */}
        <Card>
          <CardHeader>
            <CardTitle>USP’s (4 blokken, lichtblauwe strook)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {([0, 1, 2, 3] as const).map((i) => (
              <div key={i} className="grid sm:grid-cols-2 gap-4 p-4 rounded-lg border border-gray-100">
                <div className="space-y-2">
                  <Label>Titel {i + 1}</Label>
                  <Input value={content.usps[i].title} onChange={(e) => setUsp(i, { title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Ondertitel {i + 1}</Label>
                  <Input value={content.usps[i].subtitle} onChange={(e) => setUsp(i, { subtitle: e.target.value })} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Over ons */}
        <Card>
          <CardHeader>
            <CardTitle>Over ons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input
                value={content.about.title}
                onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, title: e.target.value } }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Alinea 1</Label>
              <Textarea rows={3} value={content.about.paragraph1} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, paragraph1: e.target.value } }))} />
            </div>
            <div className="space-y-2">
              <Label>Alinea 2</Label>
              <Textarea rows={3} value={content.about.paragraph2} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, paragraph2: e.target.value } }))} />
            </div>
            {([0, 1, 2] as const).map((i) => (
              <div key={i} className="grid sm:grid-cols-2 gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                <div className="space-y-2">
                  <Label>Cijfer {i + 1}</Label>
                  <Input value={content.about.stats[i].value} onChange={(e) => setAboutStat(i, { value: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Label {i + 1}</Label>
                  <Input value={content.about.stats[i].label} onChange={(e) => setAboutStat(i, { label: e.target.value })} />
                </div>
              </div>
            ))}
            <div className="space-y-2">
              <Label>Knoptekst</Label>
              <Input value={content.about.cta} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, cta: e.target.value } }))} />
            </div>
          </CardContent>
        </Card>

        {/* Onze diensten detail */}
        <Card>
          <CardHeader>
            <CardTitle>Onze diensten (4 blokken)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sectietitel</Label>
                <Input
                  value={content.services_detail.title}
                  onChange={(e) => setContent((p) => ({ ...p, services_detail: { ...p.services_detail, title: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Sectie ondertitel</Label>
                <Input
                  value={content.services_detail.subtitle}
                  onChange={(e) => setContent((p) => ({ ...p, services_detail: { ...p.services_detail, subtitle: e.target.value } }))}
                />
              </div>
            </div>
            {([0, 1, 2, 3] as const).map((i) => (
              <div key={i} className="grid sm:grid-cols-2 gap-4 p-4 rounded-lg border border-gray-100">
                <div className="space-y-2">
                  <Label>Titel {i + 1}</Label>
                  <Input value={content.services_detail.items[i].title} onChange={(e) => setServiceItem(i, { title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Beschrijving {i + 1}</Label>
                  <Input value={content.services_detail.items[i].description} onChange={(e) => setServiceItem(i, { description: e.target.value })} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact intro */}
        <Card>
          <CardHeader>
            <CardTitle>Contact (koptekst boven formulier)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input
                value={content.contact_block.title}
                onChange={(e) => setContent((p) => ({ ...p, contact_block: { ...p.contact_block, title: e.target.value } }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Introductie</Label>
              <Textarea rows={2} value={content.contact_block.intro} onChange={(e) => setContent((p) => ({ ...p, contact_block: { ...p.contact_block, intro: e.target.value } }))} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pb-8">
          <Button className="bg-blue-600 hover:bg-blue-700" size="lg" onClick={save} disabled={saving}>
            {saving ? "Opslaan..." : "Alles opslaan"}
          </Button>
        </div>
      </div>
    </div>
  )
}
