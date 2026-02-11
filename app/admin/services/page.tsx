"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Edit, Trash2, Settings, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Service {
  id: number
  name: string
  description: string | null
  category: string
  price: number | null
  price_label: string | null
  icon_name: string
  icon_color: string
  features: string[]
  badge_text: string | null
  badge_color: string
  button_text: string
  button_color: string
  is_pricing_card: boolean
  sort_order: number
  is_active: boolean
}

export default function ServicesManagementPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin-logged-in")
    if (!loggedIn) {
      router.push("/admin")
    } else {
      setIsLoggedIn(true)
      loadServices()
    }
  }, [router])

  const loadServices = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/services?active=false")
      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
      } else {
        toast({
          title: "Fout",
          description: "Kon diensten niet laden",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading services:", error)
      toast({
        title: "Fout",
        description: "Netwerkfout bij laden van diensten",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...services.find((s) => s.id === id),
          is_active: !currentStatus,
        }),
      })

      if (response.ok) {
        setServices(services.map((s) => (s.id === id ? { ...s, is_active: !currentStatus } : s)))
        toast({
          title: "Succes",
          description: `Dienst is nu ${!currentStatus ? "actief" : "inactief"}`,
        })
      } else {
        toast({
          title: "Fout",
          description: "Kon status niet wijzigen",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling service:", error)
      toast({
        title: "Fout",
        description: "Netwerkfout",
        variant: "destructive",
      })
    }
  }

  const deleteService = async (id: number) => {
    if (!confirm("Weet u zeker dat u deze dienst wilt verwijderen?")) return

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setServices(services.filter((s) => s.id !== id))
        toast({
          title: "Succes",
          description: "Dienst succesvol verwijderd",
        })
      } else {
        toast({
          title: "Fout",
          description: "Kon dienst niet verwijderen",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting service:", error)
      toast({
        title: "Fout",
        description: "Netwerkfout bij verwijderen",
        variant: "destructive",
      })
    }
  }

  const mainServices = services.filter((s) => s.category === "main" && !s.is_pricing_card)
  const additionalServices = services.filter((s) => s.category === "additional" && !s.is_pricing_card)
  const pricingCards = services.filter((s) => s.is_pricing_card === true)

  if (!isLoggedIn || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Terug
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Diensten Beheren</h1>
                  <p className="text-sm text-gray-500">Beheer alle diensten en tarieven</p>
                </div>
              </div>
            </div>
            <Link href="/admin/services/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nieuwe Dienst
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hoofddiensten */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hoofddiensten</h2>
          {mainServices.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-4">Nog geen hoofddiensten toegevoegd</p>
                <Link href="/admin/services/new">
                  <Button variant="outline">Voeg eerste dienst toe</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {mainServices.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                          {service.is_active ? (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Actief</span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">Inactief</span>
                          )}
                        </div>
                        {service.description && <p className="text-gray-600 mb-2">{service.description}</p>}
                        {service.price_label && (
                          <p className="text-sm font-medium text-blue-600 mb-2">{service.price_label}</p>
                        )}
                        {service.features && service.features.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {service.features.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {feature}
                              </span>
                            ))}
                            {service.features.length > 3 && (
                              <span className="text-xs text-gray-500">+{service.features.length - 3} meer</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(service.id, service.is_active)}
                        >
                          {service.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Link href={`/admin/services/${service.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => deleteService(service.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Aanvullende Services */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Aanvullende Services</h2>
          {additionalServices.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-4">Nog geen aanvullende services toegevoegd</p>
                <Link href="/admin/services/new">
                  <Button variant="outline">Voeg eerste service toe</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {additionalServices.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                          {service.is_active ? (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Actief</span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">Inactief</span>
                          )}
                        </div>
                        {service.description && <p className="text-gray-600 mb-2">{service.description}</p>}
                        {service.price_label && (
                          <p className="text-sm font-medium text-blue-600">{service.price_label}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(service.id, service.is_active)}
                        >
                          {service.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Link href={`/admin/services/${service.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => deleteService(service.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Prijzen Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prijzen Cards</h2>
          {pricingCards.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-4">Nog geen prijzen cards toegevoegd</p>
                <Link href="/admin/services/new">
                  <Button variant="outline">Voeg eerste prijzen card toe</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pricingCards.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                          {service.is_active ? (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Actief</span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">Inactief</span>
                          )}
                        </div>
                        {service.price_label && (
                          <p className="text-2xl font-bold text-blue-600 mb-2">{service.price_label}</p>
                        )}
                        {service.features && service.features.length > 0 && (
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {service.features.slice(0, 5).map((feature, idx) => (
                              <li key={idx}>{feature}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(service.id, service.is_active)}
                        >
                          {service.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Link href={`/admin/services/${service.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => deleteService(service.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
