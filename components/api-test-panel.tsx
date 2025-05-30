"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, Search, Info } from "lucide-react"

interface TestResult {
  success: boolean
  message: string
  data?: any
  error?: string
}

export function APITestPanel() {
  const [connectionStatus, setConnectionStatus] = useState<TestResult | null>(null)
  const [searchResult, setSearchResult] = useState<TestResult | null>(null)
  const [partDetailsResult, setPartDetailsResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [searchParams, setSearchParams] = useState({
    make: "Ford",
    model: "F-150",
    year: "2020",
    partType: "brake caliper",
  })

  const [partNumber, setPartNumber] = useState("")

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-connection")
      const result = await response.json()
      setConnectionStatus(result)
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: "Failed to test connection",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
    setIsLoading(false)
  }

  const testSearch = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchParams),
      })
      const result = await response.json()
      setSearchResult(result)
    } catch (error) {
      setSearchResult({
        success: false,
        message: "Failed to test search",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
    setIsLoading(false)
  }

  const testPartDetails = async () => {
    if (!partNumber.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/test-part-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partNumber }),
      })
      const result = await response.json()
      setPartDetailsResult(result)
    } catch (error) {
      setPartDetailsResult({
        success: false,
        message: "Failed to test part details",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
    setIsLoading(false)
  }

  const ResultCard = ({ title, result, icon }: { title: string; result: TestResult | null; icon: React.ReactNode }) => (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-sm">{title}</CardTitle>
          {result && (
            <Badge variant={result.success ? "default" : "destructive"}>{result.success ? "Success" : "Failed"}</Badge>
          )}
        </div>
      </CardHeader>
      {result && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-2">{result.message}</p>
          {result.data && (
            <Textarea value={JSON.stringify(result.data, null, 2)} readOnly className="font-mono text-xs h-32" />
          )}
          {result.error && (
            <div className="bg-destructive/10 p-2 rounded text-sm text-destructive">Error: {result.error}</div>
          )}
        </CardContent>
      )}
    </Card>
  )

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Intella Parts API Integration Test</CardTitle>
          <CardDescription>Test your API connection and functionality before using it in the chatbot</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Test */}
          <div>
            <Button onClick={testConnection} disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              Test API Connection
            </Button>
            <ResultCard title="Connection Test" result={connectionStatus} icon={<CheckCircle className="h-4 w-4" />} />
          </div>

          {/* Search Test */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Test Parts Search</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  value={searchParams.make}
                  onChange={(e) => setSearchParams({ ...searchParams, make: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={searchParams.model}
                  onChange={(e) => setSearchParams({ ...searchParams, model: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={searchParams.year}
                  onChange={(e) => setSearchParams({ ...searchParams, year: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="partType">Part Type</Label>
                <Input
                  id="partType"
                  value={searchParams.partType}
                  onChange={(e) => setSearchParams({ ...searchParams, partType: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={testSearch} disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              Test Parts Search
            </Button>
            <ResultCard title="Search Test" result={searchResult} icon={<Search className="h-4 w-4" />} />
          </div>

          {/* Part Details Test */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Test Part Details</Label>
            <div>
              <Label htmlFor="partNumber">Part Number</Label>
              <Input
                id="partNumber"
                placeholder="Enter a part number to test"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
              />
            </div>
            <Button onClick={testPartDetails} disabled={isLoading || !partNumber.trim()} className="w-full">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Info className="h-4 w-4 mr-2" />}
              Test Part Details
            </Button>
            <ResultCard title="Part Details Test" result={partDetailsResult} icon={<Info className="h-4 w-4" />} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
