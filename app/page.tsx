import Link from "next/link"
import { Phone, MapPin, Clock, Car, Shield, CheckCircle, Wrench, ChevronRight, Star, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/" />
      
      {/* Hero Section – lichtblauw, vloeiende overgang naar witte secties */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24 bg-sky-50">
        {/* Background image – lage opacity, zachte blend */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&q=80"
            alt="Auto werkplaats"
            className="w-full h-full object-cover opacity-[0.14]"
          />
          <div 
            className="absolute inset-0 mix-blend-multiply bg-sky-100/75"
            aria-hidden
          />
          {/* Zachte overgang van lichtblauw naar wit – match met rest van site */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-transparent to-white" aria-hidden />
        </div>

        {/* Hero content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-[100vw]">
          <div className="max-w-2xl text-gray-900 min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-sky-800 border border-sky-200/60 px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">APK via RDW-erkende partner</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance text-gray-900">
              Wij zijn uw auto specialist
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-xl">
              Autogarage Viorel is uw betrouwbare partner voor onderhoud, reparaties, 
              APK keuringen en kwaliteit occasions in Terneuzen en omgeving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/occasions">
                <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-8 w-full sm:w-auto">
                  Bekijk ons aanbod
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-2 border-sky-700 text-sky-800 hover:bg-sky-600 hover:text-white bg-white/70 backdrop-blur-sm w-full sm:w-auto">
                  Contact opnemen
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Stats Section – drie gelijke, symmetrische blokken */}
      <section className="bg-white py-8 sm:py-10 border-b overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 py-2">
              <div className="w-14 h-14 shrink-0 rounded-xl bg-sky-100 flex items-center justify-center">
                <Car className="w-7 h-7 text-sky-600" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Breed aanbod</div>
                <div className="text-gray-600 text-sm mt-0.5">Kwaliteit occasions</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 py-2">
              <div className="w-14 h-14 shrink-0 rounded-xl bg-sky-100 flex items-center justify-center">
                <Award className="w-7 h-7 text-sky-600" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-bold text-gray-900 leading-tight">15+ jaar</div>
                <div className="text-gray-600 text-sm mt-0.5">Ervaring in de regio</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 py-2">
              <div className="w-14 h-14 shrink-0 rounded-xl bg-sky-100 flex items-center justify-center">
                <Users className="w-7 h-7 text-sky-600" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Persoonlijk</div>
                <div className="text-gray-600 text-sm mt-0.5">Wij staan voor u klaar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="diensten" className="py-12 md:py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ons aanbod</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Van onderhoud tot verkoop - wij bieden complete automotive diensten
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {/* Occasions Card */}
            <Link href="/occasions" className="group">
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"
                    alt="Occasions"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white">Occasions</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">
                    Ontdek ons uitgebreide aanbod van kwaliteit occasions. 
                    Alle auto's zijn grondig gecontroleerd.
                  </p>
                  <span className="text-blue-600 font-semibold flex items-center">
                    Bekijk aanbod
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            {/* Werkplaats Card */}
            <Link href="/diensten" className="group">
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80"
                    alt="Werkplaats"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white">Werkplaats</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">
                    Professioneel onderhoud en reparaties voor alle automerken 
                    door ervaren monteurs.
                  </p>
                  <span className="text-blue-600 font-semibold flex items-center">
                    Meer informatie
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            {/* APK Card */}
            <Link href="/diensten" className="group">
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80"
                    alt="APK Keuring"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white">APK Keuring</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">
                    APK keuringen via onze RDW-erkende partner, met directe 
                    reparatiemogelijkheid bij afkeuring.
                  </p>
                  <span className="text-blue-600 font-semibold flex items-center">
                    APK plannen
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* USPs Section – lichtblauw */}
      <section className="py-12 md:py-16 bg-sky-100 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-900">Vaste prijzen</h4>
                <p className="text-sky-700 text-sm">Geen verrassingen achteraf</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-900">BOVAG garantie</h4>
                <p className="text-sky-700 text-sm">Op al onze occasions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-900">APK via partner</h4>
                <p className="text-sky-700 text-sm">Samenwerking met RDW-erkend station</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-900">Persoonlijke service</h4>
                <p className="text-sky-700 text-sm">Altijd bereikbaar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="over-ons" className="py-12 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="min-w-0 order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Over Autogarage Viorel</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Autogarage Viorel is een familiebedrijf dat al jaren actief is in de 
                automotive sector in Terneuzen. Wij zijn gespecialiseerd in de in- en 
                verkoop van auto's, onderhoud, reparaties en APK keuringen.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Ons motto "Eerlijk, betaalbaar, betrouwbaar" staat centraal in alles 
                wat wij doen. Bij ons staat persoonlijke service voorop en behandelen 
                wij elke klant met respect en professionaliteit.
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg min-w-0">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-0.5 sm:mb-1">15+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Jaar ervaring</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg min-w-0">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-0.5 sm:mb-1">1000+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Tevreden klanten</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg min-w-0">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-0.5 sm:mb-1">100%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Inzet</div>
                </div>
              </div>

              <Link href="/contact">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Neem contact op
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="relative min-w-0 order-1 lg:order-2">
              <div className="relative aspect-[4/3] min-h-[280px] w-full overflow-hidden rounded-2xl shadow-2xl bg-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/over-autogarage-viorel.png"
                  alt="Autogarage Viorel – gevel en uithangbord met diensten"
                  className="absolute inset-0 h-full w-full rounded-2xl object-cover"
                  width={800}
                  height={600}
                  loading="eager"
                />
              </div>
              <div className="absolute left-4 bottom-4 bg-blue-600 text-white p-4 rounded-xl shadow-xl z-10 max-w-[200px]">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                  <div>
                    <div className="text-2xl font-bold">4.9/5</div>
                    <div className="text-blue-100 text-sm">Klantbeoordeling</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Detail Section */}
      <section className="py-12 md:py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Onze diensten</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete automotive diensten onder één dak
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Onderhoud</h3>
                <p className="text-sm text-gray-600">Grote en kleine beurten voor alle merken</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">APK Keuring</h3>
                <p className="text-sm text-gray-600">Via RDW-erkende partner</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Occasions</h3>
                <p className="text-sm text-gray-600">Kwaliteit occasions met garantie</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <circle cx="12" cy="12" r="3" strokeWidth="2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Banden</h3>
                <p className="text-sm text-gray-600">Montage, balanceren en opslag</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Contact</h2>
              <p className="text-lg text-gray-600 mb-8">
                Heeft u vragen of wilt u een afspraak maken? Neem gerust contact met ons op!
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Adres</div>
                    <div className="text-gray-600">
                      Ambachtsstraat 1-A<br />
                      4538 AV Terneuzen
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Telefoon</div>
                    <a href="tel:+31618809802" className="text-blue-600 hover:underline">
                      +31 (6)18 80 98 02
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Openingstijden</div>
                    <div className="text-gray-600">
                      Maandag - Zaterdag: 09:00 - 17:00<br />
                      Zondag: Gesloten
                    </div>
                  </div>
                </div>
              </div>

              {/* Kaart */}
              <div className="mt-6 sm:mt-8 rounded-xl overflow-hidden shadow-lg min-h-[200px] sm:min-h-[250px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1922.0894993170316!2d3.845279449749082!3d51.30937381551679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c4804169494e63%3A0x3953f04c913435b6!2sAutobedrijf%20Viorel!5e1!3m2!1sen!2snl!4v1770891996736!5m2!1sen!2snl"
                  width="100%"
                  height="250"
                  style={{ border: 0, minHeight: 200 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Autogarage Viorel – Ambachtsstraat 1-A, 4538 AV Terneuzen"
                  className="w-full h-[200px] sm:h-[250px]"
                ></iframe>
              </div>
            </div>

            <div className="bg-gray-50 p-5 sm:p-8 rounded-2xl min-w-0">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900">Stuur ons een bericht</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefoon</label>
                  <Input type="tel" className="w-full bg-white" placeholder="Uw telefoonnummer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Onderwerp</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option>Algemene vraag</option>
                    <option>Occasions</option>
                    <option>Onderhoud / Reparatie</option>
                    <option>APK Keuring</option>
                    <option>Laswerk / Carrosserie</option>
                    <option>Auto verkopen</option>
                    <option>Anders</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bericht *</label>
                  <textarea
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Uw bericht..."
                  ></textarea>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-12">
                  Verstuur bericht
                </Button>
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
