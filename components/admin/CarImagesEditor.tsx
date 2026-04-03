"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, ImagePlus, ArrowUp, ArrowDown, Star } from "lucide-react"

interface CarImagesEditorProps {
  images: string[]
  onChange: (urls: string[]) => void
  /** Toon korte uitleg over volgorde / hoofdfoto */
  showHints?: boolean
}

export function CarImagesEditor({ images, onChange, showHints = true }: CarImagesEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [uploadingImages, setUploadingImages] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openFileDialog = () => {
    if (uploadingImages) return
    fileInputRef.current?.click()
  }

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|gif)$/i.test(f.name))
    if (list.length === 0) {
      toast({
        title: "Geen afbeeldingen",
        description: "Selecteer alleen afbeeldingen (JPEG, PNG, WebP, GIF).",
        variant: "destructive",
      })
      return
    }
    setUploadingImages(true)
    try {
      const formDataUpload = new FormData()
      list.forEach((file) => formDataUpload.append("files", file))
      const res = await fetch("/api/upload?folder=cars", {
        method: "POST",
        body: formDataUpload,
        credentials: "include",
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg =
          res.status === 401 ? "Sessie verlopen. Log opnieuw in bij het adminpanel." : data.error || "Probeer het opnieuw."
        toast({ title: "Upload mislukt", description: msg, variant: "destructive" })
        if (res.status === 401) router.push("/admin")
        return
      }
      if (data.urls && data.urls.length > 0) {
        onChange([...images, ...data.urls])
        toast({
          title: "Foto's toegevoegd",
          description: `${data.urls.length} foto${data.urls.length !== 1 ? "'s" : ""} geüpload.`,
        })
      }
    } catch {
      toast({ title: "Upload mislukt", description: "Controleer je verbinding en probeer het opnieuw.", variant: "destructive" })
    } finally {
      setUploadingImages(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    await uploadFiles(files)
    e.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!uploadingImages) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (uploadingImages) return
    const files = e.dataTransfer.files
    if (!files || files.length === 0) return
    await uploadFiles(files)
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const moveImage = (index: number, direction: -1 | 1) => {
    const next = index + direction
    if (next < 0 || next >= images.length) return
    const copy = [...images]
    const [item] = copy.splice(index, 1)
    copy.splice(next, 0, item)
    onChange(copy)
  }

  const makePrimary = (index: number) => {
    if (index === 0) return
    const copy = [...images]
    const [item] = copy.splice(index, 1)
    copy.unshift(item)
    onChange(copy)
  }

  const addImageByUrl = () => {
    const url = imageUrlInput.trim()
    if (!url) return
    if (!url.startsWith("http")) {
      toast({ title: "Ongeldige link", description: "Voer een volledige URL in (bijv. https://...)", variant: "destructive" })
      return
    }
    if (images.includes(url)) {
      toast({ title: "Dubbele link", description: "Deze URL staat al in de lijst.", variant: "destructive" })
      return
    }
    onChange([...images, url])
    setImageUrlInput("")
    toast({ title: "Foto toegevoegd", description: "De afbeelding staat in de lijst." })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Label htmlFor="car-image-url" className="text-sm text-gray-600">
            Afbeelding toevoegen via link
          </Label>
          <Input
            id="car-image-url"
            type="url"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder="https://voorbeeld.nl/foto.jpg"
            className="mt-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addImageByUrl()
              }
            }}
          />
        </div>
        <Button type="button" variant="outline" onClick={addImageByUrl} className="sm:mt-6 shrink-0">
          <ImagePlus className="w-4 h-4 mr-2" />
          Link toevoegen
        </Button>
      </div>

      <div>
        <Label className="text-sm text-gray-600">Of upload vanaf uw apparaat</Label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
          onChange={handleImageUpload}
          className="sr-only"
          aria-hidden
          tabIndex={-1}
          disabled={uploadingImages}
        />
        <div
          role="button"
          tabIndex={0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              openFileDialog()
            }
          }}
          className={`mt-1 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/50"
          } ${uploadingImages ? "pointer-events-none opacity-70" : "cursor-pointer"}`}
        >
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">{isDragging ? "Laat los om te uploaden" : "Sleep foto's hierheen"}</p>
          <p className="text-sm text-gray-500 mb-4">of klik om bestanden te kiezen (JPEG, PNG, WebP, GIF – max 10 MB)</p>
          <span className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground">
            {uploadingImages ? "Bezig met uploaden..." : "Bestanden kiezen"}
          </span>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Volgorde op de website</p>
          <p className="text-xs text-gray-500">
            De eerste foto is de hoofdfoto. Gebruik de pijlen om de volgorde aan te passen, of &quot;Hoofdfoto&quot; om een foto naar voren te halen.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={`${index}-${image}`} className="relative group rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                <div className="aspect-[4/3] rounded-md overflow-hidden bg-gray-100">
                  <img src={image} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between gap-1 mt-2">
                  <span className="text-xs font-medium text-gray-600 truncate">
                    {index === 0 ? "Hoofdfoto" : `Positie ${index + 1}`}
                  </span>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={index === 0}
                      onClick={() => moveImage(index, -1)}
                      aria-label="Eerder in de volgorde"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, 1)}
                      aria-label="Later in de volgorde"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => makePrimary(index)}
                        aria-label="Maak hoofdfoto"
                        title="Maak hoofdfoto"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeImage(index)}
                      aria-label="Foto verwijderen"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {showHints && (
            <p className="text-sm text-gray-500">
              {images.length} foto{images.length !== 1 ? "'s" : ""}. Opslaan om de volgorde op de occasions-pagina te zien.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
