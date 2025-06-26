"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Globe, Languages, Zap, X, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

// Update the KeywordResponse interface
interface KeywordResponse {
  success: boolean;
  message: string;
  keyword?: string;  // Make optional since it might not always be present
  country?: string;  // Make optional
  language?: string; // Make optional
  unique_links: string[];
  links_count: number;
  status: string;
  keyword_links?: { [key: string]: string[] }; // Add keyword-specific links
}

// Update the interface to include scheduled time
interface KeywordWithTime {
  text: string;
  scheduledDate: string;
  scheduledTime: string;
  minLength?: number;
}

const countries = [
	{ code: "US", name: "United States" },
	{ code: "UK", name: "United Kingdom" },
	{ code: "CA", name: "Canada" },
	{ code: "AU", name: "Australia" },
	{ code: "DE", name: "Germany" },
	{ code: "FR", name: "France" },
	{ code: "ES", name: "Spain" },
	{ code: "IT", name: "Italy" },
	{ code: "JP", name: "Japan" },
	{ code: "KR", name: "South Korea" },
	{ code: "CN", name: "China" },
	{ code: "IN", name: "India" },
	{ code: "PK", name: "Pakistan" },
	{ code: "BD", name: "Bangladesh" },
	{ code: "BR", name: "Brazil" },
	{ code: "MX", name: "Mexico" },
	{ code: "AR", name: "Argentina" },
	{ code: "ZA", name: "South Africa" },
	{ code: "NG", name: "Nigeria" },
	{ code: "EG", name: "Egypt" },
]

const languages = [
	{ code: "EN", name: "English" },
	{ code: "ES", name: "Spanish" },
	{ code: "FR", name: "French" },
	{ code: "DE", name: "German" },
	{ code: "IT", name: "Italian" },
	{ code: "PT", name: "Portuguese" },
	{ code: "RU", name: "Russian" },
	{ code: "JA", name: "Japanese" },
	{ code: "KO", name: "Korean" },
	{ code: "ZH", name: "Chinese" },
	{ code: "HI", name: "Hindi" },
	{ code: "UR", name: "Urdu" },
	{ code: "BN", name: "Bengali" },
	{ code: "AR", name: "Arabic" },
	{ code: "TR", name: "Turkish" },
	{ code: "NL", name: "Dutch" },
	{ code: "SV", name: "Swedish" },
	{ code: "NO", name: "Norwegian" },
	{ code: "DA", name: "Danish" },
	{ code: "FI", name: "Finnish" },
]

// Function to get current UTC time in HH:mm format
const getCurrentUTCTime = () => {
  const now = new Date();
  return now.toISOString().slice(11, 16); // "HH:mm"
}

// Function to add minutes to a UTC time string (HH:mm)
const addMinutesToUTCTime = (timeStr: string, minutes: number) => {
  const [hours, mins] = timeStr.split(":").map(Number);
  const date = new Date(Date.UTC(1970, 0, 1, hours, mins));
  date.setUTCMinutes(date.getUTCMinutes() + minutes);
  return date.toISOString().slice(11, 16); // "HH:mm"
}

