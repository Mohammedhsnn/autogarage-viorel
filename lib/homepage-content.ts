/**
 * Standaard homepage-inhoud + merge met Supabase page_content (page_slug = home).
 */

export type StatBlock = { title: string; subtitle: string }

export type OfferCard = {
  title: string
  description: string
  image_url: string
  href: string
  cta: string
}

export type UspBlock = { title: string; subtitle: string }

export type AboutStat = { value: string; label: string }

export type ServiceDetailItem = { title: string; description: string }

export type HomePageContent = {
  hero: {
    background_image_url: string
    collage_wide_image_url: string
    collage_square_image_urls: [string, string]
    badge_text: string
    headline_line1: string
    headline_highlight: string
    intro: string
    bullet1: string
    bullet2: string
    cta_primary: string
    cta_secondary: string
    slider_caption_wide: string
  }
  stats: [StatBlock, StatBlock, StatBlock]
  offer_section: { title: string; subtitle: string }
  offer_cards: [OfferCard, OfferCard, OfferCard]
  featured: { title: string; subtitle: string; button_label: string }
  usps: [UspBlock, UspBlock, UspBlock, UspBlock]
  about: {
    title: string
    paragraph1: string
    paragraph2: string
    stats: [AboutStat, AboutStat, AboutStat]
    cta: string
  }
  services_detail: {
    title: string
    subtitle: string
    items: [ServiceDetailItem, ServiceDetailItem, ServiceDetailItem, ServiceDetailItem]
  }
  contact_block: {
    title: string
    intro: string
  }
}

const DEFAULT_OFFER_CARDS: [OfferCard, OfferCard, OfferCard] = [
  {
    title: "Occasions",
    description:
      "Ontdek ons uitgebreide aanbod van kwaliteit occasions. Alle auto's zijn grondig gecontroleerd.",
    image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    href: "/occasions",
    cta: "Bekijk aanbod",
  },
  {
    title: "Werkplaats",
    description: "Professioneel onderhoud en reparaties voor alle automerken door ervaren monteurs.",
    image_url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
    href: "/diensten",
    cta: "Meer informatie",
  },
  {
    title: "APK Keuring",
    description: "APK keuringen via onze RDW-erkende partner, met directe reparatiemogelijkheid bij afkeuring.",
    image_url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80",
    href: "/afspraak",
    cta: "APK plannen",
  },
]

export const DEFAULT_HOME_PAGE_CONTENT: HomePageContent = {
  hero: {
    background_image_url: "/over-autogarage-viorel.png",
    collage_wide_image_url: "/over-autogarage-viorel.png",
    collage_square_image_urls: [
      "/uploads/cars/0a1fec5b-b1fb-41ca-9ea7-22b11700b4dc.webp",
      "/uploads/cars/226d9937-c230-4657-94a8-ecb2a83f6925.webp",
    ],
    badge_text: "APK via RDW-erkende partner",
    headline_line1: "Uw betrouwbare",
    headline_highlight: "auto specialist",
    intro:
      "Onderhoud, reparaties, APK en kwaliteit occasions in Terneuzen. Eerlijk advies, duidelijke prijzen en service waar u op kunt rekenen.",
    bullet1: "Onderhoud & reparatie",
    bullet2: "Occasions gecontroleerd",
    cta_primary: "Bekijk ons aanbod",
    cta_secondary: "Contact opnemen",
    slider_caption_wide: "Vakmanschap, onderhoud en occasions",
  },
  stats: [
    { title: "Breed aanbod", subtitle: "Kwaliteit occasions" },
    { title: "15+ jaar", subtitle: "Ervaring in de regio" },
    { title: "Persoonlijk", subtitle: "Wij staan voor u klaar" },
  ],
  offer_section: {
    title: "Ons aanbod",
    subtitle: "Van onderhoud tot verkoop - wij bieden complete automotive diensten",
  },
  offer_cards: DEFAULT_OFFER_CARDS,
  featured: {
    title: "Occasions uitgelicht",
    subtitle: "Bekijk wat er momenteel beschikbaar is.",
    button_label: "Alle occasions",
  },
  usps: [
    { title: "Vaste prijzen", subtitle: "Geen verrassingen achteraf" },
    { title: "BOVAG garantie", subtitle: "Op al onze occasions" },
    { title: "APK via partner", subtitle: "Samenwerking met RDW-erkend station" },
    { title: "Persoonlijke service", subtitle: "Altijd bereikbaar" },
  ],
  about: {
    title: "Over Autogarage Viorel",
    paragraph1:
      "Autogarage Viorel is een familiebedrijf dat al jaren actief is in de automotive sector in Terneuzen. Wij zijn gespecialiseerd in de in- en verkoop van auto's, onderhoud, reparaties en APK keuringen.",
    paragraph2:
      'Ons motto "Eerlijk, betaalbaar, betrouwbaar" staat centraal in alles wat wij doen. Bij ons staat persoonlijke service voorop en behandelen wij elke klant met respect en professionaliteit.',
    stats: [
      { value: "15+", label: "Jaar ervaring" },
      { value: "1000+", label: "Tevreden klanten" },
      { value: "100%", label: "Inzet" },
    ],
    cta: "Neem contact op",
  },
  services_detail: {
    title: "Onze diensten",
    subtitle: "Complete automotive diensten onder één dak",
    items: [
      { title: "Onderhoud", description: "Grote en kleine beurten voor alle merken" },
      { title: "APK Keuring", description: "Via RDW-erkende partner" },
      { title: "Occasions", description: "Kwaliteit occasions met garantie" },
      { title: "Banden", description: "Montage, balanceren en opslag" },
    ],
  },
  contact_block: {
    title: "Contact",
    intro: "Heeft u vragen of wilt u een afspraak maken? Neem gerust contact met ons op!",
  },
}

