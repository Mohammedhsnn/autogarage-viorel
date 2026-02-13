"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, Menu, X, Clock, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DIENSTEN_DROPDOWN_LABELS, getSlugForLabel } from "@/lib/diensten-paginas"

interface HeaderProps {
  currentPage?: string
}

export default function Header({ currentPage = "" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileDienstenOpen, setMobileDienstenOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
      {/* Top bar */}
      <div className="bg-gray-900 text-white py-2.5 hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-8">
              <a href="tel:+31188809802" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="font-medium">+31 (0)18 80 98 02</span>
              </a>
              <a href="mailto:info@autogarageviorel.nl" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@autogarageviorel.nl</span>
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Ma-Vr: 08:00-17:00 | Za: 09:00-15:00</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4" />
              <span>Ambachtsstraat 1-A, 4538 AV Terneuzen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Autogarage Viorel"
                className="h-12 w-auto object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Autogarage Viorel</h1>
                <p className="text-xs text-gray-500">Eerlijk, betaalbaar, betrouwbaar</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === "/"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Home
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 outline-none ${
                    currentPage === "/diensten"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Diensten
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[240px] max-h-[70vh] overflow-y-auto">
                  <DropdownMenuItem asChild>
                    <Link href="/diensten" className="cursor-pointer font-medium">
                      Alle diensten
                    </Link>
                  </DropdownMenuItem>
                  <div className="h-px bg-gray-200 my-1" />
                  {DIENSTEN_DROPDOWN_LABELS.map((label) => (
                    <DropdownMenuItem key={label} asChild>
                      <Link href={`/diensten/${getSlugForLabel(label)}`} className="cursor-pointer">
                        {label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="/occasions"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === "/occasions"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Occasions
              </Link>
              <Link
                href="/onderdelen"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === "/onderdelen"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Onderdelen
              </Link>
              <Link
                href="/#contact"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === "/#contact"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="tel:+31188809802">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent">
                  <Phone className="w-4 h-4 mr-2" />
                  Bel ons
                </Button>
              </a>
              <Link href="/afspraak">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Afspraak maken
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Menu sluiten" : "Menu openen"}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden bg-white border-t overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-screen" : "max-h-0"}`}>
        <div className="container mx-auto px-4 py-4">
          {/* Mobile contact info */}
          <div className="flex flex-col gap-2 pb-4 mb-4 border-b text-sm">
            <a href="tel:+31188809802" className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>+31 (0)18 80 98 02</span>
            </a>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Ma-Vr: 08:00-17:00 | Za: 09:00-15:00</span>
            </div>
          </div>
          
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              className={`font-medium py-3 px-4 rounded-lg transition-colors ${
                currentPage === "/" ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <div>
              <button
                type="button"
                className={`font-medium py-3 px-4 rounded-lg transition-colors w-full flex items-center justify-between ${
                  currentPage === "/diensten" ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setMobileDienstenOpen(!mobileDienstenOpen)}
              >
                Diensten
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${mobileDienstenOpen ? "rotate-90" : ""}`}
                />
              </button>
              <div className={`overflow-hidden transition-all ${mobileDienstenOpen ? "max-h-[500px]" : "max-h-0"}`}>
                <Link
                  href="/diensten"
                  className="block py-2 pl-6 pr-4 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Alle diensten
                </Link>
                {DIENSTEN_DROPDOWN_LABELS.map((label) => (
                  <Link
                    key={label}
                    href={`/diensten/${getSlugForLabel(label)}`}
                    className="block py-2 pl-6 pr-4 text-gray-600 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/occasions"
              className={`font-medium py-3 px-4 rounded-lg transition-colors ${
                currentPage === "/occasions" ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Occasions
            </Link>
            <Link
              href="/onderdelen"
              className={`font-medium py-3 px-4 rounded-lg transition-colors ${
                currentPage === "/onderdelen" ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Onderdelen
            </Link>
            <Link
              href="/#contact"
              className={`font-medium py-3 px-4 rounded-lg transition-colors ${
                currentPage === "/#contact" ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t">
              <a href="tel:+31188809802" className="w-full">
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 bg-transparent">
                  <Phone className="w-4 h-4 mr-2" />
                  +31 (0)18 80 98 02
                </Button>
              </a>
              <Link href="/afspraak" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Afspraak maken
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
