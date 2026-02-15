"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Loader2, Phone, Mail } from "lucide-react"
import Link from "next/link"

interface Appointment {
  id: number
  appointment_date: string
  time_slot: string
  service: string
  name: string
  email: string
  phone: string
  vehicle_info: string | null
  notes: string | null
  status: string
  created_at: string
}

export default function AdminAppointmentsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin-logged-in")
    if (!loggedIn) router.push("/admin")
    else setIsLoggedIn(true)
  }, [router])

  useEffect(() => {
    if (!isLoggedIn) return
    loadAppointments()
  }, [isLoggedIn, from, to])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (from) params.set("from", from)
      if (to) params.set("to", to)
      const res = await fetch(`/api/appointments?${params.toString()}`, { credentials: "include" })
      const data = await res.json()
      if (data.success && Array.isArray(data.appointments)) {
        setAppointments(data.appointments)
      } else {
        setAppointments([])
      }
    } catch {
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (id: number) => {
    if (!confirm("Afspraak annuleren? De klant kan dit tijdvak opnieuw boeken.")) return
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "cancelled" }),
      })
      if (res.ok) await loadAppointments()
    } catch {
      alert("Kon afspraak niet annuleren")
    }
  }

  const formatDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" })

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
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Afspraken</h1>
                  <p className="text-sm text-gray-500">Online boekingen beheren</p>
                </div>
              </div>
            </div>
            <Link href="/afspraak" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">Bekijk boekingspagina</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vanaf datum</label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tot datum</label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <Button variant="outline" onClick={loadAppointments}>Filter</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Afspraken ({appointments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Geen afspraken in deze periode.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-600">
                      <th className="py-3 px-4">Datum</th>
                      <th className="py-3 px-4">Tijd</th>
                      <th className="py-3 px-4">Dienst</th>
                      <th className="py-3 px-4">Klant</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Actie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{formatDate(a.appointment_date)}</td>
                        <td className="py-3 px-4">{a.time_slot}</td>
                        <td className="py-3 px-4">{a.service}</td>
                        <td className="py-3 px-4">
                          {a.name}
                          {a.vehicle_info && <span className="block text-xs text-gray-500">{a.vehicle_info}</span>}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <a href={`mailto:${a.email}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                            <Mail className="w-4 h-4" />{a.email}
                          </a>
                          <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="flex items-center gap-1 text-gray-600">
                            <Phone className="w-4 h-4" />{a.phone}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            a.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}>
                            {a.status === "cancelled" ? "Geannuleerd" : "Gepland"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {a.status !== "cancelled" && (
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => cancelAppointment(a.id)}>
                              Annuleren
                            </Button>
                          )}
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