function pickStr(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim().length > 0 ? v : fallback
}

function parseHero(raw: Record<string, unknown> | undefined): HomePageContent["hero"] {
  const h = (raw?.hero as Record<string, unknown>) ?? {}
  const d = DEFAULT_HOME_PAGE_CONTENT.hero
  const sq = Array.isArray(h.collage_square_image_urls) ? h.collage_square_image_urls : []
  const u0 = typeof sq[0] === "string" ? sq[0] : d.collage_square_image_urls[0]
  const u1 = typeof sq[1] === "string" ? sq[1] : d.collage_square_image_urls[1]
  return {
    background_image_url: pickStr(h.background_image_url, d.background_image_url),
    collage_wide_image_url: pickStr(h.collage_wide_image_url, d.collage_wide_image_url),
    collage_square_image_urls: [u0, u1],
    badge_text: pickStr(h.badge_text, d.badge_text),
    headline_line1: pickStr(h.headline_line1, d.headline_line1),
    headline_highlight: pickStr(h.headline_highlight, d.headline_highlight),
    intro: pickStr(h.intro, d.intro),
    bullet1: pickStr(h.bullet1, d.bullet1),
    bullet2: pickStr(h.bullet2, d.bullet2),
    cta_primary: pickStr(h.cta_primary, d.cta_primary),
    cta_secondary: pickStr(h.cta_secondary, d.cta_secondary),
    slider_caption_wide: pickStr(h.slider_caption_wide, d.slider_caption_wide),
  }
}

function parseStats(raw: Record<string, unknown> | undefined): HomePageContent["stats"] {
  const d = DEFAULT_HOME_PAGE_CONTENT.stats
  const arr = raw?.stats
  if (!Array.isArray(arr)) return d
  const out: StatBlock[] = []
  for (let i = 0; i < 3; i++) {
    const item = arr[i] as Record<string, unknown> | undefined
    out.push({
      title: pickStr(item?.title, d[i].title),
      subtitle: pickStr(item?.subtitle, d[i].subtitle),
    })
  }
  return [out[0], out[1], out[2]]
}

function parseOfferSection(raw: Record<string, unknown> | undefined): HomePageContent["offer_section"] {
  const o = (raw?.offer_section as Record<string, unknown>) ?? {}
  const d = DEFAULT_HOME_PAGE_CONTENT.offer_section
  return {
    title: pickStr(o.title, d.title),
    subtitle: pickStr(o.subtitle, d.subtitle),
  }
}

function parseOfferCards(raw: Record<string, unknown> | undefined): HomePageContent["offer_cards"] {
  const d = DEFAULT_HOME_PAGE_CONTENT.offer_cards
  const arr = raw?.offer_cards
  if (!Array.isArray(arr)) return d
  const out: OfferCard[] = []
  for (let i = 0; i < 3; i++) {
    const c = arr[i] as Record<string, unknown> | undefined
    out.push({
      title: pickStr(c?.title, d[i].title),
      description: pickStr(c?.description, d[i].description),
      image_url: pickStr(c?.image_url, d[i].image_url),
      href: pickStr(c?.href, d[i].href),
      cta: pickStr(c?.cta, d[i].cta),
    })
  }
  return [out[0], out[1], out[2]]
}

function parseFeatured(raw: Record<string, unknown> | undefined): HomePageContent["featured"] {
  const f = (raw?.featured as Record<string, unknown>) ?? {}
  const d = DEFAULT_HOME_PAGE_CONTENT.featured
  return {
    title: pickStr(f.title, d.title),
    subtitle: pickStr(f.subtitle, d.subtitle),
    button_label: pickStr(f.button_label, d.button_label),
  }
}

