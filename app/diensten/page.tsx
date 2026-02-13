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

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Shield,
  Car,
  Battery,
  Cog,
  Settings,
}

const iconBg: Record<string, string> = {
  blue: "bg-blue-600",
  green: "bg-green-600",
  orange: "bg-orange-500",
}

const iconBgLight: Record<string, string> = {
  blue: "bg-blue-100",
  green: "bg-green-100",
  orange: "bg-orange-100",
}

const textColor: Record<string, string> = {
  blue: "text-blue-600",
  green: "text-green-600",
  orange: "text-orange-600",
}

const badgeBg: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  orange: "bg-orange-100 text-orange-700",
}

const buttonBg: Record<string, string> = {
  blue: "bg-blue-600 hover:bg-blue-700",
  green: "bg-green-600 hover:bg-green-700",
  orange: "bg-orange-500 hover:bg-orange-600",
}

/* ----- Statische content (geen database) ----- */

const HERO = {
  badge: "Professionele autoservice",
  title: "Onze Diensten",
  subtitle:
    "Van preventief onderhoud tot complexe reparaties – bij Autogarage Viorel bent u verzekerd van vakkundig werk, eerlijke prijzen en persoonlijke service in Terneuzen.",
  cta_primary: "Bel voor advies",
  cta_secondary: "Plan een afspraak",
}

const MAIN_SECTION = {
  title: "Onze Hoofddiensten",
  subtitle:
    "Wij bieden een compleet pakket aan autoservices, van dagelijks onderhoud tot specialistische reparaties. Alle merken welkom.",
}

const ADDITIONAL_SECTION = {
  title: "Aanvullende Services",
  subtitle: "Naast onze hoofddiensten bieden wij ook gespecialiseerde services voor uw auto.",
}

const HOW_WE_WORK = {
  title: "Hoe wij werken",
  subtitle: "Ons werkproces is transparant, efficiënt en altijd gericht op uw tevredenheid.",
  steps: [
    {
      number: 1,
      title: "Afspraak maken",
      description: "Bel ons op +31 (0)18 80 98 02 of kom langs op Ambachtsstraat 1-A op een moment dat u uitkomt.",
    },
    {
      number: 2,
      title: "Diagnose & Offerte",
      description: "Wij onderzoeken uw auto en geven een duidelijke, transparante offerte. Geen verrassingen achteraf.",
    },
    {
      number: 3,
      title: "Vakkundig werk",
      description: "Na uw goedkeuring voeren wij het werk vakkundig en zorgvuldig uit met kwaliteitsonderdelen.",
    },
    {
      number: 4,
      title: "Oplevering",
      description: "Uw auto wordt opgeleverd met garantie en uitleg over het uitgevoerde werk.",
    },
  ],
}

const PRICING_SECTION = {
  title: "Transparante Prijzen",
  subtitle: "Geen verrassingen achteraf. Onze prijzen zijn helder en eerlijk. Vraag gerust een offerte aan.",
}

