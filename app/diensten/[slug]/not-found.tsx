import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Wrench } from "lucide-react"

export default function DienstenNotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/diensten" />
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-xl text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dienst niet gevonden</h1>
          <p className="text-gray-600 mb-8">
            De opgevraagde dienst bestaat niet. Bekijk ons overzicht met alle diensten.
          </p>
          <Link href="/diensten">
            <Button className="bg-blue-600 hover:bg-blue-700">Alle diensten</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
