import { notFound } from "next/navigation"
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
  ChevronRight,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"
import { getCarById } from "@/app/actions"
import { CarImageGallery } from "./CarImageGallery"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const car = await getCarById(Number(id))
  if (!car) return { title: "Auto niet gevonden" }
  return {
    title: `${car.brand} ${car.model} (${car.year}) | Occasions | Autogarage Viorel`,
    description: car.description || `${car.brand} ${car.model}, ${car.year}, € ${car.price?.toLocaleString("nl-NL")},-`,
  }
}

export default async function OccasionDetailPage({ params }: Props) {
  const { id } = await params
  const carId = Number(id)
  if (Number.isNaN(carId)) notFound()

  const car = await getCarById(carId)
  if (!car || car.status !== "available") notFound()

  const mainImage = car.images?.[0]?.image_url || "/placeholder.svg"

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/occasions" />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/occasions" className="hover:text-blue-600 transition-colors">
              Occasions
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {car.brand} {car.model}
            </span>
          </nav>
        </div>
      </div>

      <main className="pb-16">
        {/* Gallery + titel + prijs */}
        <section className="container mx-auto px-4 pt-6 lg:pt-8">
          <Link
            href="/occasions"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Terug naar overzicht
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <CarImageGallery
                images={car.images || []}
                brand={car.brand}
                model={car.model}
              />
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {car.brand} {car.model}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {car.year} · {car.mileage?.toLocaleString("nl-NL")} km · {car.fuel} · {car.transmission}
              </p>
              <div className="flex flex-wrap items-baseline gap-4 mb-8">
                <span className="text-3xl font-bold text-blue-600">
                  € {car.price?.toLocaleString("nl-NL")},-
                </span>
                <span className="text-gray-500">Vraagprijs</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="tel:+31188809802">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Phone className="w-5 h-5 mr-2" />
                    Bel voor informatie
                  </Button>
                </a>
                <Link href="/#contact">
                  <Button size="lg" variant="outline">
                    <Mail className="w-5 h-5 mr-2" />
                    Proefrit aanvragen
                  </Button>
                </Link>
              </div>

              {/* Belangrijkste specificaties direct onder de CTA-knoppen */}
              <div className="mt-8 border-t pt-6">
                <h2 className="text-sm font-semibold text-gray-500 mb-3">Belangrijkste specificaties</h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
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
          <section className="container mx-auto px-4 py-8 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Beschrijving</h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">{car.description}</p>
          </section>
        )}

        {/* Uitrusting */}
        {car.features && car.features.length > 0 && (
          <section className="container mx-auto px-4 py-8 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Uitrusting</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {car.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Contact CTA */}
        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-2xl p-8 bg-gray-900 text-white rounded-2xl">
            <h2 className="text-xl font-bold mb-2">Interesse in deze {car.brand} {car.model}?</h2>
            <p className="text-gray-300 mb-6">
              Neem contact op voor meer informatie of om een proefrit in te plannen. Wij staan u graag te woord.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+31188809802">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Phone className="w-5 h-5 mr-2" />
                  +31 (0)18 80 98 02
                </Button>
              </a>
              <a href="mailto:info@autogarageviorel.nl">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  <Mail className="w-5 h-5 mr-2" />
                  E-mail sturen
                </Button>
              </a>
            </div>
            <div className="mt-6 flex items-center gap-2 text-gray-400 text-sm">
              <MapPin className="w-4 h-4" />
              Ambachtsstraat 1-A, 4538 AV Terneuzen
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  )
}
