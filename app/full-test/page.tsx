"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Database, AlertTriangle, CheckCircle, XCircle, Plus } from "lucide-react"
import Link from "next/link"

export default function FullTestPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  const runTests = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-full")
      const results = await response.json()
      console.log("Full test results:", results)
      setTestResults(results)
    } catch (error) {
      console.error("Error running tests:", error)
      setTestResults({
        summary: { passed: 0, failed: 1, total: 1 },
        tests: [
          {
            name: "API Connection",
            status: "FAIL",
            error: error instanceof Error ? error.message : "Unknown error",
          },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  const createTestCar = async () => {
    setCreating(true)
    try {
      const response = await fetch("/api/test-full", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand: "TESTMERK",
          model: "Debug Auto",
          year: 2024,
          price: 15000,
          mileage: 1000,
          fuel: "Benzine",
          transmission: "Handgeschakeld",
          doors: 5,
          seats: 5,
          color: "Groen",
          description: "Test auto gemaakt via debug interface",
        }),
      })

      const result = await response.json()
      console.log("Test car creation result:", result)

      if (result.success) {
        alert(`Test auto succesvol aangemaakt! ID: ${result.car.id}`)
        // Refresh tests to see updated counts
        runTests()
      } else {
        alert(`Fout bij aanmaken: ${result.error}`)
      }
    } catch (error) {
      console.error("Error creating test car:", error)
      alert(`Netwerkfout: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setCreating(false)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PASS":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "FAIL":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PASS":
        return "bg-green-50 border-green-200"
      case "FAIL":
        return "bg-red-50 border-red-200"
      default:
        return "bg-yellow-50 border-yellow-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Database className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete System Test</h1>
          <p className="text-gray-600">Comprehensive testing of all system components</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button onClick={runTests} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>

          <Button onClick={createTestCar} disabled={creating} className="bg-green-600 hover:bg-green-700">
            {creating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Test Car
              </>
            )}
          </Button>

          <Link href="/debug-cars">
            <Button variant="outline" className="bg-transparent">
              View Database
            </Button>
          </Link>

          <Link href="/occasions">
            <Button variant="outline" className="bg-transparent">
              Check Occasions
            </Button>
          </Link>
        </div>

        {testResults && (
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {testResults.summary.failed === 0 ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  Test Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{testResults.summary.passed}</div>
                    <div className="text-sm text-gray-600">Passed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{testResults.summary.failed}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{testResults.summary.total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual Tests */}
            <div className="space-y-4">
              {testResults.tests.map((test: any, index: number) => (
                <Card key={index} className={`border ${getStatusColor(test.status)}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      {test.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {test.error && (
                      <div className="bg-red-100 border border-red-200 rounded-lg p-3 mb-4">
                        <h4 className="font-semibold text-red-800 mb-1">Error:</h4>
                        <p className="text-red-700 text-sm">{test.error}</p>
                      </div>
                    )}

                    {test.details && (
                      <div className="bg-gray-100 rounded-lg p-3">
                        <h4 className="font-semibold text-gray-800 mb-2">Details:</h4>
                        <pre className="text-sm text-gray-700 overflow-auto">
                          {JSON.stringify(test.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recommendations */}
            {testResults.summary.failed > 0 && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-800">🔧 Recommended Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-yellow-700">
                    {testResults.tests.some((t: any) => t.name === "Environment Variables" && t.status === "FAIL") && (
                      <div>• Check that .env.local file exists and contains DATABASE_URL and JWT_SECRET</div>
                    )}
                    {testResults.tests.some((t: any) => t.name === "Database Connection" && t.status === "FAIL") && (
                      <div>• Verify Neon database is running and DATABASE_URL is correct</div>
                    )}
                    {testResults.tests.some((t: any) => t.name === "Database Tables" && t.status === "FAIL") && (
                      <div>
                        • Run database initialization at{" "}
                        <Link href="/test-db" className="underline">
                          /test-db
                        </Link>
                      </div>
                    )}
                    {testResults.tests.some((t: any) => t.name === "Car Insert/Delete Test" && t.status === "FAIL") && (
                      <div>• Database permissions issue - check if you can write to the database</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Debug Info */}
            <Card>
              <CardHeader>
                <CardTitle>Raw Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
