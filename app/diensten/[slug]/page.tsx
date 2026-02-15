import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ArrowRight, Wrench } from "lucide-react"
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

      {/* Hero – lichtblauwe sectie bij elke diensten-subpagina */}
      <section className="pt-36 pb-14 lg:pt-40 lg:pb-20 bg-sky-100">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-sky-700 mb-6">
            <Link href="/" className="hover:text-sky-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/diensten" className="hover:text-sky-900 transition-colors">
              Diensten
            </Link>
            <span>/</span>
            <span className="text-sky-900 font-medium">{content.title}</span>
          </nav>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-sky-200/80 text-sky-900 px-4 py-2 rounded-full mb-6">
              <Wrench className="w-4 h-4" />
              <span className="text-sm font-medium">Dienst</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 text-balance leading-tight">
              {content.title}
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
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

      <Footer />
      <FloatingActions />
    </div>
  )
}
