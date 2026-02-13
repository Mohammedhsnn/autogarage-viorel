import { Package, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"
import Link from "next/link"

export default function OnderdelenPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/onderdelen" />

      {/* Hero */}
      <section className="relative pt-36 pb-16 lg:pt-40 lg:pb-20 bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&q=80"
            alt="Onderdelen"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Package className="w-4 h-4" />
              <span className="text-sm font-medium">Onderdelen & accessoires</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Onderdelen
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
              Voor onderdelen en accessoires voor uw auto kunt u bij ons terecht. 
              Neem contact op voor beschikbaarheid en prijzen.
            </p>
            <a href="tel:+31188809802">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Phone className="w-5 h-5 mr-2" />
                Bel voor informatie
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-lg text-gray-600 mb-8">
            Heeft u onderdelen nodig voor uw auto? Wij helpen u graag met advies en kunnen 
            veel onderdelen voor u bestellen of monteren. Kom langs of bel ons voor meer informatie.
          </p>
          <Link href="/#contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Neem contact op
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </div>
  )
}
