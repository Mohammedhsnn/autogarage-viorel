"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type HeroSlide = {
  src: string
  alt: string
  caption?: string
}

export default function HeroPhotoSlider({ slides, intervalMs = 4500 }: { slides: HeroSlide[]; intervalMs?: number }) {
  const safeSlides = useMemo(() => slides.filter((s) => typeof s?.src === "string" && s.src.trim().length > 0), [slides])
  const [activeIndex, setActiveIndex] = useState(0)
  const hasMultiple = safeSlides.length > 1

  useEffect(() => {
    if (!hasMultiple) return

    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % safeSlides.length)
    }, intervalMs)

    return () => clearInterval(t)
  }, [hasMultiple, intervalMs, safeSlides.length])

  if (safeSlides.length === 0) return null

  const active = safeSlides[Math.min(activeIndex, safeSlides.length - 1)]

  const goPrev = () => setActiveIndex((i) => (i - 1 + safeSlides.length) % safeSlides.length)
  const goNext = () => setActiveIndex((i) => (i + 1) % safeSlides.length)

  return (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-[28px] bg-gray-200 shadow-2xl ring-1 ring-white/40">
        {/* Background gradient frame */}
        <div
          className="absolute -inset-6 bg-gradient-to-br from-sky-200/35 via-blue-200/20 to-white/0 blur-2xl"
          aria-hidden
        />

        {/* Image */}
        <div className="relative aspect-[16/10]">
          <img
            key={active.src}
            src={active.src}
            alt={active.alt}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/65 via-gray-950/15 to-transparent" aria-hidden />

          {/* Caption */}
          {active.caption ? (
            <div className="absolute bottom-5 left-5 right-5">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/90 backdrop-blur-sm border border-sky-200/70 px-4 py-2 shadow-sm">
                <span className="text-sm font-semibold text-gray-900">{active.caption}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Controls */}
      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Vorige foto"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/70 backdrop-blur border border-sky-200/60 shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-900 mx-auto" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Volgende foto"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/70 backdrop-blur border border-sky-200/60 shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <ChevronRight className="w-5 h-5 text-gray-900 mx-auto" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2 mt-4 justify-start">
            {safeSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Ga naar slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  idx === activeIndex ? "w-8 bg-sky-600" : "w-2.5 bg-sky-200 hover:bg-sky-400"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