const MAIN_SERVICES = [
  {
    id: "apk",
    name: "APK Keuring",
    description:
      "Bij Autogarage Viorel kunt u terecht voor uw periodieke APK-keuring. Wij zijn een RDW-erkend keuringsstation en voeren de keuring vakkundig en transparant uit.",
    icon_name: "Shield",
    icon_color: "blue",
    features: [
      "RDW-erkend keuringsstation",
      "Snelle afhandeling, vaak dezelfde dag nog mogelijk",
      "Transparante prijzen",
      "Uitleg bij eventuele gebreken en advies voor reparatie",
    ],
    price_label: "Vanaf € 45",
    button_text: "APK laten keuren",
    button_color: "blue",
    slug: "apk-service",
  },
  {
    id: "onderhoudsbeurt",
    name: "Onderhoudsbeurt",
    description:
      "Regelmatig onderhoud verlengt de levensduur van uw auto. Wij voeren kleine en grote beurten uit volgens het onderhoudsschema van de fabrikant. Alle merken welkom.",
    icon_name: "Settings",
    icon_color: "green",
    features: [
      "Kleine en grote onderhoudsbeurten",
      "Volgens fabrikant-specificaties",
      "Olie- en filtervervanging inbegrepen",
      "Controle van remmen, banden en vloeistoffen",
    ],
    price_label: "Prijs op aanvraag",
    button_text: "Afspraak maken",
    button_color: "green",
    slug: "onderhoudsbeurt",
  },
  {
    id: "onderhoud-herstel",
    name: "Onderhoud & Herstel",
    description:
      "Van kleine reparaties tot grotere herstelwerkzaamheden: wij pakken het vakkundig aan. Eerlijke prijzen en duidelijke communicatie.",
    icon_name: "Wrench",
    icon_color: "orange",
    features: [
      "Algemene reparaties en herstel",
      "Remmen, ophanging en uitlaat",
      "Elektrische en elektronische storingen",
      "Transparante offerte vooraf",
    ],
    button_text: "Meer informatie",
    button_color: "orange",
    slug: "onderhoud-herstel",
  },
  {
    id: "reparatie",
    name: "Reparatie & Vervanging",
    description:
      "Storing, lampje op het dashboard of een kapot onderdeel? Wij diagnosticeren het probleem en voeren de reparatie uit. Eerlijk advies, geen onnodige werkzaamheden.",
    icon_name: "Cog",
    icon_color: "blue",
    features: [
      "Diagnose met professionele apparatuur",
      "Reparatie aan motor, remmen, ophanging en meer",
      "Onderdelen van betrouwbare leveranciers",
      "Garantie op uitgevoerde werkzaamheden",
    ],
    button_text: "Contact opnemen",
    button_color: "blue",
    slug: "reparatie",
  },
]

const ADDITIONAL_SERVICES = [
  {
    id: "olie",
    name: "Olie verversen",
    description: "Olie- en oliefiltervervanging met de juiste specificaties voor uw motor. Snel gedaan.",
    icon_name: "Settings",
    icon_color: "blue",
    price_label: "Op aanvraag",
    slug: "olie-verversen",
  },
  {
    id: "filters",
    name: "Filters & Accu's",
    description: "Vervanging van lucht-, olie- en interieurfilters en accu's. Ook start-stop en hybride.",
    icon_name: "Battery",
    icon_color: "green",
    price_label: "Op aanvraag",
    slug: "filters-accus",
  },
  {
    id: "trekhaak",
    name: "Trekhaak Montage",
    description: "Montage trekhaak op maat inclusief stroomaansluiting. Voor aanhanger, fietsendrager of caravan.",
    icon_name: "Car",
    icon_color: "orange",
    price_label: "Op aanvraag",
    slug: "trekhaak-montage",
  },
  {
    id: "schokdempers",
    name: "Schokdempers & Uitlaten",
    description: "Vervanging en reparatie van schokdempers, veren en uitlaatsystemen.",
    icon_name: "Wrench",
    icon_color: "blue",
    price_label: "Op aanvraag",
    slug: "schokdempers-uitlaten",
  },
  {
    id: "import-export",
    name: "Import & Export",
    description: "Hulp bij documenten, keuringen en administratie voor in- en uitvoer van voertuigen.",
    icon_name: "Car",
    icon_color: "green",
    price_label: "Op aanvraag",
    slug: "import-export",
  },
  {
    id: "kentekenplaten",
    name: "Kentekenplaten",
    description: "Nieuwe kentekenplaten op maat. Europlaat of reflecterend, vaak direct meeneem.",
    icon_name: "Settings",
    icon_color: "orange",
    price_label: "Scherpe prijzen",
    slug: "kentekenplaten",
  },
]