export default function PostByKeywordPage() {
	const [keywords, setKeywords] = useState<string[]>([])
	const [country, setCountry] = useState("")
	const [language, setLanguage] = useState("")
	const [isGenerating, setIsGenerating] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const [error, setError] = useState("") // Add error state
	const [response, setResponse] = useState<KeywordResponse | null>(null)
	const [inputValue, setInputValue] = useState("") // Add this state
	const [tempKeyword, setTempKeyword] = useState("")
	const [timeInterval, setTimeInterval] = useState<number>(30) // Time interval in minutes
	const [minLength, setMinLength] = useState<number>(100)

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
				setKeywords(prev => [...prev, ...parts]);
				e.currentTarget.value = '';
			}
		}
	}

	// Handle paste event for keywords input
	const handleKeywordPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const paste = e.clipboardData.getData('text');
		const parts = paste.split(/[\n,]+/).map(k => k.trim()).filter(Boolean);
		if (parts.length > 0) {
			setKeywords(prev => [...prev, ...parts]);
		}
	}

	const removeKeyword = (indexToRemove: number) => {
		setKeywords(prev => prev.filter((_, index) => index !== indexToRemove))
	}

	const handleAddKeyword = (e: React.FormEvent) => {
		e.preventDefault()
		if (tempKeyword.trim()) {
			setKeywords(prev => [...prev, tempKeyword.trim()])
			setTempKeyword("")
		}
	}

	// Function to generate keywords array for API (just {text})
	const generateKeywordObjects = (): { text: string }[] => {
	  return keywords.map((keyword) => ({ text: keyword }));
	};

	// Function to generate scheduled keywords with time distribution (in UTC)
	const generateScheduledKeywords = (): KeywordWithTime[] => {
	  const now = new Date();
	  const startUTCTime = getCurrentUTCTime();
	  const todayUTCStr = now.toISOString().slice(0, 10); // "yyyy-MM-dd"
	  
	  return keywords.map((keyword, index) => {
		const scheduledTime = addMinutesToUTCTime(startUTCTime, index * timeInterval);
		return {
		  text: keyword,
		  scheduledDate: todayUTCStr,
		  scheduledTime: scheduledTime,
		  minLength: minLength
		}
	  })
	}

	// Add a user email for the API request (replace with actual user email if available)
	const userEmail = "test@example.com";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (keywords.length === 0 || !country || !language) {
			setError("Please fill in all required fields")
			return
		}

		setIsGenerating(true)
		setError("")

		try {
			const formattedData = {
				keywords: generateKeywordObjects(),
				country: country.toLowerCase(),
				language: language.toLowerCase(),
				user_email: userEmail,
				minutes: timeInterval,
				min_length: minLength
			}

			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keywords`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formattedData)
			})

			const data: KeywordResponse = await response.json()

			if (!response.ok) {
				throw new Error(data.message || "Failed to generate content")
			}

			setResponse(data)
			setShowSuccess(true)

			setTimeout(() => {
				setShowSuccess(false)
			}, 3000)
		} catch (err: any) {
			setError(err.message || "An error occurred")
			console.error("API Error:", err)
		} finally {
			setIsGenerating(false)
		}
	}

	// Generate preview of scheduled times (in UTC)
	const getScheduledPreview = () => {
		if (keywords.length === 0) return []
		
		const startUTCTime = getCurrentUTCTime();
		return keywords.map((keyword, index) => {
			const scheduledTime = addMinutesToUTCTime(startUTCTime, index * timeInterval);
			return {
				keyword,
				time: scheduledTime
			}
		})
	}

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
								<Label className="text-gray-300 text-sm font-medium flex items-center">
									<Search className="h-4 w-4 mr-2 text-blue-400" />
									Add Keywords (Press Enter to add)
								</Label>
								
								<Input
									placeholder="Enter keyword and press Enter"
									onKeyDown={handleKeywordInput}
									onPaste={handleKeywordPaste}
									className="h-12 bg-gray-800/50 border border-gray-600 text-white"
								/>

								{/* Keywords List */}
								<div className="mt-4 space-y-2">
									{keywords.map((keyword, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
										>
											<span className="text-white">{keyword}</span>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => removeKeyword(index)}
												className="text-red-400 hover:text-red-300"
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>
							</div>

							{/* Time Interval Input */}
							<div className="space-y-2">
								<Label className="text-gray-300 text-sm font-medium flex items-center">
									<Clock className="h-4 w-4 mr-2 text-blue-400" />
									Time Interval Between Posts (minutes)
								</Label>
								<Input
									type="number"
									min={1}
									value={timeInterval}
									onChange={(e) => setTimeInterval(Number(e.target.value))}
									className="h-12 bg-gray-800/50 border border-gray-600 text-white"
									placeholder="30"
								/>
							</div>

							{/* Schedule Preview */}
							{keywords.length > 0 && (
								<div className="space-y-2">
									<Label className="text-gray-300 text-sm font-medium">
										Schedule Preview (Today)
									</Label>
									<div className="space-y-2 max-h-40 overflow-y-auto">
										{getScheduledPreview().map((item, index) => (
											<div
												key={index}
												className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg border border-gray-700"
											>
												<span className="text-white text-sm">{item.keyword}</span>
												<span className="text-blue-400 text-sm font-mono">{item.time}</span>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Country and Language Selects */}
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label
										htmlFor="country"
										className="text-gray-300 text-sm font-medium flex items-center"
									>
										<Globe className="h-4 w-4 mr-2 text-blue-400" />
										Country
									</Label>
									<Select
										value={country}
										onValueChange={setCountry}
									>
										<SelectTrigger className="bg-gray-800/50 border border-gray-600 text-white rounded-xl">
											<SelectValue placeholder="Select a country" />
										</SelectTrigger>
										<SelectContent>
											{countries.map((country) => (
												<SelectItem key={country.code} value={country.code}>
													{country.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="language"
										className="text-gray-300 text-sm font-medium flex items-center"
									>
										<Languages className="h-4 w-4 mr-2 text-blue-400" />
										Language
									</Label>
									<Select
										value={language}
										onValueChange={setLanguage}
									>
										<SelectTrigger className="bg-gray-800/50 border border-gray-600 text-white rounded-xl">
											<SelectValue placeholder="Select a language" />
										</SelectTrigger>
										<SelectContent>
											{languages.map((language) => (
												<SelectItem key={language.code} value={language.code}>
													{language.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Min Length Input */}
							<div className="space-y-2">
								<Label className="text-gray-300 text-sm font-medium flex items-center">
									<Zap className="h-4 w-4 mr-2 text-blue-400" />
									Minimum Length (in words)
								</Label>
								<Input
									type="number"
									min={1}
									value={minLength}
									onChange={(e) => setMinLength(Number(e.target.value))}
									className="h-12 bg-gray-800/50 border border-gray-600 text-white"
								/>
							</div>

							{/* Submit Button */}
							<div>
								<Button
									type="submit"
									disabled={isGenerating || keywords.length === 0 || !country || !language}
									className="w-full h-12 text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
								>
									{isGenerating ? (
										<>
											<svg
												className="animate-spin h-5 w-5 mr-3"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												/>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z"
												/>
											</svg>
											Generating...
										</>
									) : (
										<>
											<Search className="h-5 w-5 mr-3" />
											Generate Content
										</>
									)}
								</Button>
							</div>

							{/* Response Display */}
							{response && (
								<div className="mt-6 space-y-4">
									<div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
										<h3 className="font-semibold text-blue-400 mb-4">Search Results</h3>
										<div className="space-y-3">
											<div className="flex justify-between text-sm">
												<span className="text-gray-400">Status:</span>
												<Badge variant="outline" className="bg-green-500/20 text-green-400">
													{response.status || 'Unknown'}
												</Badge>
											</div>
											<div className="flex justify-between text-sm">
												<span className="text-gray-400">Total links found:</span>
												<span className="text-white">{response.links_count || 0}</span>
											</div>
											
											{/* Keyword-specific links */}
											{response.keyword_links && Object.keys(response.keyword_links).length > 0 && (
												<div className="mt-4">
													<h4 className="text-sm text-gray-400 mb-3">Links by Keyword:</h4>
													<div className="space-y-3">
														{Object.entries(response.keyword_links).map(([keyword, links], keywordIndex) => (
															<div key={keywordIndex} className="border border-gray-700 rounded-lg overflow-hidden">
																<div className="bg-gray-800/50 px-3 py-2 border-b border-gray-700">
																	<div className="flex items-center justify-between">
																		<span className="text-white font-medium text-sm">{keyword}</span>
																		<span className="text-blue-400 text-xs">{links.length} links</span>
																	</div>
																</div>
																<div className="max-h-32 overflow-y-auto">
																	{links.map((url, linkIndex) => (
																		<div 
																			key={linkIndex} 
																			className="text-sm p-2 bg-gray-800/30 text-gray-300 break-all border-b border-gray-700/50 last:border-b-0 hover:bg-gray-800/50 transition-colors"
																		>
																			{url}
																		</div>
																	))}
																</div>
															</div>
														))}
													</div>
												</div>
											)}

											{/* Fallback to unique_links if keyword_links not available */}
											{(!response.keyword_links || Object.keys(response.keyword_links).length === 0) && response.unique_links && response.unique_links.length > 0 && (
												<div className="mt-4">
													<h4 className="text-sm text-gray-400 mb-2">Found URLs:</h4>
													<div className="space-y-2 max-h-40 overflow-y-auto">
														{response.unique_links.map((url, index) => (
															<div 
																key={index} 
																className="text-sm p-2 bg-gray-800/50 rounded-lg text-gray-300 break-all"
															>
																{url}
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							)}
						</form>
					</CardContent>
				</Card>
			</main>
		</div>
	)
}
