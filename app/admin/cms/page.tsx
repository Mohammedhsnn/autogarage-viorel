"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home, Loader2, FileText, Wrench, LayoutTemplate } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSiteInhoudHubPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin-logged-in")
    if (!loggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
  }, [router])

  if (!isLoggedIn) {
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  Terug naar dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LayoutTemplate className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-gray-900 truncate">CMS Site inhoud</h1>
                  <p className="text-sm text-gray-500 truncate">Kies wat u wilt bewerken</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
          Beheer de teksten en afbeeldingen van de homepagina, of pas de inhoud van individuele diensten-subpagina’s aan.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/admin/homepage" className="block group">
            <Card className="h-full border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Startpagina</span>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-800 transition-colors">Homepagina beheren</CardTitle>
                <CardDescription>
                  Hero, teksten, statistieken, kaarten “Ons aanbod”, USP’s, over-ons-blok, diensten en contactintro. Inclusief hero-foto’s.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-blue-600 font-medium text-sm inline-flex items-center gap-1">
                  Open editor
                  <span aria-hidden>→</span>
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/diensten-subpages-cms" className="block group">
            <Card className="h-full border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-slate-700" />
                  </div>
                  <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Diensten</span>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-800 transition-colors">Subpagina’s beheren</CardTitle>
                <CardDescription>
                  Per dienstpagina (APK, banden, werkplaats, enz.): titels en lopende tekst zoals op de publieke site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-blue-600 font-medium text-sm inline-flex items-center gap-1">
                  Bekijk alle subpagina’s
                  <span aria-hidden>→</span>
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className="border-dashed border-gray-300 bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" />
              Snelle links
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" type="button">
                Website bekijken
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm" type="button">
                Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
