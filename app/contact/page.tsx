import Link from "next/link"
import { Phone, MapPin, Clock, Mail, MessageCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/contact" />

      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-12 sm:pb-16 lg:pt-40 lg:pb-20 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-[100vw]">
          <div className="max-w-2xl min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4 sm:mb-6">
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Wij staan voor u klaar</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Contact
            </h1>
            <p className="text-base sm:text-lg text-gray-300">
              Heeft u vragen, wilt u een afspraak maken of meer weten over onze diensten? 
              Neem gerust contact op – per telefoon, e-mail of via het formulier.
            </p>
          </div>
        </div>
      </section>

      {/* Contactgegevens – kaarten */}
      <section className="py-10 sm:py-12 lg:py-16 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Adres</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ambachtsstraat 1-A<br />
                  4538 AV Terneuzen
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Autobedrijf+Viorel+Ambachtsstraat+1-A+Terneuzen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-blue-600 hover:underline"
                >
                  Route plannen
                  <ChevronRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Telefoon</h3>
                <a href="tel:+31618809802" className="text-blue-600 font-medium hover:underline">
                  +31 (6)18 80 98 02
                </a>
                <p className="text-gray-500 text-sm mt-2">Bel voor vragen of een afspraak</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">E-mail</h3>
                <a href="mailto:popes16@kpnmail.nl" className="text-blue-600 font-medium hover:underline break-all">
                  popes16@kpnmail.nl
                </a>
                <p className="text-gray-500 text-sm mt-2">Wij reageren zo snel mogelijk</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Openingstijden</h3>
                <div className="text-gray-600 text-sm space-y-1">
                  <p>Maandag – Zaterdag: 09:00 – 17:00</p>
                  <p>Zondag: Gesloten</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kaart + formulier */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="order-2 lg:order-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Waar u ons vindt</h2>
              <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-gray-200 min-h-[250px] sm:min-h-[320px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1922.0894993170316!2d3.845279449749082!3d51.30937381551679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c4804169494e63%3A0x3953f04c913435b6!2sAutobedrijf%20Viorel!5e1!3m2!1sen!2snl!4v1770891996736!5m2!1sen!2snl"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 250 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Autogarage Viorel – Ambachtsstraat 1-A, 4538 AV Terneuzen"
                  className="w-full h-[250px] sm:h-[320px]"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2 min-w-0">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-5 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Stuur ons een bericht</h2>
                  <p className="text-gray-600 mb-6">
                    Vul het formulier in en wij nemen zo snel mogelijk contact met u op.
                  </p>
                  <form className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Voornaam *</label>
                        <Input type="text" className="w-full bg-gray-50" placeholder="Uw voornaam" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Achternaam *</label>
                        <Input type="text" className="w-full bg-gray-50" placeholder="Uw achternaam" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                      <Input type="email" className="w-full bg-gray-50" placeholder="uw@email.nl" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefoon</label>
                      <Input type="tel" className="w-full bg-gray-50" placeholder="Uw telefoonnummer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Onderwerp</label>
                      <select
                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        defaultValue=""
                      >
                        <option value="">Selecteer onderwerp</option>
                        <option>Algemene vraag</option>
                        <option>Occasions</option>
                        <option>Onderhoud / Reparatie</option>
                        <option>APK Keuring</option>
                        <option>Laswerk / Carrosserie</option>
                        <option>Onderdelen</option>
                        <option>Auto verkopen</option>
                        <option>Anders</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bericht *</label>
                      <textarea
                        rows={4}
                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder="Uw bericht..."
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-12 text-base">
                      Verstuur bericht
                    </Button>
                  </form>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Liever direct bellen?{" "}
                    <a href="tel:+31618809802" className="text-blue-600 font-medium hover:underline">
                      +31 (6)18 80 98 02
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Afspraak */}
      <section className="py-10 sm:py-12 bg-white border-t overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw] text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Direct een afspraak plannen?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Vul ons afspraakformulier in met uw wensen; wij nemen contact op om de afspraak te bevestigen.
          </p>
          <Link href="/afspraak">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Afspraak maken
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </div>
  )
}
