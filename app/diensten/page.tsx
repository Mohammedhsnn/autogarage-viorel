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

/* Eén kleur op de pagina: lichtblauw */
const iconBg = "bg-sky-500"
const iconBgLight = "bg-sky-100"
const textColor = "text-sky-600"
const badgeBg = "bg-sky-100 text-sky-700"
const buttonBg = "bg-sky-500 hover:bg-sky-600"

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
      description: "Bel ons op +31 (6)18 80 98 02 of kom langs op Ambachtsstraat 1-A op een moment dat u uitkomt.",
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
      "Bij Autogarage Viorel kunt u terecht voor uw periodieke APK-keuring. Wij werken samen met een RDW-erkend keuringsstation en regelen de keuring voor u vakkundig en transparant.",
    icon_name: "Shield",
    features: [
      "Samenwerking met RDW-erkend keuringsstation",
      "Snelle afhandeling, vaak dezelfde dag nog mogelijk",
      "Transparante prijzen",
      "Uitleg bij eventuele gebreken en advies voor reparatie",
    ],
    price_label: "Vanaf € 45",
    button_text: "APK laten keuren",
    slug: "apk-service",
  },
  {
    id: "onderhoudsbeurt",
    name: "Onderhoudsbeurt",
    description:
      "Regelmatig onderhoud verlengt de levensduur van uw auto. Wij voeren kleine en grote beurten uit volgens het onderhoudsschema van de fabrikant. Alle merken welkom.",
    icon_name: "Settings",
    features: [
      "Kleine en grote onderhoudsbeurten",
      "Volgens fabrikant-specificaties",
      "Olie- en filtervervanging inbegrepen",
      "Controle van remmen, banden en vloeistoffen",
    ],
    price_label: "Prijs op aanvraag",
    button_text: "Afspraak maken",
    slug: "onderhoudsbeurt",
  },
  {
    id: "onderhoud-herstel",
    name: "Onderhoud & Herstel",
    description:
      "Van kleine reparaties tot grotere herstelwerkzaamheden: wij pakken het vakkundig aan. Eerlijke prijzen en duidelijke communicatie.",
    icon_name: "Wrench",
    features: [
      "Algemene reparaties en herstel",
      "Remmen, ophanging en uitlaat",
      "Elektrische en elektronische storingen",
      "Transparante offerte vooraf",
    ],
    button_text: "Meer informatie",
    slug: "onderhoud-herstel",
  },
]

const ADDITIONAL_SERVICES = [
  { id: "olie", name: "Olie verversen", description: "Olie- en oliefiltervervanging met de juiste specificaties voor uw motor. Snel gedaan.", icon_name: "Settings", price_label: "Op aanvraag", slug: "olie-verversen" },
  { id: "filters", name: "Filters & Accu's", description: "Vervanging van lucht-, olie- en interieurfilters en accu's. Ook start-stop en hybride.", icon_name: "Battery", price_label: "Op aanvraag", slug: "filters-accus" },
  { id: "trekhaak", name: "Trekhaak Montage", description: "Montage trekhaak op maat inclusief stroomaansluiting. Voor aanhanger, fietsendrager of caravan.", icon_name: "Car", price_label: "Op aanvraag", slug: "trekhaak-montage" },
  { id: "schokdempers", name: "Schokdempers & Uitlaten", description: "Vervanging en reparatie van schokdempers, veren en uitlaatsystemen.", icon_name: "Wrench", price_label: "Op aanvraag", slug: "schokdempers-uitlaten" },
  { id: "laswerk", name: "Laswerk", description: "Carrosserie herstellen met professioneel laswerk. Van kleine reparaties tot uitlaat en plaatwerk.", icon_name: "Wrench", price_label: "Op aanvraag", slug: "laswerk" },
  { id: "import-export", name: "Import & Export", description: "Hulp bij documenten, keuringen en administratie voor in- en uitvoer van voertuigen.", icon_name: "Car", price_label: "Op aanvraag", slug: "import-export" },
  { id: "kentekenplaten", name: "Kentekenplaten", description: "Nieuwe kentekenplaten op maat. Europlaat of reflecterend, vaak direct meeneem.", icon_name: "Settings", price_label: "Scherpe prijzen", slug: "kentekenplaten" },
]

const PRICING_CARDS = [
  { id: "apk", name: "APK Keuring", price_label: "Vanaf € 45", badge_text: "Populair", features: ["Via RDW-erkende partner", "Snelle afhandeling", "Duidelijke rapportage"], button_text: "Afspraak maken", slug: "apk-service" },
  { id: "onderhoud", name: "Onderhoudsbeurt", price_label: "Op aanvraag", features: ["Kleine en grote beurt", "Volgens fabrikant", "Incl. olie en filters"], button_text: "Offerte aanvragen", slug: "onderhoudsbeurt" },
  { id: "olie", name: "Olie verversen", price_label: "Op aanvraag", features: ["Olie + oliefilter", "Juiste specificaties", "Korte doorlooptijd"], button_text: "Bel voor afspraak", slug: "olie-verversen" },
]

export default function DienstenPage() {
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
        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-[100vw]">
          <div className="max-w-3xl min-w-0 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-sky-500/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{MAIN_SECTION.title}</h2>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{ADDITIONAL_SECTION.title}</h2>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{HOW_WE_WORK.title}</h2>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{PRICING_SECTION.title}</h2>
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
