"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database } from "lucide-react"

export default function TestDatabasePage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to connect to database")
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6" />
              Supabase Database Connection Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testConnection} disabled={isLoading} className="w-full">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Testing Connection..." : "Test Connection"}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900">Connection Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                    <div className="mt-3 text-sm text-red-700">
                      <p className="font-medium">Troubleshooting steps:</p>
                      <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Check if your .env.local file exists and has the correct Supabase credentials</li>
                        <li>Verify your NEXT_PUBLIC_SUPABASE_URL is correct</li>
                        <li>Verify your SUPABASE_SERVICE_ROLE_KEY is correct</li>
                        <li>Make sure you ran the SQL script in Supabase SQL Editor</li>
                        <li>Restart your development server after changing environment variables</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result && !error && (
              <div className="space-y-4">
                <div
                  className={`p-4 border rounded-lg ${
                    result.status?.includes("✅")
                      ? "bg-green-50 border-green-200"
                      : result.status?.includes("⚠️")
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {result.status?.includes("✅") ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : result.status?.includes("⚠️") ? (
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-medium">{result.status}</h3>
                      {result.connection && (
                        <div className="mt-2 text-sm space-y-1">
                          <p>
                            <strong>Database:</strong> {result.connection.database}
                          </p>
                          <p>
                            <strong>Timestamp:</strong> {result.connection.timestamp}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {result.data && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Database Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{result.data.users}</div>
                          <div className="text-sm text-blue-900">Users</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{result.data.cars}</div>
                          <div className="text-sm text-green-900">Cars</div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{result.data.images}</div>
                          <div className="text-sm text-purple-900">Images</div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{result.data.features}</div>
                          <div className="text-sm text-orange-900">Features</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {result.needsInitialization && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-900">Database Needs Initialization</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Please run the SQL script in Supabase SQL Editor to create tables and sample data.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium mb-1">1. Create Supabase Project</h4>
              <p className="text-gray-600">Go to supabase.com and create a new project</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">2. Get Your Credentials</h4>
              <p className="text-gray-600">
                In Supabase Dashboard → Settings → API, copy your Project URL and service_role key
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">3. Update .env.local</h4>
              <p className="text-gray-600">Add your Supabase credentials to .env.local file</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">4. Run SQL Script</h4>
              <p className="text-gray-600">Copy scripts/supabase-init.sql and run it in Supabase SQL Editor</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">5. Restart Dev Server</h4>
              <p className="text-gray-600">Run: npm run dev</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
