import {
  Phone,
  Wrench,
  Car,
  Shield,
  CheckCircle,
  Calendar,
  Settings,
  Battery,
  Gauge,
  Cog,
  Wind,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"
import { supabaseAdmin } from "@/lib/supabase"

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Shield,
  Car,
  Battery,
  Wind,
  Gauge,
  Cog,
  Settings,
}

const iconBg: Record<string, string> = {
  blue: "bg-blue-600",
  green: "bg-green-600",
  orange: "bg-orange-500",
  red: "bg-red-600",
  purple: "bg-purple-600",
  gray: "bg-gray-600",
}

const iconBgLight: Record<string, string> = {
  blue: "bg-blue-100",
  green: "bg-green-100",
  orange: "bg-orange-100",
  red: "bg-red-100",
  purple: "bg-purple-100",
  gray: "bg-gray-100",
}

const textColor: Record<string, string> = {
  blue: "text-blue-600",
  green: "text-green-600",
  orange: "text-orange-600",
  red: "text-red-600",
  purple: "text-purple-600",
  gray: "text-gray-600",
}

const badgeBg: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
  gray: "bg-gray-100 text-gray-700",
}

const buttonBg: Record<string, string> = {
  blue: "bg-blue-600 hover:bg-blue-700",
  green: "bg-green-600 hover:bg-green-700",
  orange: "bg-orange-500 hover:bg-orange-600",
  red: "bg-red-600 hover:bg-red-700",
  purple: "bg-purple-600 hover:bg-purple-700",
  gray: "bg-gray-600 hover:bg-gray-700",
}

type Service = {
  id: number
  name: string
  description: string | null
  category: string
  price: number | null
  price_label: string | null
  icon_name: string | null
  icon_color: string | null
  features: string[] | null
  badge_text: string | null
  badge_color: string | null
  button_text: string | null
  button_color: string | null
  is_pricing_card: boolean
  sort_order: number
  is_active: boolean
}

async function getServices() {
  try {
    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
    if (error) return { main: [], additional: [], pricing: [] }
    const list = (data || []) as Service[]
    return {
      main: list.filter((s) => s.category === "main" && !s.is_pricing_card),
      additional: list.filter((s) => s.category === "additional" && !s.is_pricing_card),
      pricing: list.filter((s) => s.is_pricing_card),
    }
  } catch {
    return { main: [], additional: [], pricing: [] }
  }
}

export default async function DienstenPage() {
  const { main, additional, pricing } = await getServices()

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/diensten" />

      {/* Hero */}
      <section className="relative pt-36 pb-16 lg:pt-40 lg:pb-20 bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&q=80"
            alt="Werkplaats"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Professionele autoservice</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-balance">
              Onze Diensten
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
              Van preventief onderhoud tot complexe reparaties – bij Autogarage Viorel bent u
              verzekerd van vakkundig werk, eerlijke prijzen en persoonlijke service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+31188809802">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                  <Phone className="w-5 h-5 mr-2" />
                  Bel voor advies
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 bg-transparent w-full sm:w-auto"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Plan een afspraak
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hoofddiensten (uit database) */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Onze Hoofddiensten</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Wij bieden een compleet pakket aan autoservices, van dagelijks onderhoud tot
              specialistische reparaties.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {main.map((s) => {
              const Icon = iconMap[s.icon_name || ""] || Settings
              const bg = iconBg[s.icon_color || "blue"] || iconBg.blue
              const btn = buttonBg[s.button_color || "blue"] || buttonBg.blue
              const badgeCls = badgeBg[s.badge_color || "blue"] || badgeBg.blue
              return (
                <Card key={s.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div
                      className={`${bg} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{s.name}</h3>
                    {s.description && (
                      <p className="text-gray-600 mb-6 leading-relaxed">{s.description}</p>
                    )}
                    {s.features && s.features.length > 0 && (
                      <div className="space-y-3 mb-6">
                        {s.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {(s.price_label || s.badge_text) && (
                      <div className="flex items-center gap-2 mb-6 flex-wrap">
                        {s.price_label && (
                          <Badge variant="secondary" className={badgeCls}>
                            {s.price_label}
                          </Badge>
                        )}
                        {s.badge_text && (
                          <Badge variant="secondary" className={badgeCls}>
                            {s.badge_text}
                          </Badge>
                        )}
                      </div>
                    )}
                    <Button className={`w-full ${btn} text-white font-medium`}>
                      {s.button_text || "Meer informatie"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Aanvullende services (uit database) */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Aanvullende Services</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Naast onze hoofddiensten bieden wij ook gespecialiseerde services voor uw auto.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {additional.map((s) => {
              const Icon = iconMap[s.icon_name || ""] || Settings
              const bgLight = iconBgLight[s.icon_color || "blue"] || iconBgLight.blue
              const txt = textColor[s.icon_color || "blue"] || textColor.blue
              const badgeCls = badgeBg[s.icon_color || "blue"] || badgeBg.blue
              return (
                <Card key={s.id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`${bgLight} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className={`w-7 h-7 ${txt}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">{s.name}</h3>
                    {s.description && (
                      <p className="text-gray-600 text-sm mb-4">{s.description}</p>
                    )}
                    {s.price_label && (
                      <Badge variant="secondary" className={badgeCls}>
                        {s.price_label}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Hoe wij werken (statisch) */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Hoe wij werken</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Ons werkproces is transparant, efficiënt en altijd gericht op uw tevredenheid.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Afspraak maken</h3>
              <p className="text-gray-600">
                Bel ons of maak online een afspraak op een moment dat u uitkomt.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Diagnose & Offerte</h3>
              <p className="text-gray-600">
                Wij onderzoeken uw auto en geven een duidelijke, transparante offerte.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Vakkundig werk</h3>
              <p className="text-gray-600">
                Na uw goedkeuring voeren wij het werk vakkundig en zorgvuldig uit.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gray-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Oplevering</h3>
              <p className="text-gray-600">
                Uw auto wordt opgeleverd met garantie en uitleg over het uitgevoerde werk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparante prijzen (uit database) */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Transparante Prijzen</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Geen verrassingen achteraf. Onze prijzen zijn helder en eerlijk.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {pricing.map((s) => {
              const priceDisplay =
                s.price_label || (s.price != null ? `€${(s.price / 100).toFixed(2)}` : "Op aanvraag")
              const btn = buttonBg[s.button_color || "blue"] || buttonBg.blue
              const txt = textColor[s.button_color || "blue"] || textColor.blue
              const isPopular = s.badge_text?.toLowerCase().includes("populair")
              return (
                <Card
                  key={s.id}
                  className={`border-2 transition-colors relative ${
                    isPopular ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {isPopular && s.badge_text && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">{s.badge_text}</Badge>
                    </div>
                  )}
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{s.name}</h3>
                    <div className={`text-4xl font-bold mb-6 ${txt}`}>{priceDisplay}</div>
                    {s.features && s.features.length > 0 && (
                      <ul className="space-y-3 mb-8 text-left">
                        {s.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button className={`w-full ${btn} text-white`}>
                      {s.button_text || "Afspraak maken"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">Heeft u vragen over onze diensten?</h2>
              <p className="text-blue-100 text-lg">
                Neem gerust contact met ons op voor advies of een vrijblijvende offerte.
              </p>
            </div>
            <div className="flex gap-4">
              <a href="tel:+31188809802">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Phone className="w-5 h-5 mr-2" />
                  Bel ons
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Afspraak maken
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </div>
  )
}
