/**
 * Subpagina's voor de diensten in het dropdown-menu.
 * Slug = URL-pad (bijv. /diensten/apk-service).
 */

export type DienstenPaginaContent = {
  title: string
  subtitle: string
  intro: string
  features: string[]
  ctaTitle: string
  ctaSubtitle: string
}

function slugFromLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/\s*\/\s*/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

const PAGINAS: Record<string, DienstenPaginaContent> = {
  "apk-service": {
    title: "APK Keuring",
    subtitle: "RDW-erkend keuringsstation voor een snelle en betrouwbare APK",
    intro:
      "Bij Autogarage Viorel kunt u terecht voor uw periodieke APK-keuring. Wij zijn een RDW-erkend keuringsstation en voeren de keuring vakkundig en transparant uit. Loopt uw APK bijna af? Maak een afspraak en rij weer zorgeloos de weg op.",
    features: [
      "RDW-erkend keuringsstation",
      "Snelle afhandeling, vaak dezelfde dag nog mogelijk",
      "Transparante prijzen, geen verrassingen",
      "Uitleg bij eventuele gebreken en advies voor reparatie",
      "Keuring voor personenauto's, aanhangers en aanhangwagens",
    ],
    ctaTitle: "APK laten keuren?",
    ctaSubtitle: "Bel voor een afspraak of kom langs tijdens openingstijden.",
  },
  "import-export": {
    title: "Import & Export",
    subtitle: "Ondersteuning bij in- en uitvoer van uw voertuig",
    intro:
      "Wilt u een auto importeren uit het buitenland of uw voertuig exporteren? Wij helpen u graag met de benodigde documenten, keuringen en administratie. Zo regelt u uw import of export zonder gedoe.",
    features: [
      "Advisering bij import en export",
      "Ondersteuning bij omzetting en keuring",
      "Hulp bij documenten en RDW-procedures",
      "Ervaring met diverse landen en voertuigen",
    ],
    ctaTitle: "Voertuig importeren of exporteren?",
    ctaSubtitle: "Neem contact op voor een vrijblijvend gesprek.",
  },
  "filters-accus": {
    title: "Filters & Accu's",
    subtitle: "Vervanging van lucht-, olie- en interieurfilters en accu's",
    intro:
      "Filters en accu's zijn essentieel voor een goed functionerende auto. Wij vervangen uw luchtfilter, oliefilter, brandstoffilter, interieurfilter en accu vakkundig. Ook accu's voor start-stop systemen en hybride voertuigen behoren tot onze expertise.",
    features: [
      "Vervanging olie-, lucht- en brandstoffilter",
      "Interieur-/pollenfilter voor schone lucht in de auto",
      "Accu's voor alle type auto's, inclusief start-stop",
      "Kwaliteitsonderdelen tegen scherpe prijzen",
    ],
    ctaTitle: "Filter of accu aan vervanging toe?",
    ctaSubtitle: "Bel of kom langs voor advies en een offerte.",
  },
  onderhoudsbeurt: {
    title: "Onderhoudsbeurt",
    subtitle: "Kleine en grote onderhoudsbeurten voor alle merken",
    intro:
      "Regelmatig onderhoud verlengt de levensduur van uw auto en voorkomt onverwachte storingen. Wij voeren kleine en grote beurten uit volgens het onderhoudsschema van de fabrikant. Alle merken en modellen welkom.",
    features: [
      "Kleine en grote onderhoudsbeurten",
      "Volgens fabrikant-specificaties",
      "Olie- en filtervervanging inbegrepen",
      "Controle van remmen, banden en vloeistoffen",
      "Duidelijke rapportage en advies",
    ],
    ctaTitle: "Onderhoudsbeurt inplannen?",
    ctaSubtitle: "Maak een afspraak op een moment dat u uitkomt.",
  },
  "olie-verversen": {
    title: "Olie verversen",
    subtitle: "Professionele olie- en oliefiltervervanging",
    intro:
      "Schone motorolie is cruciaal voor de levensduur van uw motor. Wij verversen de olie en het oliefilter met kwaliteitsolie die past bij uw voertuig. Snel gedaan, zonder gedoe.",
    features: [
      "Olie- en oliefiltervervanging",
      "Juiste specificaties voor uw motor",
      "Korte doorlooptijd",
      "Voorkomt slijtage en problemen",
    ],
    ctaTitle: "Olie laten verversen?",
    ctaSubtitle: "Bel voor een afspraak of kom langs.",
  },
  "onderhoud-herstel": {
    title: "Onderhoud & Herstel",
    subtitle: "Reparaties en herstelwerk aan uw auto",
    intro:
      "Van kleine reparaties tot grotere herstelwerkzaamheden: wij pakken het vakkundig aan. Met eerlijke prijzen en duidelijke communicatie. Uw auto is bij ons in goede handen.",
    features: [
      "Algemene reparaties en herstel",
      "Remmen, ophanging en uitlaat",
      "Elektrische en elektronische storingen",
      "Transparante offerte vooraf",
    ],
    ctaTitle: "Reparatie of herstel nodig?",
    ctaSubtitle: "Neem contact op voor een diagnose en offerte.",
  },
  "schokdempers-uitlaten": {
    title: "Schokdempers & Uitlaten",
    subtitle: "Vervanging en reparatie van schokdempers en uitlaatsystemen",
    intro:
      "Versleten schokdempers of een kapotte uitlaat? Wij monteren nieuwe of gereviseerde onderdelen en zorgen voor een veilige en stille rit. Voor personenauto's en lichte bedrijfsvoertuigen.",
    features: [
      "Vervanging schokdempers en veren",
      "Uitlaat reparatie en vervanging",
      "Katalysator en roetfilter",
      "Kwaliteitsonderdelen, BOVAG-garantie waar van toepassing",
    ],
    ctaTitle: "Schokdempers of uitlaat laten doen?",
    ctaSubtitle: "Bel voor advies en een prijsopgave.",
  },
  "trekhaak-montage": {
    title: "Trekhaak Montage",
    subtitle: "Professionele montage van trekhaak en stroomaansluiting",
    intro:
      "Wilt u een aanhanger, fietsendrager of caravan trekken? Wij monteren een trekhaak die past bij uw auto, inclusief stroomaansluiting voor verlichting. Veilig en conform de regels.",
    features: [
      "Montage trekhaak op maat voor uw auto",
      "Stroomaansluiting 7-pins of 13-pins",
      "Typegoedkeuring en documentatie",
      "Advies over draagvermogen en accessoires",
    ],
    ctaTitle: "Trekhaak laten monteren?",
    ctaSubtitle: "Neem contact op voor mogelijkheden en prijs.",
  },
  kentekenplaten: {
    title: "Kentekenplaten",
    subtitle: "Nieuwe kentekenplaten op maat gemaakt",
    intro:
      "Een nieuwe of reserve kentekenplaat nodig? Wij maken kentekenplaten op maat voor uw voertuig. Snel klaar, tegen een scherpe prijs.",
    features: [
      "Kentekenplaten voor auto, motor en aanhanger",
      "Europlaat of reflecterende plaat",
      "Snel klaar, vaak direct meeneem",
    ],
    ctaTitle: "Kentekenplaat nodig?",
    ctaSubtitle: "Kom langs of bel even voor beschikbaarheid.",
  },
  reparatie: {
    title: "Reparatie",
    subtitle: "Vakkundige reparaties voor alle merken",
    intro:
      "Storing, lampje op het dashboard of een kapot onderdeel? Wij diagnosticeren het probleem en voeren de reparatie uit. Eerlijk advies, geen onnodige werkzaamheden.",
    features: [
      "Diagnose met professionele apparatuur",
      "Reparatie aan motor, remmen, ophanging en meer",
      "Onderdelen van betrouwbare leveranciers",
      "Duidelijke communicatie en offerte vooraf",
    ],
    ctaTitle: "Reparatie nodig?",
    ctaSubtitle: "Bel voor een afspraak of kom langs voor een diagnose.",
  },
  vervanging: {
    title: "Vervanging Onderdelen",
    subtitle: "Vervanging van versleten of defecte onderdelen",
    intro:
      "Versleten remschijven, een kapotte dynamo of andere onderdelen aan vervanging toe? Wij vervangen alleen wat nodig is, met kwaliteitsonderdelen en een nette afwerking.",
    features: [
      "Remmen, lagers, distributie en meer",
      "Origineel of kwalitatief A-merk",
      "Garantie op uitgevoerde werkzaamheden",
      "Transparante prijzen",
    ],
    ctaTitle: "Onderdeel laten vervangen?",
    ctaSubtitle: "Neem contact op voor advies en een offerte.",
  },
}

/** Labels voor het navbar-dropdown (zelfde volgorde als menu) */
export const DIENSTEN_DROPDOWN_LABELS = [
  "APK Service",
  "Import / Export",
  "Filters / Accus",
  "Onderhoudsbeurt",
  "Olie verversen",
  "Onderhoud / Herstel",
  "Schokdempers / Uitlaten",
  "Trekhaak Montage",
  "Kentekenplaten",
  "Reparatie",
  "Vervanging",
] as const

/** Geeft het URL-slug voor een dropdown-label (bijv. "APK Service" → "apk-service") */
export function getSlugForLabel(label: string): string {
  return slugFromLabel(label)
}

/** Alle geldige slugs voor diensten-subpagina's */
export const DIENSTEN_SLUGS = DIENSTEN_DROPDOWN_LABELS.map((l) => slugFromLabel(l))

/** Content voor een diensten-subpagina; null als slug onbekend is */
export function getDienstenPaginaContent(slug: string): DienstenPaginaContent | null {
  return PAGINAS[slug] ?? null
}
