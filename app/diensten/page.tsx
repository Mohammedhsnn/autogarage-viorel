import {
  Phone,
  CheckCircle,
  Calendar,
  Settings,
  Shield,
  Wrench,
  Car,
  Battery,
  Cog,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"
import Link from "next/link"
import { getPageContent } from "@/app/actions"
import { mergeDienstenContent } from "@/lib/diensten-content"

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Shield,
  Car,
  Battery,
  Cog,
  Settings,
}

/* Eén kleur op de pagina: lichtblauw */
const iconBg = "bg-sky-500"
const iconBgLight = "bg-sky-100"
const textColor = "text-sky-600"
const badgeBg = "bg-sky-100 text-sky-700"
const buttonBg = "bg-sky-500 hover:bg-sky-600"

export const dynamic = "force-dynamic"

export default async function DienstenPage() {
  const pageContent = await getPageContent("diensten")
  const cms = mergeDienstenContent(pageContent)

  const HERO = cms.hero
  const MAIN_SECTION = cms.main_section
  const ADDITIONAL_SECTION = cms.additional_section
  const HOW_WE_WORK = cms.how_we_work
  const PRICING_SECTION = cms.pricing_section
  const MAIN_SERVICES = cms.main_services
  const ADDITIONAL_SERVICES = cms.additional_services
  const PRICING_CARDS = cms.pricing_cards

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/diensten" />

      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-12 sm:pb-16 lg:pt-44 lg:pb-24 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&q=80"
            alt="Werkplaats"
            className="w-full h-full object-cover opacity-35 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-[100vw] flex justify-center">
          <div className="max-w-3xl w-full text-center min-w-0 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-sky-500/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">{HERO.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6 text-balance leading-[1.08] antialiased">
              {HERO.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl mx-auto">
              {HERO.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+31618809802">
                <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white w-full sm:w-auto shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <Phone className="w-5 h-5 mr-2" />
                  {HERO.cta_primary}
                </Button>
              </a>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 bg-transparent w-full sm:w-auto"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {HERO.cta_secondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hoofddiensten – 3 gelijke cards, lichtblauw */}
      <section className="py-10 sm:py-16 lg:py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 mb-4">{MAIN_SECTION.title}</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              {MAIN_SECTION.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {MAIN_SERVICES.map((s, idx) => {
              const Icon = iconMap[s.icon_name] || Settings
              return (
                <Card
                  key={s.id}
                  className="group flex flex-col border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <CardContent className="p-8 flex flex-col flex-1">
                    <div className={`${iconBg} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{s.name}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed flex-1">{s.description}</p>
                    <div className="space-y-3 mb-6">
                      {s.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                          <span className="text-gray-700">{f}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={
                        s.button_text === "Afspraak maken" || s.button_text === "APK laten keuren"
                          ? "/afspraak"
                          : s.button_text === "Contact opnemen"
                            ? "/contact"
                            : `/diensten/${s.slug}`
                      }
                      className="mt-auto"
                    >
                      <Button className={`w-full ${buttonBg} text-white font-medium transition-colors`}>
                        {s.button_text}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Aanvullende services – lichtblauw */}
      <section className="py-10 sm:py-16 lg:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 mb-4">{ADDITIONAL_SECTION.title}</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              {ADDITIONAL_SECTION.subtitle}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {ADDITIONAL_SERVICES.map((s, idx) => {
              const Icon = iconMap[s.icon_name] || Settings
              return (
                <Card
                  key={s.id}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-0 shadow-md animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`${iconBgLight} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-7 h-7 ${textColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">{s.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{s.description}</p>
                    {s.price_label && (
                      <Badge variant="secondary" className={badgeBg}>
                        {s.price_label}
                      </Badge>
                    )}
                    <Link href={`/diensten/${s.slug}`} className="inline-block mt-4">
                      <Button variant="outline" size="sm" className="border-sky-300 text-sky-600 hover:bg-sky-50 hover:border-sky-400">
                        Meer info
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Hoe wij werken – lichtblauwe stappen */}
      <section className="py-10 sm:py-16 lg:py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 mb-4">{HOW_WE_WORK.title}</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              {HOW_WE_WORK.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {HOW_WE_WORK.steps.map((step, i) => (
              <div key={step.number} className="text-center animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="bg-sky-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-transform duration-300 hover:scale-110">
                  <span className="text-white text-2xl font-bold">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparante prijzen – 3 gelijke cards, lichtblauw */}
      <section className="py-10 sm:py-16 lg:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 mb-4">{PRICING_SECTION.title}</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              {PRICING_SECTION.subtitle}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {PRICING_CARDS.map((s, idx) => {
              const isPopular = s.badge_text?.toLowerCase().includes("populair")
              return (
                <Card
                  key={s.id}
                  className={`border-2 transition-all duration-300 relative flex flex-col hover:-translate-y-1 animate-fade-in ${
                    isPopular ? "border-sky-300 bg-sky-50/50" : "border-gray-200 hover:border-sky-300"
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {isPopular && s.badge_text && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-sky-500 text-white px-4 py-1">{s.badge_text}</Badge>
                    </div>
                  )}
                  <CardContent className="p-8 text-center flex flex-col flex-1">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">{s.name}</h3>
                    <ul className="space-y-3 mb-8 text-left flex-1">
                      {s.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                          <span className="text-gray-700">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={
                        s.button_text === "Afspraak maken"
                          ? "/afspraak"
                          : isPopular || s.button_text === "Contact opnemen"
                            ? "/contact"
                            : `/diensten/${s.slug}`
                      }
                      className="mt-auto"
                    >
                      <Button className={`w-full ${buttonBg} text-white`}>{s.button_text}</Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </div>
  )
}
