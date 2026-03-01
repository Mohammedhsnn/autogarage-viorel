import { type NextRequest, NextResponse } from "next/server"
import path from "path"
import * as jwt from "jsonwebtoken"
import { supabaseAdmin } from "@/lib/supabase"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
const STORAGE_BUCKET = "uploads"

function isAllowedFile(file: File): boolean {
  if (ALLOWED_TYPES.includes(file.type)) return true
  const ext = path.extname(file.name).toLowerCase()
  return ALLOWED_EXT.includes(ext)
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 })
    }
    jwt.verify(token, JWT_SECRET)

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const singleFile = formData.get("file") as File | null
    const toProcess: File[] = singleFile ? [singleFile] : files.filter((f) => f && typeof f.size === "number" && f.size > 0)

    if (toProcess.length === 0) {
      return NextResponse.json(
        { error: "Geen bestanden ontvangen. Selecteer één of meer foto's." },
        { status: 400 },
      )
    }

    const allowedFolders = ["cars", "onderdelen"]
    const folderParam = request.nextUrl.searchParams.get("folder") || "cars"
    const folder = allowedFolders.includes(folderParam) ? folderParam : "cars"

    const urls: string[] = []
    for (const file of toProcess) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Bestand te groot: ${file.name}. Maximaal 10 MB.` },
          { status: 400 },
        )
      }
      if (!isAllowedFile(file)) {
        return NextResponse.json(
          { error: `Ongeldig bestand: ${file.name}. Alleen JPEG, PNG, WebP of GIF.` },
          { status: 400 },
        )
      }
      const ext = path.extname(file.name) || ".jpg"
      const name = `${crypto.randomUUID()}${ext}`
      const filePath = `${folder}/${name}`
      const buffer = Buffer.from(await file.arrayBuffer())
      const contentType = file.type || "image/jpeg"

      const { data, error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, buffer, { contentType, upsert: false })

      if (error) {
        console.error("Supabase storage upload error:", error)
        if (error.message?.includes("Bucket not found") || error.message?.includes("does not exist")) {
          return NextResponse.json(
            {
              error:
                "Storage-bucket ontbreekt. Maak in Supabase Dashboard → Storage een bucket 'uploads' aan (public) en probeer opnieuw.",
            },
            { status: 502 },
          )
        }
        return NextResponse.json(
          { error: error.message || "Upload mislukt" },
          { status: 500 },
        )
      }

      const { data: urlData } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(data.path)
      urls.push(urlData.publicUrl)
    }

    return NextResponse.json({ success: true, urls })
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Sessie verlopen. Log opnieuw in." }, { status: 401 })
    }
    console.error("Upload error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload mislukt" },
      { status: 500 },
    )
  }
}
