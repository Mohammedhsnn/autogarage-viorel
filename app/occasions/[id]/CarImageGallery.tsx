"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface CarImage {
  id: number
  car_id: number
  image_url: string
  is_primary: boolean
  sort_order: number
}

export function CarImageGallery({
  images,
  brand,
  model,
}: {
  images: CarImage[]
  brand: string
  model: string
}) {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const mainImage = images.length > 0 ? images[index]?.image_url : "/placeholder.svg"

  useEffect(() => {
    setMounted(true)
  }, [])

  const goPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : images.length - 1))
  }, [images.length])

  const goNext = useCallback(() => {
    setIndex((i) => (i < images.length - 1 ? i + 1 : 0))
  }, [images.length])

  const openLightbox = (atIndex?: number) => {
    if (atIndex !== undefined) setIndex(atIndex)
    setLightboxOpen(true)
  }

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (images.length > 1) {
        if (e.key === "ArrowLeft") {
          e.preventDefault()
          goPrev()
        }
        if (e.key === "ArrowRight") {
          e.preventDefault()
          goNext()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lightboxOpen, closeLightbox, goPrev, goNext, images.length])

  const onLightboxTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const onLightboxTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || images.length <= 1) {
      touchStartX.current = null
      touchStartY.current = null
      return
    }
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const dx = endX - touchStartX.current
    const dy = endY - (touchStartY.current ?? endY)
    touchStartX.current = null
    touchStartY.current = null
    if (Math.abs(dx) < 56) return
    if (Math.abs(dx) < Math.abs(dy) * 1.2) return
    if (dx > 0) goPrev()
    else goNext()
  }

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] max-h-[min(52vh,420px)] sm:max-h-none rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100">
        <img
          src="/placeholder.svg"
          alt={`${brand} ${model}`}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  const lightbox =
    mounted &&
    lightboxOpen &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] flex flex-col bg-black"
        role="dialog"
        aria-modal="true"
        aria-label={`Foto’s ${brand} ${model}`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
          <p className="text-sm font-medium text-white/90 tabular-nums">
            {index + 1} / {images.length}
          </p>
          <button
            type="button"
            onClick={closeLightbox}
            className="rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 touch-manipulation"
            aria-label="Sluiten"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div
          className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-[max(1rem,env(safe-area-inset-bottom))]"
          onClick={closeLightbox}
        >
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className="absolute left-1 sm:left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 touch-manipulation"
              aria-label="Vorige foto"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}
          <div
            className="absolute inset-x-10 bottom-0 top-0 flex max-h-full items-center justify-center sm:inset-x-14"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onLightboxTouchStart}
            onTouchEnd={onLightboxTouchEnd}
          >
            <img
              src={images[index]?.image_url}
              alt={`${brand} ${model} - foto ${index + 1}`}
              className="max-h-[min(88vh,100%)] max-w-full object-contain select-none"
              draggable={false}
            />
          </div>
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className="absolute right-1 sm:right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 touch-manipulation"
              aria-label="Volgende foto"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
        </div>
        <p className="sr-only">Veeg links of rechts om tussen foto’s te wisselen.</p>
      </div>,
      document.body,
    )

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="relative aspect-[4/3] max-h-[min(52vh,420px)] sm:max-h-none overflow-hidden rounded-xl bg-gray-100 shadow-sm sm:rounded-2xl sm:shadow-none">
        <button
          type="button"
          className="absolute inset-0 z-0 block w-full cursor-zoom-in"
          onClick={() => openLightbox()}
          aria-label="Foto vergroten (fullscreen)"
        >
          <img
            src={mainImage}
            alt={`${brand} ${model} - foto ${index + 1}`}
            className="pointer-events-none h-full w-full object-cover"
          />
        </button>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/85 shadow-md backdrop-blur-sm touch-manipulation sm:left-3 sm:h-11 sm:w-11"
              aria-label="Vorige foto"
            >
              <ChevronLeft className="h-5 w-5 text-slate-700" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/85 shadow-md backdrop-blur-sm touch-manipulation sm:right-3 sm:h-11 sm:w-11"
              aria-label="Volgende foto"
            >
              <ChevronRight className="h-5 w-5 text-slate-700" />
            </button>
            <div
              className="pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm tabular-nums"
              aria-hidden
            >
              {index + 1} / {images.length}
            </div>
          </>
        )}
        <span
          className="pointer-events-none absolute right-2 top-2 z-10 rounded-md bg-black/40 px-2 py-1 text-[11px] font-medium text-white/95 sm:text-xs"
          aria-hidden
        >
          Tik om te vergroten
        </span>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:thin] sm:gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => openLightbox(i)}
              className={`h-[4.5rem] w-[4.5rem] flex-shrink-0 snap-start overflow-hidden rounded-lg border-2 transition-colors touch-manipulation sm:h-20 sm:w-20 ${
                i === index ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"
              }`}
              aria-label={`Foto ${i + 1}${i === index ? " (actief)" : ""}, open fullscreen`}
            >
              <img src={img.image_url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox}
    </div>
  )
}
