import { Phone, Calendar, Clock, MapPin } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AfspraakPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/afspraak" />

      {/* Hero */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full bg-white/10 mb-4">
              <Calendar className="w-4 h-4" />
              Plan eenvoudig online een afspraak
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Afspraak maken bij Autogarage Viorel
            </h1>
            <p className="text-base sm:text-lg text-gray-200 mb-6">
              Vul hieronder uw gegevens en wensen in, dan nemen wij zo snel mogelijk contact met u op
              om de afspraak definitief te bevestigen.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+31 (0)18 80 98 02</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Ma–Vr: 08:00–17:00, Za: 09:00–15:00</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Ambachtsstraat 1-A, 4538 AV Terneuzen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Afspraakformulier */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Plan direct uw afspraak
              </h2>
              <p className="text-gray-600 mb-6">
                Geef aan met welke auto u komt, voor welke dienst u een afspraak wilt maken en wanneer het
                u ongeveer uitkomt. Wij controleren onze planning en bevestigen de afspraak telefonisch of
                per e-mail.
              </p>
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                  <p>Alle merken en typen auto&apos;s zijn welkom.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                  <p>Voor spoed of dezelfde dag kunt u het beste even bellen.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                  <p>Uw gegevens worden alleen gebruikt om contact met u op te nemen over de afspraak.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Afspraakformulier</h3>
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Voornaam *</label>
                    <Input type="text" className="w-full bg-white" placeholder="Uw voornaam" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Achternaam *</label>
                    <Input type="text" className="w-full bg-white" placeholder="Uw achternaam" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                  <Input type="email" className="w-full bg-white" placeholder="uw@email.nl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefoon *</label>
                  <Input type="tel" className="w-full bg-white" placeholder="Uw telefoonnummer" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kenteken / type auto *
                    </label>
                    <Input type="text" className="w-full bg-white" placeholder="Bijv. AB-123-CD / VW Golf" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voorkeursdatum
                    </label>
                    <Input type="date" className="w-full bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soort afspraak *</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option>APK Keuring</option>
                    <option>Onderhoudsbeurt</option>
                    <option>Onderhoud / Reparatie</option>
                    <option>Olie verversen</option>
                    <option>Import / Export</option>
                    <option>Schokdempers / Uitlaten</option>
                    <option>Trekhaak montage</option>
                    <option>Occasion bekijken / proefrit</option>
                    <option>Anders</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Toelichting op de werkzaamheden
                  </label>
                  <textarea
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Bijvoorbeeld: geluid bij remmen, grote beurt gewenst, voorkeur voor ochtend/middag..."
                  ></textarea>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-12">
                  Afspraakaanvraag versturen
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Dit formulier stuurt nog geen definitieve boeking. Wij nemen contact met u op om de afspraak te
                  bevestigen of een ander moment voor te stellen.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </div>
  )
}

