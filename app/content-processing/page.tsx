"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileText, Globe, Languages, Database, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { processContentKeywords, getCurrentUser } from "@/lib/api"
import CollectionSelector from "@/components/database-selector"

// Content response interface
interface ContentResponse {
  task_id: string
  status: string
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

export default function ContentProcessingPage() {
	const [keywords, setKeywords] = useState<string[]>([])
	const [country, setCountry] = useState("")
	const [language, setLanguage] = useState("")
	const [targetDbName, setTargetDbName] = useState("")
	const [userEmail, setUserEmail] = useState("")
	const [isProcessing, setIsProcessing] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const [error, setError] = useState("")
	const [response, setResponse] = useState<ContentResponse | null>(null)
	const [tempKeyword, setTempKeyword] = useState("")
	const [minLength, setMinLength] = useState<number>(500)

	// Get user email on component mount
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

	// Function to generate keywords array for API
	const generateKeywordObjects = (): { text: string; minLength?: number }[] => {
	  return keywords.map((keyword) => ({ 
	    text: keyword,
	    minLength: minLength
	  }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (keywords.length === 0 || !country || !language || !userEmail) {
			setError("Please fill in all required fields")
			return
		}

		setIsProcessing(true)
		setError("")

		try {
			const formattedData = {
				keywords: generateKeywordObjects(),
				country: country.toLowerCase(),
				language: language.toLowerCase(),
				user_email: userEmail,
				target_db_name: targetDbName || undefined
			}

			const response = await processContentKeywords(formattedData)
			setResponse(response)
			setShowSuccess(true)

			setTimeout(() => {
				setShowSuccess(false)
			}, 3000)
		} catch (err: any) {
			setError(err.message || "An error occurred")
			console.error("API Error:", err)
		} finally {
			setIsProcessing(false)
		}
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
							Content Processing
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
								<FileText className="h-6 w-6 text-white" />
								<div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl blur opacity-50 -z-10"></div>
							</div>
							<div className="ml-4">
								<h2 className="text-2xl font-bold text-white">Process Content Keywords</h2>
								<p className="text-gray-400 text-sm">Generate content based on specific keywords</p>
							</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-6">
							{error && (
								<div className="p-3 text-sm text-red-500 bg-red-100/10 rounded-lg">
									{error}
								</div>
							)}

							{/* Keyword Input Section */}
							<div className="space-y-4">
								<Label className="text-gray-300 text-sm font-medium flex items-center">
									<FileText className="h-4 w-4 mr-2 text-blue-400" />
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
									<FileText className="h-4 w-4 mr-2 text-blue-400" />
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

							{/* Target Collection Selection */}
							<CollectionSelector
								value={targetDbName}
								onValueChange={setTargetDbName}
								label="Select Target Collection"
								showManageLink={false}
							/>

							{/* Submit Button */}
							<div>
								<Button
									type="submit"
									disabled={isProcessing || keywords.length === 0 || !country || !language || !userEmail}
									className="w-full h-12 text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
								>
									{isProcessing ? (
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
											Processing...
										</>
									) : (
										<>
											<FileText className="h-5 w-5 mr-3" />
											Process Content
										</>
									)}
								</Button>
							</div>

							{/* Response Display */}
							{response && (
								<div className="mt-6 space-y-4">
									<div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
										<h3 className="font-semibold text-blue-400 mb-4">Content Processing Started</h3>
										<div className="space-y-3">
											<div className="flex justify-between text-sm">
												<span className="text-gray-400">Task ID:</span>
												<span className="text-white font-mono text-xs">{response.task_id}</span>
											</div>
											<div className="flex justify-between text-sm">
												<span className="text-gray-400">Status:</span>
												<Badge variant="outline" className="bg-green-500/20 text-green-400">
													{response.status}
												</Badge>
											</div>
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