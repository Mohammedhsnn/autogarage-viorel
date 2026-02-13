"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Lock, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      })

      if (!response.ok) {
        let msg = "Ongeldig wachtwoord"
        try {
          const errorData = await response.json()
          if (errorData?.error) msg = errorData.error
        } catch {
          if (response.status === 500) msg = "Inloggen is niet geconfigureerd. Controleer de serverconfiguratie."
        }
        setError(msg)
        return
      }

      localStorage.setItem("admin-logged-in", "true")
      router.push("/admin/dashboard")
    } catch {
      setError("Er is een netwerkfout opgetreden. Probeer het opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Panel</CardTitle>
            <p className="text-gray-600">Autogarage Viorel</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Wachtwoord</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Voer het adminwachtwoord in"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    minLength={8}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Inloggen..." : "Inloggen"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
