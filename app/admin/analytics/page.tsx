"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3, Eye, Loader2, TrendingUp } from "lucide-react"
import Link from "next/link"

interface AnalyticsStats {
  total: number
  today: number
  thisWeek: number
}

interface PathCount {
  path: string
  views: number
}

interface WeekdayStat {
  dayIndex: number
  day: string
  views: number
  percentage: number
}

export default function AdminAnalyticsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [topPaths, setTopPaths] = useState<PathCount[]>([])
  const [weekdayStats, setWeekdayStats] = useState<WeekdayStat[]>([])
  const [weekdayWindowDays, setWeekdayWindowDays] = useState<number>(60)
  const [peakWeekday, setPeakWeekday] = useState<WeekdayStat | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin-logged-in")
    if (!loggedIn) router.push("/admin")
    else setIsLoggedIn(true)
  }, [router])

  useEffect(() => {
    if (!isLoggedIn) return
    loadStats()
  }, [isLoggedIn])

  const loadStats = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/analytics", { credentials: "include" })
      const data = await res.json()
      if (data.success && data.stats) {
        setStats(data.stats)
        setTopPaths(data.topPaths || [])
        setWeekdayStats(data.weekdayStats || [])
        setWeekdayWindowDays(data.weekdayWindowDays || 60)
        setPeakWeekday(data.peakWeekday || null)
      } else {
        setStats({ total: 0, today: 0, thisWeek: 0 })
        setTopPaths([])
        setWeekdayStats([])
        setPeakWeekday(null)
      }
    } catch {
      setStats({ total: 0, today: 0, thisWeek: 0 })
      setTopPaths([])
      setWeekdayStats([])
      setPeakWeekday(null)
    } finally {
      setLoading(false)
    }
  }

  const formatPath = (path: string) => (path === "/" ? "Home" : path)

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
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
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
                  <p className="text-sm text-gray-500">Bezoekersstatistieken van uw website</p>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={loadStats} disabled={loading}>
              Vernieuwen
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Paginaweergaven vandaag</p>
                      <p className="text-3xl font-bold text-gray-900">{stats?.today ?? 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-sky-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Deze week</p>
                      <p className="text-3xl font-bold text-gray-900">{stats?.thisWeek ?? 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-sky-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Totaal (alle tijd)</p>
                      <p className="text-3xl font-bold text-gray-900">{stats?.total ?? 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-sky-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Meest bekeken pagina&apos;s (afgelopen 7 dagen)</CardTitle>
              </CardHeader>
              <CardContent>
                {topPaths.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center">Nog geen data. Bezoekers worden geteld zodra iemand uw site bezoekt.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-sm text-gray-600">
                          <th className="py-3 px-4">Pagina</th>
                          <th className="py-3 px-4">Weergaven</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPaths.map(({ path, views }) => (
                          <tr key={path} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{formatPath(path)}</td>
                            <td className="py-3 px-4">{views}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Bezoek per weekdag</CardTitle>
                <p className="text-sm text-gray-500">
                  Inzicht over de laatste {weekdayWindowDays} dagen. Zo ziet u welke dagen het vaakst bekeken worden.
                </p>
              </CardHeader>
              <CardContent>
                {weekdayStats.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center">Nog geen weekdagdata beschikbaar.</p>
                ) : (
                  <div className="space-y-3">
                    {weekdayStats
                      .slice()
                      .sort((a, b) => b.views - a.views)
                      .map((row) => (
                        <div key={row.day} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-800">{row.day}</span>
                            <span className="text-gray-600">
                              {row.views} weergaven ({row.percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sky-500 rounded-full"
                              style={{ width: `${Math.max(row.percentage, row.views > 0 ? 4 : 0)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {peakWeekday ? (
                  <div className="mt-6 rounded-lg bg-sky-50 border border-sky-100 p-4 text-sm text-sky-900">
                    Drukste dag: <span className="font-semibold">{peakWeekday.day}</span> met{" "}
                    <span className="font-semibold">{peakWeekday.views}</span> weergaven in de laatste {weekdayWindowDays} dagen.
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
