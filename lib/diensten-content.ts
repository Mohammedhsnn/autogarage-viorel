import type { LucideIcon } from "lucide-react"

export type DienstenHero = {
  badge: string
  title: string
  subtitle: string
  cta_primary: string
  cta_secondary: string
}

export type DienstenSectionText = {
  title: string
  subtitle: string
}

export type HowWeWorkStep = {
  number: number
  title: string
  description: string
}

export type HowWeWork = {
  title: string
  subtitle: string
  steps: HowWeWorkStep[]
}

export type ServiceCard = {
  id: string
  name: string
  description: string
  icon_name?: keyof Record<string, LucideIcon> | string
  features?: string[]
  price_label?: string
  button_text?: string
  slug?: string
  badge_text?: string
}

export type DienstenContent = {
  hero: DienstenHero
  main_section: DienstenSectionText
  additional_section: DienstenSectionText
  how_we_work: HowWeWork
  pricing_section: DienstenSectionText
  main_services: ServiceCard[]
  additional_services: ServiceCard[]
  pricing_cards: ServiceCard[]
}

export const DEFAULT_DIENSTEN_CONTENT: DienstenContent = {
  hero: {
    badge: "Professionele autoservice",
    title: "Onze Diensten",
    subtitle:
      "Van preventief onderhoud tot complexe reparaties – bij Autogarage Viorel bent u verzekerd van vakkundig werk, eerlijke prijzen en persoonlijke service in Terneuzen.",
    cta_primary: "Bel voor advies",
    cta_secondary: "Plan een afspraak",
  },
  main_section: {
    title: "Onze Hoofddiensten",
    subtitle:
      "Wij bieden een compleet pakket aan autoservices, van dagelijks onderhoud tot specialistische reparaties. Alle merken welkom.",
  },
  additional_section: {
    title: "Aanvullende Services",
    subtitle: "Naast onze hoofddiensten bieden wij ook gespecialiseerde services voor uw auto.",
  },
  how_we_work: {
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
  },
  pricing_section: {
    title: "Transparante Prijzen",
    subtitle: "Geen verrassingen achteraf. Onze prijzen zijn helder en eerlijk. Vraag gerust een offerte aan.",
  },
  main_services: [
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
  ],
  additional_services: [
    {
      id: "olie",
      name: "Olie verversen",
      description: "Olie- en oliefiltervervanging met de juiste specificaties voor uw motor. Snel gedaan.",
      icon_name: "Settings",
      price_label: "Op aanvraag",
      slug: "olie-verversen",
    },
    {
      id: "filters",
      name: "Filters & Accu's",
      description: "Vervanging van lucht-, olie- en interieurfilters en accu's. Ook start-stop en hybride.",
      icon_name: "Battery",
      price_label: "Op aanvraag",
      slug: "filters-accus",
    },
    {
      id: "trekhaak",
      name: "Trekhaak Montage",
      description: "Montage trekhaak op maat inclusief stroomaansluiting. Voor aanhanger, fietsendrager of caravan.",
      icon_name: "Car",
      price_label: "Op aanvraag",
      slug: "trekhaak-montage",
    },
    {
      id: "schokdempers",
      name: "Schokdempers & Uitlaten",
      description: "Vervanging en reparatie van schokdempers, veren en uitlaatsystemen.",
      icon_name: "Wrench",
      price_label: "Op aanvraag",
      slug: "schokdempers-uitlaten",
    },
    {
      id: "laswerk",
      name: "Laswerk",
      description: "Carrosserie herstellen met professioneel laswerk. Van kleine reparaties tot uitlaat en plaatwerk.",
      icon_name: "Wrench",
      price_label: "Op aanvraag",
      slug: "laswerk",
    },
    {
      id: "import-export",
      name: "Import & Export",
      description: "Hulp bij documenten, keuringen en administratie voor in- en uitvoer van voertuigen.",
      icon_name: "Car",
      price_label: "Op aanvraag",
      slug: "import-export",
    },
    {
      id: "kentekenplaten",
      name: "Kentekenplaten",
      description: "Nieuwe kentekenplaten op maat. Europlaat of reflecterend, vaak direct meeneem.",
      icon_name: "Settings",
      price_label: "Scherpe prijzen",
      slug: "kentekenplaten",
    },
  ],
  pricing_cards: [
    {
      id: "apk",
      name: "APK Keuring",
      price_label: "Vanaf € 45",
      badge_text: "Populair",
      features: ["Via RDW-erkende partner", "Snelle afhandeling", "Duidelijke rapportage"],
      button_text: "Afspraak maken",
      slug: "apk-service",
    },
    {
      id: "onderhoud",
      name: "Onderhoudsbeurt",
      price_label: "Op aanvraag",
      features: ["Kleine en grote beurt", "Volgens fabrikant", "Incl. olie en filters"],
      button_text: "Offerte aanvragen",
      slug: "onderhoudsbeurt",
    },
    {
      id: "olie",
      name: "Olie verversen",
      price_label: "Op aanvraag",
      features: ["Olie + oliefilter", "Juiste specificaties", "Korte doorlooptijd"],
      button_text: "Bel voor afspraak",
      slug: "olie-verversen",
    },
  ],
}

export function mergeDienstenContent(content: unknown): DienstenContent {
  const c = (content && typeof content === "object" ? (content as any) : {}) as any
  const d = DEFAULT_DIENSTEN_CONTENT

  return {
    hero: { ...d.hero, ...(c.hero ?? {}) },
    main_section: { ...d.main_section, ...(c.main_section ?? {}) },
    additional_section: { ...d.additional_section, ...(c.additional_section ?? {}) },
    how_we_work: {
      ...d.how_we_work,
      ...(c.how_we_work ?? {}),
      steps: Array.isArray(c?.how_we_work?.steps) ? c.how_we_work.steps : d.how_we_work.steps,
    },
    pricing_section: { ...d.pricing_section, ...(c.pricing_section ?? {}) },
    main_services: Array.isArray(c.main_services) ? c.main_services : d.main_services,
    additional_services: Array.isArray(c.additional_services) ? c.additional_services : d.additional_services,
    pricing_cards: Array.isArray(c.pricing_cards) ? c.pricing_cards : d.pricing_cards,
  }
}

