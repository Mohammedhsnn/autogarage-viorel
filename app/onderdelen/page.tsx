"use client"

import { useState, useEffect } from "react"
import { Package, Search, Phone, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"

const MERKEN = [
  "Abarth", "Alfa Romeo", "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford",
  "Honda", "Hyundai", "Kia", "Mazda", "Mercedes", "Mini", "Nissan", "Opel",
  "Peugeot", "Renault", "Seat", "Skoda", "Toyota", "Volkswagen", "Volvo",
]

const CATEGORIEEN = [
  "Banden", "Motor", "Versnellingsbak", "Remmen", "Ophanging", "Uitlaat",
  "Elektrisch", "Carrosserie", "Interieur", "Verlichting", "Overig",
]

interface Onderdeel {
  id: number
  name: string
  description: string | null
  artikelnummer: string | null
  merk: string | null
  motorcode: string | null
  versnellingsbakcode: string | null
  chassisnummer: string | null
  kba_nummer: string | null
  category: string
  price: number | null
  image_url: string | null
  created_at?: string
}

export default function OnderdelenPage() {
  const [kenteken, setKenteken] = useState("")
  const [merk, setMerk] = useState("")
  const [artikelnummer, setArtikelnummer] = useState("")
  const [motorcode, setMotorcode] = useState("")
  const [versnellingsbakcode, setVersnellingsbakcode] = useState("")
  const [chassisnummer, setChassisnummer] = useState("")
  const [kbaNummer, setKbaNummer] = useState("")
  const [category, setCategory] = useState("")
  const [vrijeTekst, setVrijeTekst] = useState("")
  const [onderdelen, setOnderdelen] = useState<Onderdeel[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autosoort, setAutosoort] = useState<string | null>(null)
  const [kentekenLookupLoading, setKentekenLookupLoading] = useState(false)

  const [aanbodOnderdelen, setAanbodOnderdelen] = useState<Onderdeel[]>([])
  const [aanbodLoading, setAanbodLoading] = useState(true)
  const [filterAanbodCategory, setFilterAanbodCategory] = useState("all")
  const [sortAanbod, setSortAanbod] = useState("created_at")

  useEffect(() => {
    const loadAanbod = async () => {
      try {
        setAanbodLoading(true)
        const res = await fetch("/api/onderdelen")
        const data = await res.json()
        if (data.success && Array.isArray(data.onderdelen)) setAanbodOnderdelen(data.onderdelen)
        else setAanbodOnderdelen([])
      } catch {
        setAanbodOnderdelen([])
      } finally {
        setAanbodLoading(false)
      }
    }
    loadAanbod()
  }, [])

  const filteredAanbod = (() => {
    let list = [...aanbodOnderdelen]
    if (filterAanbodCategory !== "all") list = list.filter((o) => o.category === filterAanbodCategory)
    if (sortAanbod === "price-asc") list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    else if (sortAanbod === "price-desc") list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    else list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    return list
  })()

  const aanbodCategories = Array.from(new Set(aanbodOnderdelen.map((o) => o.category).filter(Boolean))).sort()

  const hasSearch = () =>
    [kenteken, merk, artikelnummer, motorcode, versnellingsbakcode, chassisnummer, kbaNummer, category, vrijeTekst].some(
      (v) => v && String(v).trim()
    )

  const lookupKenteken = async () => {
    const raw = kenteken.replace(/[\s\-\.]/g, "").toUpperCase()
    if (raw.length < 4) {
      setAutosoort(null)
      return
    }
    setKentekenLookupLoading(true)
    setAutosoort(null)
    try {
      const res = await fetch(`/api/kenteken-lookup?kenteken=${encodeURIComponent(raw)}`)
      const data = await res.json()
      if (data.success && data.autosoort) {
        setAutosoort(data.autosoort)
        if (data.merk && MERKEN.some((m) => m.toLowerCase() === String(data.merk).toLowerCase())) {
          setMerk(data.merk)
        }
      } else if (data.success && data.message) {
        setAutosoort(null)
      }
    } catch {
      setAutosoort(null)
    } finally {
      setKentekenLookupLoading(false)
    }
  }

  const doSearch = async () => {
    if (!hasSearch()) {
      setSearched(false)
      setOnderdelen([])
      return
    }
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const params = new URLSearchParams()
      const qParts = [vrijeTekst.trim(), kenteken.trim()].filter(Boolean)
      if (qParts.length) params.set("q", qParts.join(" "))
      if (merk.trim()) params.set("merk", merk.trim())
      if (artikelnummer.trim()) params.set("artikelnummer", artikelnummer.trim())
      if (motorcode.trim()) params.set("motorcode", motorcode.trim())
      if (versnellingsbakcode.trim()) params.set("versnellingsbakcode", versnellingsbakcode.trim())
      if (chassisnummer.trim()) params.set("chassisnummer", chassisnummer.trim())
      if (kbaNummer.trim()) params.set("kba_nummer", kbaNummer.trim())
      if (category.trim()) params.set("category", category.trim())

      const res = await fetch(`/api/onderdelen?${params.toString()}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.onderdelen)) {
        setOnderdelen(data.onderdelen)
      } else {
        setOnderdelen([])
      }
    } catch (e) {
      setError("Zoeken mislukt. Probeer het later opnieuw.")
      setOnderdelen([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/onderdelen" />

      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-10 sm:pb-12 lg:pt-40 lg:pb-16 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-[100vw] flex justify-center">
          <div className="max-w-3xl w-full text-center min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4 sm:mb-6">
              <Package className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Zoeken naar onderdelen</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.08] text-white mb-4 antialiased">
              Onderdelen voorraad
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto">
              Zoek op kenteken, merk, artikelnummer, motorcode of andere gegevens. Geen resultaat? Bel ons voor een aanvraag.
            </p>
          </div>
        </div>
      </section>

      {/* Zoekformulier */}
      <section className="py-8 sm:py-10 lg:py-14 bg-slate-50 border-b overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="max-w-4xl mx-auto min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 mb-4 sm:mb-6">Zoeken naar onderdelen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="kenteken">Kenteken</Label>
                <Input
                  id="kenteken"
                  placeholder="Bijv. AB-123-CD"
                  value={kenteken}
                  onChange={(e) => {
                    setKenteken(e.target.value)
                    if (e.target.value.replace(/[\s\-\.]/g, "").length < 4) setAutosoort(null)
                  }}
                  onBlur={lookupKenteken}
                  className="bg-white"
                />
                {kentekenLookupLoading && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Voertuig opzoeken…
                  </p>
                )}
                {autosoort && !kentekenLookupLoading && (
                  <p className="text-sm text-blue-700 font-medium">
                    Voertuig: {autosoort}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="merk">Merk</Label>
                <Select value={merk || "all"} onValueChange={(v) => setMerk(v === "all" ? "" : v)}>
                  <SelectTrigger id="merk" className="bg-white">
                    <SelectValue placeholder="Selecteer merk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle merken</SelectItem>
                    {MERKEN.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="artikelnummer">Artikelnummer (max. 19 tekens)</Label>
                <Input
                  id="artikelnummer"
                  placeholder="Onderdeelnummer"
                  maxLength={19}
                  value={artikelnummer}
                  onChange={(e) => setArtikelnummer(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motorcode">Motorcode (max. 13 tekens)</Label>
                <Input
                  id="motorcode"
                  placeholder="Motorcode"
                  maxLength={13}
                  value={motorcode}
                  onChange={(e) => setMotorcode(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="versnellingsbakcode">Versnellingsbakcode (max. 11 tekens)</Label>
                <Input
                  id="versnellingsbakcode"
                  placeholder="Versnellingsbakcode"
                  maxLength={11}
                  value={versnellingsbakcode}
                  onChange={(e) => setVersnellingsbakcode(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chassisnummer">Chassisnummer (VIN)</Label>
                <Input
                  id="chassisnummer"
                  placeholder="Chassisnummer"
                  value={chassisnummer}
                  onChange={(e) => setChassisnummer(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kba">KBA-nummer</Label>
                <Input
                  id="kba"
                  placeholder="KBA-nummer"
                  value={kbaNummer}
                  onChange={(e) => setKbaNummer(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categorie</Label>
                <Select value={category || "all"} onValueChange={(v) => setCategory(v === "all" ? "" : v)}>
                  <SelectTrigger id="category" className="bg-white">
                    <SelectValue placeholder="Selecteer categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle categorieën</SelectItem>
                    {CATEGORIEEN.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="vrijeTekst">Vrije zoektekst (naam, omschrijving)</Label>
                <Input
                  id="vrijeTekst"
                  placeholder="Typ een zoekterm"
                  value={vrijeTekst}
                  onChange={(e) => setVrijeTekst(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={doSearch}
                disabled={loading || !hasSearch()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Zoeken
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setKenteken("")
                  setMerk("")
                  setArtikelnummer("")
                  setMotorcode("")
                  setVersnellingsbakcode("")
                  setChassisnummer("")
                  setKbaNummer("")
                  setCategory("")
                  setVrijeTekst("")
                  setAutosoort(null)
                  setSearched(false)
                  setOnderdelen([])
                }}
              >
                Wissen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Resultaten: alleen zichtbaar na zoeken */}
      {(error || searched) && (
      <section className="py-10 sm:py-12 lg:py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="max-w-4xl mx-auto min-w-0">
            {error && (
              <Card className="mb-6 border-amber-200 bg-amber-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-amber-800">{error}</p>
                </CardContent>
              </Card>
            )}

            {searched && !loading && (
              <>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-4">
                  {onderdelen.length === 0
                    ? "Geen onderdelen gevonden"
                    : `${onderdelen.length} onderdeel${onderdelen.length === 1 ? "" : "en"} gevonden`}
                </h2>
                {onderdelen.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Geen onderdelen gevonden met uw zoekcriteria. Wij kunnen vaak alsnog onderdelen voor u regelen.
                      </p>
                      <a href="tel:+31618809802">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Phone className="w-4 h-4 mr-2" />
                          Bel voor een aanvraag
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ) : (
                  <ul className="space-y-4">
                    {onderdelen.map((o) => (
                      <Card key={o.id}>
                        <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
                          {o.image_url && (
                            <img
                              src={o.image_url}
                              alt={o.name}
                              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">{o.name}</h3>
                            {o.artikelnummer && (
                              <p className="text-sm text-gray-500">Art.nr. {o.artikelnummer}</p>
                            )}
                            {o.merk && (
                              <p className="text-sm text-gray-600">Merk: {o.merk}</p>
                            )}
                            {o.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{o.description}</p>
                            )}
                            {o.price != null && (
                              <p className="text-sm font-medium text-gray-900 mt-1">€ {o.price.toLocaleString()}</p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <a href="tel:+31618809802">
                              <Button variant="outline" size="sm" className="border-blue-600 text-blue-600">
                                <Phone className="w-4 h-4 mr-1" />
                                Vraag aan
                              </Button>
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Onderdelen aanbod */}
      <section className="py-12 lg:py-16 bg-slate-50 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar */}
            <aside className="lg:w-56 flex-shrink-0">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-4">Onderdelen aanbod</h2>
              <p className="text-sm text-gray-600 mb-4">
                Bekijk ons aanbod. Zoek hierboven naar onderdelen op kenteken of artikelnummer, of bel ons voor een aanvraag.
              </p>
              {!aanbodLoading && (
                <>
                  {aanbodCategories.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <Label className="text-xs font-medium text-gray-500">Categorie</Label>
                      <Select value={filterAanbodCategory} onValueChange={setFilterAanbodCategory}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Alle categorieën" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle categorieën</SelectItem>
                          {aanbodCategories.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500">Sorteer op</Label>
                    <Select value={sortAanbod} onValueChange={setSortAanbod}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created_at">Nieuwste eerst</SelectItem>
                        <SelectItem value="price-asc">Prijs laag-hoog</SelectItem>
                        <SelectItem value="price-desc">Prijs hoog-laag</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <p className="text-gray-600">
                  {aanbodLoading ? (
                    "Laden..."
                  ) : (
                    <span className="font-medium text-gray-900">{filteredAanbod.length}</span>
                  )}{" "}
                  {!aanbodLoading && "onderdelen"}
                </p>
                {!aanbodLoading && filterAanbodCategory !== "all" && (
                  <Button variant="ghost" size="sm" onClick={() => setFilterAanbodCategory("all")}>
                    Filter wissen
                  </Button>
                )}
              </div>

              {aanbodLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                </div>
              ) : filteredAanbod.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {aanbodOnderdelen.length === 0
                        ? "Nog geen onderdelen in het aanbod. In de admin kunt u onderdelen toevoegen."
                        : "Geen onderdelen in deze categorie."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAanbod.map((o) => (
                    <Card key={o.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                      <div className="aspect-[4/3] bg-gray-200 relative flex-shrink-0">
                        <img
                          src={o.image_url || "/placeholder.svg"}
                          alt={o.name}
                          className="w-full h-full object-cover"
                        />
                        {o.category && (
                          <span className="absolute top-2 left-2 px-2 py-1 rounded bg-sky-600 text-white text-xs font-medium">
                            {o.category}
                          </span>
                        )}
                      </div>
                      <CardContent className="p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-gray-900">{o.name}</h3>
                        {o.merk && <p className="text-sm text-gray-500">Merk: {o.merk}</p>}
                        {o.artikelnummer && (
                          <p className="text-sm text-gray-500">Art.nr. {o.artikelnummer}</p>
                        )}
                        {o.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{o.description}</p>
                        )}
                        {o.price != null && (
                          <p className="mt-2 font-semibold text-gray-900">€ {o.price.toLocaleString()}</p>
                        )}
                        <a href="tel:+31618809802" className="mt-3 inline-flex">
                          <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 w-full sm:w-auto">
                            <Phone className="w-4 h-4 mr-1" />
                            Vraag aan
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </div>
  )
}
