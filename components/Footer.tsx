import Link from "next/link"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white overflow-hidden">
      {/* CTA Banner */}
      <div className="bg-sky-100">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-[100vw]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left w-full md:w-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Hulp nodig of vragen?</h3>
              <p className="text-gray-700 text-sm sm:text-base">Neem vrijblijvend contact met ons op. Wij helpen u graag!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto sm:mx-0">
              <a href="tel:+31618809802" className="w-full sm:w-auto">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto min-h-[48px]">
                  <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                  Bel ons direct
                </Button>
              </a>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white w-full sm:w-auto min-h-[48px]">
                  Stuur een bericht
                  <ChevronRight className="w-5 h-5 ml-2 flex-shrink-0" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-[100vw]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">V</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Autogarage Viorel</h3>
                <p className="text-sm text-gray-400">Eerlijk, betaalbaar, betrouwbaar</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Uw betrouwbare partner voor autoonderhoud, reparaties, APK keuringen (via 
              RDW-erkende partner) en kwaliteit occasions in Terneuzen en omgeving.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Snelle Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/occasions" className="text-gray-400 hover:text-white transition-colors">
                  Occasions
                </Link>
              </li>
              <li>
                <Link href="/diensten" className="text-gray-400 hover:text-white transition-colors">
                  Werkplaats
                </Link>
              </li>
              <li>
                <Link href="/#over-ons" className="text-gray-400 hover:text-white transition-colors">
                  Over ons
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Diensten</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/diensten" className="text-gray-400 hover:text-white transition-colors">
                  Onderhoud & Reparaties
                </Link>
              </li>
              <li>
                <Link href="/diensten" className="text-gray-400 hover:text-white transition-colors">
                  APK Keuring
                </Link>
              </li>
              <li>
                <Link href="/occasions" className="text-gray-400 hover:text-white transition-colors">
                  In- & Verkoop Auto's
                </Link>
              </li>
              <li>
                <Link href="/diensten" className="text-gray-400 hover:text-white transition-colors">
                  Banden Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  Ambachtsstraat 1-A<br />
                  4538 AV Terneuzen
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a href="tel:+31618809802" className="text-gray-400 hover:text-white transition-colors">
                  +31 (6)18 80 98 02
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a href="mailto:popes16@kpnmail.nl" className="text-gray-400 hover:text-white transition-colors">
                  popes16@kpnmail.nl
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  Ma - Za: 09:00 - 17:00<br />
                  Zo: gesloten
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar - stacked on mobile, row on desktop; relative z-[50] zodat taps op Articx Software niet door FloatingActions (Route/Maps) worden opgevangen op telefoon */}
      <div className="relative z-[50] border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-5 sm:py-6 max-w-[100vw]">
          <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-0 text-center">
            <p className="text-gray-500 text-xs sm:text-sm order-2 md:order-1 md:flex-1 md:text-left">
              © {new Date().getFullYear()} Autogarage Viorel. Alle rechten voorbehouden.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm order-1 md:order-2 md:flex-1 md:flex md:justify-center md:items-baseline">
              Gemaakt door{" "}
              <a
                href="https://articxsoftware.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-gray-400 hover:text-white transition-colors px-1.5 py-1 rounded cursor-pointer touch-manipulation"
              >
                Articx Software
              </a>
            </p>
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm order-3 md:flex-1 md:justify-end flex-wrap md:items-baseline">
              <Link href="#" className="text-gray-500 hover:text-white transition-colors py-1">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white transition-colors py-1">
                Algemene Voorwaarden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
