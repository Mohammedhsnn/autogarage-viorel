"use client"

import { useState, useEffect } from "react"
import { Phone, Calendar, Clock, MapPin, CheckCircle, ChevronRight, Loader2 } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

const SERVICE_OPTIONS = [
  "APK Keuring",
  "Onderhoudsbeurt",
  "Onderhoud / Reparatie",
  "Laswerk / Carrosserie",
  "Olie verversen",
  "Import / Export",
  "Schokdempers / Uitlaten",
  "Trekhaak montage",
  "Occasion bekijken / proefrit",
  "Anders",
]

function getNextDays(count: number) {
  const out: string[] = []
  const d = new Date()
  for (let i = 0; i < count; i++) {
    d.setDate(d.getDate() + (i === 0 ? 0 : 1))
    const day = d.getDay()
    if (day >= 1 && day <= 6) out.push(d.toISOString().slice(0, 10))
  }
  return out
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00")
  return d.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" })
}

export default function AfspraakPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [date, setDate] = useState("")
  const [timeSlot, setTimeSlot] = useState("")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [form, setForm] = useState({
    service: "APK Keuring",
    name: "",
    email: "",
    phone: "",
    vehicle_info: "",
    notes: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const upcomingDates = getNextDays(60).filter((_, i) => i < 28)

  useEffect(() => {
    if (!date) {
      setAvailableSlots([])
      setTimeSlot("")
      return
    }
    setLoadingSlots(true)
    setError("")
    fetch(`/api/appointments?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.available) setAvailableSlots(data.available)
        else setAvailableSlots([])
        setTimeSlot("")
      })
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [date])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time_slot: timeSlot,
          service: form.service,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          vehicle_info: form.vehicle_info.trim() || undefined,
          notes: form.notes.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Er ging iets mis.")
        return
      }
      setSuccess(true)
    } catch {
      setError("Kon geen verbinding maken. Probeer het later opnieuw.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Header currentPage="/afspraak" />
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 px-4">
          <div className="container mx-auto max-w-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Afspraak gepland</h1>
            <p className="text-gray-600 mb-2">
              Uw afspraak op <strong>{formatDate(date)}</strong> om <strong>{timeSlot}</strong> is vastgelegd.
            </p>
            <p className="text-gray-600 mb-8">
              U ontvangt een bevestiging per e-mail. Wij zien u graag!
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="/">Terug naar home</a>
            </Button>
          </div>
        </section>
        <Footer />
        <FloatingActions />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/afspraak" />

      <section className="pt-28 sm:pt-32 pb-10 sm:pb-12 lg:pt-40 lg:pb-16 bg-gray-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="max-w-3xl min-w-0">
            <p className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full bg-white/10 mb-4">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              Plan direct uw afspraak
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
              Online afspraak maken
            </h1>
            <p className="text-base sm:text-lg text-gray-200 mb-6">
              Kies een datum en tijd, vul uw gegevens in en bevestig. Uw afspraak staat direct in onze agenda.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>Ma–Za: 09:00–17:00, Zo: gesloten</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Ambachtsstraat 1-A, 4538 AV Terneuzen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 lg:py-16 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="max-w-xl mx-auto min-w-0">
            {/* Stappen */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 text-sm">{error}</div>
            )}

            {step === 1 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Kies een datum</h2>
                  <p className="text-gray-600 text-sm mb-4">Selecteer een dag (maandag t/m zaterdag)</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {upcomingDates.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDate(d)}
                        className={`py-3 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
                          date === d ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                        }`}
                      >
                        {formatDate(d)}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!date}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Volgende
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Kies een tijd</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {date && formatDate(date)} – beschikbare tijden
                  </p>
                  {loadingSlots ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Laden...
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.length === 0 && date ? (
                        <p className="col-span-3 sm:col-span-4 text-gray-500 text-sm">Geen vrije tijden deze dag. Kies een andere datum.</p>
                      ) : (
                        availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setTimeSlot(slot)}
                            className={`py-2.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
                              timeSlot === slot ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                            }`}
                          >
                            {slot}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                  <div className="mt-6 flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Terug
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!timeSlot}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Volgende
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Uw gegevens</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {formatDate(date)} om {timeSlot}
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label>Soort afspraak *</Label>
                      <select
                        value={form.service}
                        onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-white"
                        required
                      >
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Naam *</Label>
                      <Input
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Volledige naam"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>E-mail *</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="uw@email.nl"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Telefoon *</Label>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="06 12345678"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Kenteken / type auto</Label>
                      <Input
                        value={form.vehicle_info}
                        onChange={(e) => setForm((f) => ({ ...f, vehicle_info: e.target.value }))}
                        placeholder="Bijv. AB-123-CD / VW Golf"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Opmerkingen</Label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        placeholder="Bijv. voorkeur ochtend, specifieke klacht..."
                        rows={3}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-white resize-none"
                      />
                    </div>
                    <div className="flex justify-between pt-2">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        Terug
                      </Button>
                      <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Afspraak bevestigen
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            Liever bellen? <a href="tel:+31618809802" className="text-blue-600 font-medium hover:underline">+31 (6)18 80 98 02</a>
          </p>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </div>
  )
}