function parseUsps(raw: Record<string, unknown> | undefined): HomePageContent["usps"] {
  const d = DEFAULT_HOME_PAGE_CONTENT.usps
  const arr = raw?.usps
  if (!Array.isArray(arr)) return d
  const out: UspBlock[] = []
  for (let i = 0; i < 4; i++) {
    const u = arr[i] as Record<string, unknown> | undefined
    out.push({
      title: pickStr(u?.title, d[i].title),
      subtitle: pickStr(u?.subtitle, d[i].subtitle),
    })
  }
  return [out[0], out[1], out[2], out[3]]
}

function parseAbout(raw: Record<string, unknown> | undefined): HomePageContent["about"] {
  const a = (raw?.about as Record<string, unknown>) ?? {}
  const d = DEFAULT_HOME_PAGE_CONTENT.about
  const statsArr = Array.isArray(a.stats) ? a.stats : []
  const stats: AboutStat[] = []
  for (let i = 0; i < 3; i++) {
    const s = statsArr[i] as Record<string, unknown> | undefined
    stats.push({
      value: pickStr(s?.value, d.stats[i].value),
      label: pickStr(s?.label, d.stats[i].label),
    })
  }
  return {
    title: pickStr(a.title, d.title),
    paragraph1: pickStr(a.paragraph1, d.paragraph1),
    paragraph2: pickStr(a.paragraph2, d.paragraph2),
    stats: [stats[0], stats[1], stats[2]],
    cta: pickStr(a.cta, d.cta),
  }
}

function parseServicesDetail(raw: Record<string, unknown> | undefined): HomePageContent["services_detail"] {
  const s = (raw?.services_detail as Record<string, unknown>) ?? {}
  const d = DEFAULT_HOME_PAGE_CONTENT.services_detail
  const itemsArr = Array.isArray(s.items) ? s.items : []
  const items: ServiceDetailItem[] = []
  for (let i = 0; i < 4; i++) {
    const it = itemsArr[i] as Record<string, unknown> | undefined
    items.push({
      title: pickStr(it?.title, d.items[i].title),
      description: pickStr(it?.description, d.items[i].description),
    })
  }
  return {
    title: pickStr(s.title, d.title),
    subtitle: pickStr(s.subtitle, d.subtitle),
    items: [items[0], items[1], items[2], items[3]],
  }
}

function parseContact(raw: Record<string, unknown> | undefined): HomePageContent["contact_block"] {
  const c = (raw?.contact_block as Record<string, unknown>) ?? {}
  const d = DEFAULT_HOME_PAGE_CONTENT.contact_block
  return {
    title: pickStr(c.title, d.title),
    intro: pickStr(c.intro, d.intro),
  }
}

/** Merge database JSON met volledige standaard homepage-structuur. */
export function mergeHomePageContent(fromDb: Record<string, unknown> | null | undefined): HomePageContent {
  const raw = fromDb ?? {}
  return {
    hero: parseHero(raw),
    stats: parseStats(raw),
    offer_section: parseOfferSection(raw),
    offer_cards: parseOfferCards(raw),
    featured: parseFeatured(raw),
    usps: parseUsps(raw),
    about: parseAbout(raw),
    services_detail: parseServicesDetail(raw),
    contact_block: parseContact(raw),
  }
}

/** Voor opslaan in API: platte hero + overige velden (zelfde shape als merge). */
export function homePageContentToJson(c: HomePageContent): Record<string, unknown> {
  return {
    hero: {
      background_image_url: c.hero.background_image_url,
      collage_wide_image_url: c.hero.collage_wide_image_url,
      collage_square_image_urls: [...c.hero.collage_square_image_urls],
      badge_text: c.hero.badge_text,
      headline_line1: c.hero.headline_line1,
      headline_highlight: c.hero.headline_highlight,
      intro: c.hero.intro,
      bullet1: c.hero.bullet1,
      bullet2: c.hero.bullet2,
      cta_primary: c.hero.cta_primary,
      cta_secondary: c.hero.cta_secondary,
      slider_caption_wide: c.hero.slider_caption_wide,
    },
    stats: c.stats.map((s) => ({ ...s })),
    offer_section: { ...c.offer_section },
    offer_cards: c.offer_cards.map((x) => ({ ...x })),
    featured: { ...c.featured },
    usps: c.usps.map((u) => ({ ...u })),
    about: {
      ...c.about,
      stats: c.about.stats.map((s) => ({ ...s })),
    },
    services_detail: {
      title: c.services_detail.title,
      subtitle: c.services_detail.subtitle,
      items: c.services_detail.items.map((i) => ({ ...i })),
    },
    contact_block: { ...c.contact_block },
  }
}
