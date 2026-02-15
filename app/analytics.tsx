"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {})
  }, [pathname])

  return null
}
