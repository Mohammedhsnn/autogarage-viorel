"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Phone, Mail, MapPin, MessageCircle, X } from "lucide-react"

export default function FloatingActions() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Op /afspraak niet tonen: op telefoon overlapt de knop de datum/tijd-keuze en opent per ongeluk WhatsApp/e-mail
  if (pathname === "/afspraak") return null

  useEffect(() => {
    const HIDE_NEAR_BOTTOM_PX = 420
    const handleScroll = () => {
      const scrollY = window.scrollY || 0
      const docHeight = document.documentElement?.scrollHeight || 0
      const nearBottom = scrollY + window.innerHeight >= docHeight - HIDE_NEAR_BOTTOM_PX

      // Verberg bij de footer zodat footer-links (zoals "Articx Software") niet per ongeluk WhatsApp/E-mail openen.
      setIsVisible(scrollY > 300 && !nearBottom)
      if (nearBottom) setIsOpen(false)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isOpen && !target.closest(".floating-actions")) {
        setIsOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isOpen])

  return (
    <div className={`floating-actions fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3 transition-all duration-300 max-w-[100vw] pointer-events-none ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      {/* Action buttons - visible when open; pointer-events-auto so only these receive taps */}
      <div className={`flex flex-col gap-3 mb-2 transition-all duration-300 pointer-events-auto ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <a
          href="tel:+31618809802"
          className="flex items-center gap-3 bg-white rounded-full shadow-lg px-4 py-3 hover:shadow-xl hover:scale-105 transition-all"
        >
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium text-gray-900 pr-2">Bellen</span>
        </a>
        
        <a
          href="https://wa.me/31618809802"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white rounded-full shadow-lg px-4 py-3 hover:shadow-xl hover:scale-105 transition-all"
        >
          <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <span className="font-medium text-gray-900 pr-2">WhatsApp</span>
        </a>
        
        <a
          href="mailto:popes16@kpnmail.nl"
          className="flex items-center gap-3 bg-white rounded-full shadow-lg px-4 py-3 hover:shadow-xl hover:scale-105 transition-all"
        >
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium text-gray-900 pr-2">E-mail</span>
        </a>
        
        <a
          href="https://maps.google.com/?q=Ambachtsstraat+1-A+4538+AV+Terneuzen"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white rounded-full shadow-lg px-4 py-3 hover:shadow-xl hover:scale-105 transition-all"
        >
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium text-gray-900 pr-2">Route</span>
        </a>
      </div>

      {/* Main toggle button - min 48px touch target; pointer-events-auto so page taps pass through when closed */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto w-14 h-14 min-w-[56px] min-h-[56px] rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation ${
          isOpen 
            ? "bg-gray-900 hover:bg-gray-800 rotate-90" 
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        aria-label={isOpen ? "Menu sluiten" : "Contact opties openen"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  )
}