const PRICING_CARDS = [
  {
    id: "apk",
    name: "APK Keuring",
    price_label: "Vanaf € 45",
    badge_text: "Populair",
    features: [
      "RDW-erkend keuringsstation",
      "Snelle afhandeling",
      "Duidelijke rapportage",
    ],
    button_text: "Afspraak maken",
    button_color: "blue",
    slug: "apk-service",
  },
  {
    id: "onderhoud",
    name: "Onderhoudsbeurt",
    price_label: "Op aanvraag",
    features: [
      "Kleine en grote beurt",
      "Volgens fabrikant",
      "Incl. olie en filters",
    ],
    button_text: "Offerte aanvragen",
    button_color: "green",
    slug: "onderhoudsbeurt",
  },
  {
    id: "olie",
    name: "Olie verversen",
    price_label: "Op aanvraag",
    features: [
      "Olie + oliefilter",
      "Juiste specificaties",
      "Korte doorlooptijd",
    ],
    button_text: "Bel voor afspraak",
    button_color: "orange",
    slug: "olie-verversen",
  },
]

export default function DienstenPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/diensten" />

      {/* Hero */}
      <section className="relative pt-36 pb-16 lg:pt-44 lg:pb-24 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&q=80"
            alt="Werkplaats"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">{HERO.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance leading-tight">
              {HERO.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl">
              {HERO.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+31188809802">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto shadow-lg">
                  <Phone className="w-5 h-5 mr-2" />
                  {HERO.cta_primary}
                </Button>
              </a>
              <Link href="/#contact">
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

      {/* Hoofddiensten */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{MAIN_SECTION.title}</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              {MAIN_SECTION.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {MAIN_SERVICES.map((s) => {
              const Icon = iconMap[s.icon_name] || Settings
              const bg = iconBg[s.icon_color] || iconBg.blue
              const btn = buttonBg[s.button_color] || buttonBg.blue
              const badgeCls = badgeBg[s.icon_color] || badgeBg.blue
              return (
                <Card key={s.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div
                      className={`${bg} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{s.name}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{s.description}</p>
                    <div className="space-y-3 mb-6">
                      {s.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{f}</span>
                        </div>
                      ))}
                    </div>
                    {s.price_label && (
                      <div className="flex items-center gap-2 mb-6 flex-wrap">
                        <Badge variant="secondary" className={badgeCls}>
                          {s.price_label}
                        </Badge>
                      </div>
                    )}
                    <Link href={`/diensten/${s.slug}`}>
                      <Button className={`w-full ${btn} text-white font-medium`}>
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

      {/* Aanvullende services */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{ADDITIONAL_SECTION.title}</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              {ADDITIONAL_SECTION.subtitle}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {ADDITIONAL_SERVICES.map((s) => {
              const Icon = iconMap[s.icon_name] || Settings
              const bgLight = iconBgLight[s.icon_color] || iconBgLight.blue
              const txt = textColor[s.icon_color] || textColor.blue
              const badgeCls = badgeBg[s.icon_color] || badgeBg.blue
              return (
                <Card key={s.id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className={`${bgLight} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-7 h-7 ${txt}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">{s.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{s.description}</p>
                    {s.price_label && (
                      <Badge variant="secondary" className={badgeCls}>
                        {s.price_label}
                      </Badge>
                    )}
                    <Link href={`/diensten/${s.slug}`} className="inline-block mt-4">
                      <Button variant="outline" size="sm">
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

      {/* Hoe wij werken */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{HOW_WE_WORK.title}</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              {HOW_WE_WORK.subtitle}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_WE_WORK.steps.map((step, i) => {
              const colors = ["bg-blue-600", "bg-green-600", "bg-orange-500", "bg-gray-600"]
              return (
                <div key={step.number} className="text-center">
                  <div
                    className={`${colors[i] ?? "bg-blue-600"} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <span className="text-white text-2xl font-bold">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Transparante prijzen */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{PRICING_SECTION.title}</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              {PRICING_SECTION.subtitle}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {PRICING_CARDS.map((s) => {
              const btn = buttonBg[s.button_color] || buttonBg.blue
              const txt = textColor[s.button_color] || textColor.blue
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
                    <div className={`text-4xl font-bold mb-6 ${txt}`}>{s.price_label}</div>
                    <ul className="space-y-3 mb-8 text-left">
                      {s.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={isPopular ? "/#contact" : `/diensten/${s.slug}`}>
                      <Button className={`w-full ${btn} text-white`}>{s.button_text}</Button>
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
