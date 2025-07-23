"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Newspaper, RefreshCw, Languages } from "lucide-react"
import Link from "next/link"

export default function DedicatedNewsPage() {
  const [source, setSource] = useState("yahoo")
  const [category, setCategory] = useState("technology")
  const [max, setMax] = useState(3)
  const [language, setLanguage] = useState("en")
  const [country, setCountry] = useState("us")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [news, setNews] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setNews([])
    try {
      const params = new URLSearchParams({
        source,
        category,
        max: String(max),
        language,
        country,
      })
      const res = await fetch(`http://213.165.250.221:8000/dedicated-news/?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch news")
      const data = await res.json()
      setNews(data.rewritten || [])
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-30 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Globe className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 ml-4">
              Dedicated News Portal
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
                <h2 className="text-2xl font-bold text-white">Fetch Dedicated News</h2>
                <p className="text-gray-400 text-sm">Get news from a specific source and filters</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-100/10 rounded-lg">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source" className="text-gray-300 text-sm font-medium">Source</Label>
                  <select
                    id="source"
                    value={source}
                    onChange={e => setSource(e.target.value)}
                    className="h-12 bg-gray-800/50 border border-gray-600 text-white rounded-xl px-3"
                  >
                    <option value="yahoo">Yahoo</option>
                    <option value="google">Google</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-300 text-sm font-medium">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="h-12 bg-gray-800/50 border border-gray-600 text-white rounded-xl px-3"
                  >
                    <option value="technology">Technology</option>
                    <option value="world">World</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max" className="text-gray-300 text-sm font-medium">Max Results</Label>
                  <Input id="max" type="number" min={1} value={max} onChange={e => setMax(Number(e.target.value))} className="h-12 bg-gray-800/50 border border-gray-600 text-white" />
                </div>
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
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center">
                {loading ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                    Fetching News...
                  </>
                ) : (
                  <>Fetch News</>
                )}
              </Button>
            </form>

            {/* News Results */}
            {news.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-blue-400 mb-4">Results ({news.length})</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {news.map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium text-sm">{item.title}</h4>
                        <span className="text-blue-400 text-xs">{item.word_count} words</span>
                      </div>
                      <p className="text-gray-300 text-xs mb-2">{item.url}</p>
                      <div className="flex flex-col gap-2">
                        {item.image_urls && item.image_urls.map((img: string, i: number) => (
                          <img key={i} src={img} alt="news" className="rounded-lg max-h-40 object-cover" />
                        ))}
                      </div>
                      <div className="mt-2 text-gray-400 text-xs" dangerouslySetInnerHTML={{ __html: item.content?.slice(0, 500) + (item.content?.length > 500 ? '...' : '') }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 