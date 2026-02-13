import { notFound } from "next/navigation"
import Link from "next/link"
import { Phone, CheckCircle, ArrowRight, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"
import {
  getDienstenPaginaContent,
  DIENSTEN_SLUGS,
  getSlugForLabel,
  DIENSTEN_DROPDOWN_LABELS,
} from "@/lib/diensten-paginas"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return DIENSTEN_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const content = getDienstenPaginaContent(slug)
  if (!content) return { title: "Dienst niet gevonden" }
  return {
    title: `${content.title} | Autogarage Viorel`,
    description: content.subtitle,
  }
}

export default async function DienstenSlugPage({ params }: Props) {
  const { slug } = await params
  const content = getDienstenPaginaContent(slug)
  if (!content) notFound()

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/diensten" />

      {/* Hero */}
      <section className="relative pt-36 pb-14 lg:pt-40 lg:pb-20 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/diensten" className="hover:text-white transition-colors">
              Diensten
            </Link>
            <span>/</span>
            <span className="text-white">{content.title}</span>
          </nav>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Wrench className="w-4 h-4" />
              <span className="text-sm font-medium">Dienst</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-balance leading-tight">
              {content.title}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Inhoud */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-lg text-gray-600 leading-relaxed mb-12">
              {content.intro}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Wat wij bieden</h2>
            <ul className="space-y-4">
              {content.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Andere diensten */}
      <section className="py-12 lg:py-16 bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Overige diensten</h2>
          <div className="flex flex-wrap gap-3">
            {DIENSTEN_DROPDOWN_LABELS.filter((l) => getSlugForLabel(l) !== slug).map((label) => (
              <Link
                key={label}
                href={`/diensten/${getSlugForLabel(label)}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                {label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {content.ctaTitle}
            </h2>
            <p className="text-blue-100 mb-8">{content.ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+31188809802">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                  <Phone className="w-5 h-5 mr-2" />
                  Bel ons
                </Button>
              </a>
              <Link href="/#contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                >
                  Contact
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </div>
  )
}
