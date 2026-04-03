import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import {
  Phone,
  Mail,
  Calendar,
  Fuel,
  Gauge,
  Users,
  Cog,
  CheckCircle,
  ChevronLeft,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"
import { getCarById } from "@/app/actions"
import { CarImageGallery } from "./CarImageGallery"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const car = await getCarById(Number(id))
  if (!car) return { title: "Auto niet gevonden" }

  const title = `${car.brand} ${car.model} (${car.year}) | Occasions`
  const priceStr =
    car.price != null ? `€ ${Number(car.price).toLocaleString("nl-NL")},-` : "Prijs op aanvraag"
  const description =
    (car.description && car.description.trim().slice(0, 200)) ||
    `${car.brand} ${car.model}, ${car.year}, ${priceStr}. Occasion bij Autogarage Viorel in Terneuzen.`

  const rawImg = car.images?.[0]?.image_url
  let ogImage: string | undefined
  if (typeof rawImg === "string" && rawImg.length > 0) {
    if (rawImg.startsWith("https://") || rawImg.startsWith("http://")) {
      ogImage = rawImg
    } else {
      ogImage = rawImg.startsWith("/") ? rawImg : `/${rawImg}`
    }
  }

  const path = `/occasions/${id}`

  return {
    title,
    description,
    openGraph: {
      title: `${car.brand} ${car.model} (${car.year})`,
      description,
      type: "website",
      locale: "nl_NL",
      siteName: "Autogarage Viorel",
      url: path,
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: `${car.brand} ${car.model}`,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${car.brand} ${car.model} (${car.year})`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export default async function OccasionDetailPage({ params }: Props) {
  const { id } = await params
  const carId = Number(id)
  if (Number.isNaN(carId)) notFound()

  const car = await getCarById(carId)
  if (!car || car.status !== "available") notFound()

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/occasions" />

      {/* Ruimte onder vaste header (zelfde orde als /occasions-overzicht: pt-28 / lg ~120px) */}
      <div className="pt-28 sm:pt-32 lg:pt-[120px]">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-slate-200/80">
          <div className="container mx-auto px-4 py-3 sm:py-3.5">
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 min-w-0">
              <Link href="/" className="hover:text-blue-600 transition-colors shrink-0">
                Home
              </Link>
              <span className="shrink-0 text-gray-400">/</span>
              <Link href="/occasions" className="hover:text-blue-600 transition-colors shrink-0">
                Occasions
              </Link>
              <span className="shrink-0 text-gray-400">/</span>
              <span className="text-gray-900 font-medium truncate min-w-0" title={`${car.brand} ${car.model}`}>
                {car.brand} {car.model}
              </span>
            </nav>
          </div>
        </div>

        <main className="pb-12 sm:pb-16">
          {/* Gallery + titel + prijs */}
          <section className="container mx-auto px-4 pt-6 sm:pt-8 lg:pt-10">
          <Link
            href="/occasions"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-4 sm:mb-6 -ml-0.5"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            Terug naar overzicht
          </Link>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            <div className="space-y-4 min-w-0">
              <CarImageGallery
                images={car.images || []}
                brand={car.brand}
                model={car.model}
              />
            </div>

            <div className="min-w-0 flex flex-col">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 mb-2 antialiased leading-tight">
                {car.brand} {car.model}
              </h1>
              <p className="text-sm sm:text-lg text-slate-600 mb-4 sm:mb-6 leading-relaxed">
                {car.year} · {car.mileage?.toLocaleString("nl-NL")} km · {car.fuel} · {car.transmission}
              </p>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-6 sm:mb-8 pb-6 sm:pb-0 border-b border-slate-100 sm:border-0">
                <span className="text-2xl sm:text-3xl font-bold text-blue-600 tabular-nums">
                  € {car.price?.toLocaleString("nl-NL")},-
                </span>
                <span className="text-sm text-slate-500">Vraagprijs</span>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <a href="tel:+31618809802" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 min-h-[48px]">
                    <Phone className="w-5 h-5 mr-2" />
                    Bel voor informatie
                  </Button>
                </a>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[48px] border-slate-300">
                    <Mail className="w-5 h-5 mr-2" />
                    Proefrit aanvragen
                  </Button>
                </Link>
              </div>

              {/* Belangrijkste specificaties direct onder de CTA-knoppen */}
              <div className="mt-6 sm:mt-8 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 sm:border-0 sm:bg-transparent sm:p-0 sm:rounded-none">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">
                  Belangrijkste specificaties
                </h2>
                <div className="grid grid-cols-2 gap-x-3 gap-y-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Bouwjaar</div>
                      <div className="font-medium text-gray-900">{car.year}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Kilometerstand</div>
                      <div className="font-medium text-gray-900">
                        {car.mileage?.toLocaleString("nl-NL")} km
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Brandstof</div>
                      <div className="font-medium text-gray-900">{car.fuel}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cog className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Transmissie</div>
                      <div className="font-medium text-gray-900">{car.transmission}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-200" />
                    <div>
                      <div className="text-xs text-gray-500">Kleur</div>
                      <div className="font-medium text-gray-900">{car.color}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Zitplaatsen</div>
                      <div className="font-medium text-gray-900">{car.seats}</div>
                    </div>
                  </div>
                </div>

                {car.apk_date && (
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">
                      APK geldig tot{" "}
                      <span className="font-medium">
                        {new Date(car.apk_date).toLocaleDateString("nl-NL")}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Beschrijving */}
        {car.description && (
          <section className="container mx-auto px-4 py-8 sm:py-10 border-t border-slate-100">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 mb-3 sm:mb-4">Beschrijving</h2>
            <p className="text-slate-600 leading-relaxed max-w-3xl text-[15px] sm:text-base">{car.description}</p>
          </section>
        )}

        {/* Uitrusting */}
        {car.features && car.features.length > 0 && (
          <section className="container mx-auto px-4 py-8 sm:py-10 border-t border-slate-100">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 mb-3 sm:mb-4">Uitrusting</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2.5">
              {car.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 min-w-0">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-[15px] sm:text-sm leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Contact CTA */}
        <section className="container mx-auto px-4 py-8 sm:py-12 border-t border-slate-100">
          <div className="max-w-2xl mx-auto lg:mx-0 p-5 sm:p-8 bg-gray-900 text-white rounded-xl sm:rounded-2xl">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight mb-2 leading-snug">
              Interesse in deze {car.brand} {car.model}?
            </h2>
            <p className="text-slate-300 mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed">
              Neem contact op voor meer informatie of om een proefrit in te plannen. Wij staan u graag te woord.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <a href="tel:+31618809802" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 min-h-[48px]">
                  <Phone className="w-5 h-5 mr-2" />
                  Bel ons
                </Button>
              </a>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto min-h-[48px] border-2 border-white bg-transparent text-white shadow-none hover:bg-white hover:text-gray-900"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact
                </Button>
              </Link>
            </div>
            <div className="mt-5 sm:mt-6 flex items-start gap-2 text-slate-400 text-sm">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Ambachtsstraat 1-A, 4538 AV Terneuzen</span>
            </div>
          </div>
        </section>
      </main>
      </div>

      <Footer />
      <FloatingActions />
    </div>
  )
}
