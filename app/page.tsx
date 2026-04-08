import Link from "next/link"
import { Phone, MapPin, Clock, Car, Shield, CheckCircle, Wrench, ChevronRight, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"
import { getCars, getPageContent } from "@/app/actions"
import HeroPhotoSlider from "@/components/HeroPhotoSlider"
import { mergeHomePageContent } from "@/lib/homepage-content"

// Zorg dat de homepage dynamisch blijft zodat CMS-wijzigingen (Supabase page_content) direct zichtbaar zijn.
export const dynamic = "force-dynamic"

export default async function HomePage() {
  const pageContent = await getPageContent("home")
  const c = mergeHomePageContent(pageContent ?? undefined)
  const h = c.hero
  const backgroundImageUrl = h.background_image_url
  const collageWideImageUrl = h.collage_wide_image_url
  const collageSquare1ImageUrl = h.collage_square_image_urls[0]
  const collageSquare2ImageUrl = h.collage_square_image_urls[1]

  // Mini occasions sectie: toon willekeurig 2-3 auto's uit de database
  let featuredCars: Array<any> = []
  try {
    const cars = await getCars({ status: "available" })
    const shuffled = [...(cars || [])].sort(() => Math.random() - 0.5)
    featuredCars = shuffled.slice(0, Math.min(3, Math.max(2, (shuffled?.length || 0) > 1 ? 3 : 2)))
  } catch {
    featuredCars = []
  }

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/" />
      
      {/* Hero Section – professioneel, rustig kleurgebruik */}
      <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-28 bg-slate-50 overflow-hidden">
        {/* Background image – subtiele donkerblauwe blend */}
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImageUrl}
            alt="Autogarage Viorel – werkplaats en gevel"
            className="w-full h-full object-cover opacity-[0.11] scale-105"
          />
          <div className="absolute inset-0 mix-blend-multiply bg-slate-200/70" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-100/80 via-slate-50/40 to-white" aria-hidden />
        </div>

        {/* Hero content – gecentreerd */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-[100vw] flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="grid lg:grid-cols-[460px_1fr] gap-10 items-start">
              <div className="max-w-2xl w-full text-center lg:text-left mx-auto lg:mx-0">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/95 px-3.5 py-2 mb-5 text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 ring-1 ring-blue-100">
                    <Shield className="w-3.5 h-3.5 flex-shrink-0 text-blue-700" />
                  </span>
                  <span className="text-sm font-semibold tracking-tight">{h.badge_text}</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4 leading-[1.08] tracking-tight text-slate-900 text-balance antialiased">
                  {h.headline_line1}
                  <span className="block text-blue-900">{h.headline_highlight}</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-700 mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0 whitespace-pre-line">
                  {h.intro}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-800">
                    <Wrench className="w-4 h-4 text-blue-700" />
                    <span>{h.bullet1}</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-800">
                    <CheckCircle className="w-4 h-4 text-blue-700" />
                    <span>{h.bullet2}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center lg:justify-start">
                  <Link href="/occasions">
                    <Button size="lg" className="bg-blue-900 hover:bg-blue-950 text-white px-8 shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto">
                      {h.cta_primary}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-2 border-slate-300 text-slate-800 hover:border-blue-900 hover:bg-blue-900 hover:text-white bg-white/95 backdrop-blur-sm shadow-sm w-full sm:w-auto">
                      {h.cta_secondary}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hero foto slider (voor desktop en mobile) */}
              <div className="order-2 lg:order-none w-full mt-10 lg:mt-0 lg:justify-self-center">
                <HeroPhotoSlider
                  slides={[
                    { src: collageWideImageUrl, alt: "Autogarage Viorel – werkplaats en gevel", caption: h.slider_caption_wide },
                    { src: collageSquare1ImageUrl, alt: "Autowerkplaats sfeerbeeld" },
                    { src: collageSquare2ImageUrl, alt: "Auto detail sfeerbeeld" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section – drie gelijke, symmetrische blokken */}
      <section className="bg-white py-8 sm:py-10 border-b overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
            {[
              { stat: c.stats[0], Icon: Car },
              { stat: c.stats[1], Icon: Award },
              { stat: c.stats[2], Icon: Users },
            ].map(({ stat, Icon }, i) => (
              <div key={i} className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 py-2">
                <div className="w-14 h-14 shrink-0 rounded-xl bg-sky-100 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-sky-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{stat.title}</div>
                  <div className="text-gray-600 text-sm mt-0.5">{stat.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="diensten" className="py-12 md:py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-4">{c.offer_section.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{c.offer_section.subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {c.offer_cards.map((card) => (
              <Link key={card.href + card.title} href={card.href} className="group">
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={card.image_url}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4">{card.description}</p>
                    <span className="text-blue-600 font-semibold flex items-center">
                      {card.cta}
                      <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mini occasions - willekeurig 2/3 auto's */}
      <section className="py-10 md:py-14 bg-white overflow-hidden border-b">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-2">{c.featured.title}</h2>
              <p className="text-gray-600 text-sm sm:text-base">{c.featured.subtitle}</p>
            </div>
            <Link href="/occasions">
              <Button variant="outline" className="border-sky-300 text-sky-700 hover:border-sky-400 hover:bg-sky-50">
                {c.featured.button_label}
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>

          {featuredCars.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-100 flex items-center justify-center mb-4">
                <Car className="w-6 h-6 text-sky-600" />
              </div>
              <p className="text-gray-700 font-medium mb-1">Nog geen occasions beschikbaar</p>
              <p className="text-gray-500 text-sm">Kom later nog eens terug.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredCars.map((car) => {
                const img = car.images?.[0]?.image_url || "/placeholder.svg"
                const priceText =
                  typeof car.price === "number"
                    ? `€ ${car.price?.toLocaleString("nl-NL")},-`
                    : "Prijs op aanvraag"

                return (
                  <Link key={car.id} href={`/occasions/${car.id}`} className="group">
                    <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="relative h-44 sm:h-40 overflow-hidden">
                        <img
                          src={img}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" aria-hidden />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white text-sm font-semibold">{priceText}</p>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {car.brand} {car.model}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {car.year} · {car.mileage?.toLocaleString("nl-NL")} km
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* USPs Section – lichtblauw */}
      <section className="py-12 md:py-16 bg-sky-100 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {c.usps.map((usp, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">{usp.title}</h4>
                  <p className="text-sky-700 text-sm">{usp.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="over-ons" className="py-12 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 mb-4 sm:mb-6">
              {c.about.title}
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">{c.about.paragraph1}</p>
            <p className="text-gray-600 mb-8 leading-relaxed">{c.about.paragraph2}</p>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8 max-w-xl mx-auto">
              {c.about.stats.map((s, i) => (
                <div key={i} className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg min-w-0">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-0.5 sm:mb-1">{s.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {c.about.cta}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Detail Section */}
      <section className="py-12 md:py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-4">{c.services_detail.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{c.services_detail.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.services_detail.items.map((item, idx) => {
              const icons = [
                <Wrench key="i" className="w-8 h-8 text-blue-600" />,
                <Shield key="i" className="w-8 h-8 text-blue-600" />,
                <Car key="i" className="w-8 h-8 text-blue-600" />,
                <svg key="i" className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" strokeWidth="2" />
                </svg>,
              ]
              return (
                <Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">{icons[idx]}</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 mb-4 sm:mb-6">{c.contact_block.title}</h2>
              <p className="text-lg text-gray-600 mb-8">{c.contact_block.intro}</p>

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
