"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Globe, Languages, Zap, X, Clock, RefreshCw, Database, Clock3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { generateKeywords, getCurrentUser } from "@/lib/api"

// Update the KeywordResponse interface to match the CURL response
interface KeywordResponse {
  task_id: string
  status: string
}

// Update the TaskStatus interface
interface TaskStatus {
  task_id: string
  status: string
  result?: string
}

// Update the interface to include scheduled time
interface GenerateKeywordsRequest {
  keywords: Array<{
    text: string;
    min_length?: number;
    scheduled_time: string;
  }>;
  country: string;
  language: string;
  tone: string;
  word_count: number;
  min_words: number;
}

interface KeywordWithTime {
  text: string
  scheduledDate: string
  scheduledTime: string
  minLength?: number
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

// Function to get current UTC time in HH:mm format
const getCurrentUTCTime = () => {
  const now = new Date();
  return now.toISOString().slice(11, 16); // "HH:mm"
}

// Function to add minutes to a time string (HH:MM format)
const addMinutesToTime = (timeStr: string, minutes: number): string => {
  const [hours, mins] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, mins, 0, 0);
  date.setMinutes(date.getMinutes() + minutes);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

const calculateScheduledTimes = (startTime: string, count: number, delay: number): string[] => {
  const times: string[] = [];
  let currentTime = startTime;
  
  for (let i = 0; i < count; i++) {
    times.push(currentTime);
    if (i < count - 1) {
      currentTime = addMinutesToTime(currentTime, delay);
    }
  }
  
  return times;
};

export default function PostByKeywordPage() {
  const [keywords, setKeywords] = useState<KeywordWithTime[]>([])
  const [country, setCountry] = useState("")
  const [language, setLanguage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [response, setResponse] = useState<KeywordResponse | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [tempKeyword, setTempKeyword] = useState("")
  const [minLength, setMinLength] = useState<number>(500)
  // Set startDateTime to current time in local timezone
  const [startDateTime, setStartDateTime] = useState(() => {
    const now = new Date();
    // Format as YYYY-MM-DDTHH:MM in local timezone
    const localIsoString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();
    return localIsoString.slice(0, 16);
  });
  const [delayMinutes, setDelayMinutes] = useState<number>(10) // Default 10 minutes delay between posts
  const [isEditingTime, setIsEditingTime] = useState<number | null>(null);
  const [editTimeValue, setEditTimeValue] = useState("");

  // Random suggestions for keywords
  const [suggestions] = useState([
    "digital marketing",
    "social media",
    "content creation",
    "brand awareness",
    "engagement strategies",
    "viral content",
  ])

  // Animation for suggestions
  const [currentSuggestion, setCurrentSuggestion] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % suggestions.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [suggestions.length])

  // Enhanced keyword input handler
  const handleKeywordInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const parts = value.split(/[\n,]+/).map(k => k.trim()).filter(Boolean);
      if (parts.length > 0) {
        const newKeywords = parts.map(part => ({
          text: part,
          scheduledDate: startDateTime.split('T')[0],
          scheduledTime: startDateTime.split('T')[1],
          minLength: minLength
        }));
        setKeywords(prev => [...prev, ...newKeywords]);
        e.currentTarget.value = '';
      }
    }
  }

  // Handle paste event for keywords input
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text/plain')
    const [scheduledDate, scheduledTime] = startDateTime.split('T')
    const newKeywords = pastedText
      .split(/[\n,]+/)
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0)
      .map(keyword => ({
        text: keyword,
        scheduledDate,
        scheduledTime,
        minLength: minLength,
      }))
    setKeywords([...keywords, ...newKeywords])
    setTempKeyword('');
  };

  const addKeyword = (e: React.FormEvent) => {
    e.preventDefault()
    if (tempKeyword.trim()) {
      const [scheduledDate, baseTime] = startDateTime.split('T');
      const scheduledTimes = calculateScheduledTimes(
        baseTime,
        keywords.length + 1, // +1 for the new keyword
        delayMinutes
      );
      
      setKeywords(prev => [
        ...prev,
        {
          text: tempKeyword.trim(),
          scheduledDate,
          scheduledTime: scheduledTimes[prev.length], // Get the time for this keyword
          minLength: minLength,
        },
      ])
      setTempKeyword("")
    }
  }

  const removeKeyword = (indexToRemove: number) => {
    setKeywords(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleTimeEditStart = (index: number, currentTime: string) => {
    setIsEditingTime(index);
    setEditTimeValue(currentTime);
  };

  const handleTimeEditSave = (index: number) => {
    if (editTimeValue) {
      setKeywords(prev => 
        prev.map((kw, i) => 
          i === index 
            ? { ...kw, scheduledTime: editTimeValue }
            : kw
        )
      );
    }
    setIsEditingTime(null);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTimeValue(e.target.value);
  };

  // Function to generate keywords array for API
  const generateKeywordObjects = () => {
    // Calculate scheduled times with delay between each keyword
    const scheduledTimes = calculateScheduledTimes(
      startDateTime.split('T')[1],
      keywords.length,
      delayMinutes
    );

    return keywords.map((keyword, index) => ({
      text: keyword.text,
      min_length: minLength,
      scheduled_time: `${keyword.scheduledDate}T${scheduledTimes[index]}:00Z`
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (keywords.length === 0) {
      setError('Please add at least one keyword');
      return;
    }

    if (!country || !language) {
      setError('Please select both country and language');
      return;
    }

    setIsGenerating(true);
    setError('');
    setShowSuccess(false);

    try {
      const keywordObjects = generateKeywordObjects();
      
      const response = await generateKeywords({
        keywords: keywordObjects,
        country,
        language,
        tone: 'professional',
        word_count: 500,
        min_words: minLength
      } as GenerateKeywordsRequest) as unknown as KeywordResponse;

      setResponse(response);
      setShowSuccess(true);
      setKeywords([]);
      setTempKeyword('');
    } catch (err) {
      console.error('Error generating keywords:', err);
      setError('Failed to generate keywords. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
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
              Post by Keyword
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
                <Search className="h-6 w-6 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl blur opacity-50 -z-10"></div>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-white">Create Post by Keyword</h2>
                <p className="text-gray-400 text-sm">Generate engaging content for your social media</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Keyword Input Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Enter keyword"
                      value={tempKeyword}
                      onChange={(e) => setTempKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addKeyword(e)}
                      onPaste={handlePaste}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={addKeyword}
                      variant="outline"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Keywords List */}
                {keywords.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Keywords</Label>
                    <div className="space-y-2">
                      {keywords.map((keyword, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg bg-gray-800/50">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{keyword.text}</span>
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <span>(Scheduled: {keyword.scheduledDate} at</span>
                              {isEditingTime === index ? (
                                <div className="flex items-center space-x-1">
                                  <input
                                    type="time"
                                    value={editTimeValue}
                                    onChange={handleTimeChange}
                                    className="bg-gray-700 text-white text-xs px-1 py-0.5 rounded w-20"
                                    step="300"
                                  />
                                  <button 
                                    onClick={() => handleTimeEditSave(index)}
                                    className="text-green-400 hover:text-green-300"
                                  >
                                    ✓
                                  </button>
                                  <button 
                                    onClick={() => setIsEditingTime(null)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <span>{keyword.scheduledTime}</span>
                                  <button 
                                    onClick={() => handleTimeEditStart(index, keyword.scheduledTime)}
                                    className="ml-1 text-blue-400 hover:text-blue-300"
                                  >
                                    ✏️
                                  </button>
                                </div>
                              )}
                              <span>)</span>
                            </div>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeKeyword(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            {/* Country Selection */}
            <div className="space-y-2">
              <Label>Country</Label>
              <Select onValueChange={setCountry} value={country}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <Label>Language</Label>
              <Select onValueChange={setLanguage} value={language}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Minimum Length */}
            <div className="space-y-2">
              <Label htmlFor="minLength">Minimum Length (words)</Label>
              <Input
                id="minLength"
                type="number"
                value={minLength}
                onChange={(e) => setMinLength(Number(e.target.value))}
                min="100"
                step="100"
                className="w-full"
              />
            </div>

            {/* Time Delay Between Posts */}
            <div className="space-y-2">
              <Label htmlFor="delayMinutes">Delay Between Posts (minutes)</Label>
              <Input
                id="delayMinutes"
                type="number"
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(Number(e.target.value))}
                min="1"
                step="1"
                className="w-full"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-6" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>

            {/* Error and Success Messages */}
            {error && (
              <div className="text-sm text-red-500 p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            {showSuccess && (
              <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
                Content generated successfully!
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
    </div>
  );
}
