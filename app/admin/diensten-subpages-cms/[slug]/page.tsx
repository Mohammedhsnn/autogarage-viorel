"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Plus, Trash2, Wrench } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getDienstenPaginaContent } from "@/lib/diensten-paginas"

type DienstenSlugContent = {
  title: string
  subtitle: string
  intro: string
  features: string[]
  ctaTitle: string
  ctaSubtitle: string
}

export default function DienstenSubpageCmsEditPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const slug = (params?.slug as string) || ""
  const defaults = slug ? getDienstenPaginaContent(slug) : null

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState(defaults?.title ?? "")
  const [subtitle, setSubtitle] = useState(defaults?.subtitle ?? "")
  const [intro, setIntro] = useState(defaults?.intro ?? "")
  const [ctaTitle, setCtaTitle] = useState(defaults?.ctaTitle ?? "")
  const [ctaSubtitle, setCtaSubtitle] = useState(defaults?.ctaSubtitle ?? "")
  const [features, setFeatures] = useState<string[]>(defaults?.features ?? [])

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin-logged-in")
    if (!loggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
  }, [router])

  useEffect(() => {
    if (!isLoggedIn) return
    if (!slug) return

    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/page-content?pageSlug=diensten:${slug}`, { credentials: "include" })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          toast({
            title: "Fout bij laden",
            description: (data.error as string) || "Kon content niet laden.",
            variant: "destructive",
          })
          return
        }

        const content = (data?.content ?? {}) as Partial<DienstenSlugContent>

        setTitle(typeof content.title === "string" ? content.title : defaults?.title ?? "")
        setSubtitle(typeof content.subtitle === "string" ? content.subtitle : defaults?.subtitle ?? "")
        setIntro(typeof content.intro === "string" ? content.intro : defaults?.intro ?? "")
        setCtaTitle(typeof content.ctaTitle === "string" ? content.ctaTitle : defaults?.ctaTitle ?? "")
        setCtaSubtitle(typeof content.ctaSubtitle === "string" ? content.ctaSubtitle : defaults?.ctaSubtitle ?? "")
        setFeatures(Array.isArray(content.features) ? content.features.filter((f) => typeof f === "string") : defaults?.features ?? [])
      } catch (e) {
        toast({ title: "Fout bij laden", description: e instanceof Error ? e.message : "Onbekende fout.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [defaults?.title, defaults?.subtitle, defaults?.intro, defaults?.ctaTitle, defaults?.ctaSubtitle, defaults?.features, isLoggedIn, slug, toast])

  const addFeature = () => setFeatures((prev) => [...prev, ""])

  const removeFeature = (idx: number) => setFeatures((prev) => prev.filter((_, i) => i !== idx))

  const handleSave = async () => {
    try {
      setSaving(true)
      const payload = {
        pageSlug: `diensten:${slug}`,
        content: {
          title,
          subtitle,
          intro,
          features: features.filter((f) => f.trim().length > 0),
          ctaTitle,
          ctaSubtitle,
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

      toast({ title: "Opgeslagen", description: `CMS bijgewerkt voor /diensten/${slug}` })
    } catch (e) {
      toast({ title: "Opslaan mislukt", description: e instanceof Error ? e.message : "Onbekende fout.", variant: "destructive" })
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

  if (!defaults) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 py-4">
              <Link href="/admin/diensten-subpages-cms">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Terug
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Onbekende dienst</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">Deze dienst slug bestaat niet.</CardContent>
          </Card>
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
              <Link href="/admin/diensten-subpages-cms">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Terug
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">CMS: /diensten/{slug}</h1>
                  <p className="text-sm text-gray-500">Teksten en features</p>
                </div>
              </div>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave} disabled={saving}>
              {saving ? "Opslaan..." : "Opslaan"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero / intro</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Subtitel</Label>
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Intro</Label>
              <Textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={4} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wat wij bieden (features)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.length === 0 ? (
              <div className="text-sm text-gray-600">Nog geen features. Voeg er één toe.</div>
            ) : null}

            <div className="space-y-3">
              {features.map((f, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <Label>Feature {idx + 1}</Label>
                    <Input value={f} onChange={(e) => setFeatures((prev) => prev.map((x, i) => (i === idx ? e.target.value : x)))} />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-6"
                    onClick={() => removeFeature(idx)}
                    aria-label={`Feature ${idx + 1} verwijderen`}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={addFeature}>
                <Plus className="w-4 h-4 mr-2" />
                Feature toevoegen
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CTA</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>CTA titel</Label>
              <Input value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>CTA subtitel</Label>
              <Input value={ctaSubtitle} onChange={(e) => setCtaSubtitle(e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

