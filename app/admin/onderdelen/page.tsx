"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Package, Loader2, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Onderdeel {
  id: number
  name: string
  description: string | null
  artikelnummer: string | null
  barcode?: string | null
  voorraad?: number | null
  waarde?: number | null
  merk: string | null
  motorcode: string | null
  category: string
  price: number | null
  image_url: string | null
  is_active: boolean
  created_at: string
}

export default function AdminOnderdelenPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [onderdelen, setOnderdelen] = useState<Onderdeel[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin-logged-in")
    if (!loggedIn) {
      router.push("/admin")
    } else {
      setIsLoggedIn(true)
      loadOnderdelen()
    }
  }, [router])

  const loadOnderdelen = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/onderdelen?active=false", { credentials: "include" })
      const data = await res.json()
      if (data.success && Array.isArray(data.onderdelen)) {
        setOnderdelen(data.onderdelen)
      } else {
        setOnderdelen([])
      }
    } catch {
      setOnderdelen([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (o: Onderdeel) => {
    if (!confirm(`Weet u zeker dat u onderdeel "${o.artikelnummer || o.name}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) return
    setDeletingId(o.id)
    try {
      const res = await fetch(`/api/onderdelen/${o.id}`, { method: "DELETE", credentials: "include" })
      const data = await res.json()
      if (res.ok && data.success) {
        toast({ title: "Verwijderd", description: (o.artikelnummer || o.name) + " is verwijderd." })
        setOnderdelen((prev) => prev.filter((x) => x.id !== o.id))
      } else {
        toast({ title: "Fout", description: data.error || "Kon niet verwijderen", variant: "destructive" })
      }
    } catch {
      toast({ title: "Fout", description: "Netwerkfout", variant: "destructive" })
    } finally {
      setDeletingId(null)
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
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Onderdelen Beheren</h1>
                  <p className="text-sm text-gray-500">Zoeken naar onderdelen – beheer de voorraad</p>
                </div>
              </div>
            </div>
            <Link href="/admin/onderdelen/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nieuw Onderdeel
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Alle onderdelen ({onderdelen.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {onderdelen.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Nog geen onderdelen. Voeg er een toe om ze op /onderdelen te tonen.</p>
                <Link href="/admin/onderdelen/new">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Eerste onderdeel toevoegen
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-3 px-4">Afbeelding</th>
                      <th className="py-3 px-4">Omschrijving</th>
                      <th className="py-3 px-4">Onderdeelnr.</th>
                      <th className="py-3 px-4">Barcode</th>
                      <th className="py-3 px-4">Voorraad</th>
                      <th className="py-3 px-4">Waarde</th>
                      <th className="py-3 px-4">Categorie</th>
                      <th className="py-3 px-4">Prijs</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Acties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {onderdelen.map((o) => (
                      <tr key={o.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {o.image_url ? (
                            <img src={o.image_url} alt="" className="w-12 h-12 object-cover rounded" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium max-w-[200px] truncate" title={o.name}>
                          {o.name}
                        </td>
                        <td className="py-3 px-4 text-sm">{o.artikelnummer || "—"}</td>
                        <td className="py-3 px-4 text-sm font-mono">{o.barcode || "—"}</td>
                        <td className="py-3 px-4 text-sm">{o.voorraad != null ? o.voorraad : "—"}</td>
                        <td className="py-3 px-4 text-sm">{o.waarde != null ? `€ ${o.waarde.toLocaleString()}` : "—"}</td>
                        <td className="py-3 px-4 text-sm">{o.category || "—"}</td>
                        <td className="py-3 px-4">
                          {o.price != null ? `€ ${o.price.toLocaleString()}` : "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              o.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {o.is_active ? "Actief" : "Inactief"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/onderdelen/${o.id}/edit`}>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Pencil className="w-3.5 h-3.5" />
                                Bewerken
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50 gap-1"
                              disabled={deletingId === o.id}
                              onClick={() => handleDelete(o)}
                            >
                              {deletingId === o.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              Verwijderen
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
