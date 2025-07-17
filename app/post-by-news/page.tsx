"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Newspaper, Globe, Languages, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/api"

const countries = [
  { code: "us", name: "United States" },
  { code: "uk", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "es", name: "Spain" },
  { code: "it", name: "Italy" },
  { code: "jp", name: "Japan" },
  { code: "kr", name: "South Korea" },
  { code: "cn", name: "China" },
  { code: "in", name: "India" },
  { code: "pk", name: "Pakistan" },
  { code: "bd", name: "Bangladesh" },
  { code: "br", name: "Brazil" },
  { code: "mx", name: "Mexico" },
  { code: "ar", name: "Argentina" },
  { code: "za", name: "South Africa" },
  { code: "ng", name: "Nigeria" },
  { code: "eg", name: "Egypt" },
]

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "hi", name: "Hindi" },
  { code: "ur", name: "Urdu" },
  { code: "bn", name: "Bengali" },
  { code: "ar", name: "Arabic" },
  { code: "tr", name: "Turkish" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "no", name: "Norwegian" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
]

export default function PostByNewsPage() {
  const [categories, setCategories] = useState<{ key: string; value: number }[]>([
    { key: "finance", value: 4 },
    { key: "business", value: 2 },
    { key: "fashion", value: 3 },
  ])
  const [language, setLanguage] = useState("en")
  const [country, setCountry] = useState("us")
  const [source, setSource] = useState("google")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const user = await getCurrentUser()
        setUserEmail(user.email)
      } catch (err) {
        console.error('Failed to get user info:', err)
      }
    }
    getUserInfo()
  }, [])

  const handleCategoryChange = (index: number, field: 'key' | 'value', value: string) => {
    setCategories(prev => prev.map((cat, i) => i === index ? { ...cat, [field]: field === 'value' ? Number(value) : value } : cat))
  }

  const handleAddCategory = () => {
    setCategories(prev => [...prev, { key: '', value: 1 }])
  }

  const handleRemoveCategory = (index: number) => {
    setCategories(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError("")
    setResponse(null)
    try {
      const catObj: Record<string, number> = {}
      categories.forEach(cat => {
        if (cat.key && cat.value > 0) catObj[cat.key] = cat.value
      })
      const body = {
        categories: catObj,
        language,
        country,
        source,
      }
      const res = await fetch("http://localhost:8000/news/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Failed to schedule news")
      setResponse(await res.json())
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-30 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 ml-4">
              Post by News
            </h1>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-blue-500/20 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
          <CardContent className="relative z-10 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 relative">
                <Newspaper className="h-6 w-6 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl blur opacity-50 -z-10"></div>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-white">Schedule News by Category</h2>
                <p className="text-gray-400 text-sm">Schedule news posts for multiple categories and sources</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-100/10 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <Label className="text-gray-300 text-sm font-medium">Categories & Counts</Label>
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex gap-2 items-center mb-2">
                    <Input
                      placeholder="Category (e.g. finance)"
                      value={cat.key}
                      onChange={e => handleCategoryChange(idx, 'key', e.target.value)}
                      className="h-10 bg-gray-800/50 border border-gray-600 text-white"
                    />
                    <Input
                      type="number"
                      min={1}
                      placeholder="Count"
                      value={cat.value}
                      onChange={e => handleCategoryChange(idx, 'value', e.target.value)}
                      className="h-10 w-20 bg-gray-800/50 border border-gray-600 text-white"
                    />
                    <Button type="button" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => handleRemoveCategory(idx)}>-</Button>
                  </div>
                ))}
                <Button type="button" variant="outline" className="text-blue-400 border-blue-400" onClick={handleAddCategory}>+ Add Category</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-gray-300 text-sm font-medium">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="h-12 bg-gray-800/50 border border-gray-600 text-white rounded-xl">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-300 text-sm font-medium">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-12 bg-gray-800/50 border border-gray-600 text-white rounded-xl">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source" className="text-gray-300 text-sm font-medium">Source</Label>
                  <Select value={source} onValueChange={setSource}>
                    <SelectTrigger className="h-12 bg-gray-800/50 border border-gray-600 text-white rounded-xl">
                      <SelectValue placeholder="Select a source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="yahoo">Yahoo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={isProcessing} className="w-full h-12 text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center">
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>Schedule News</>
                )}
              </Button>
            </form>
            {response && (
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-blue-400 mb-4">Response</h3>
                <pre className="bg-gray-800/50 rounded-lg p-4 text-white text-xs overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 