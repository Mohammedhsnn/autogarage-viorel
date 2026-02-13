"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  const mainImage = images.length > 0 ? images[index]?.image_url : "/placeholder.svg"

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
        <img
          src="/placeholder.svg"
          alt={`${brand} ${model}`}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={`${brand} ${model} - foto ${index + 1}`}
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Vorige foto"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Volgende foto"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                i === index ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
