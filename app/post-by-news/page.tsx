"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Newspaper, Globe, Languages, Database, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { processNews, getNewsArticles, getUserNews, getCurrentUser } from "@/lib/api"
import DatabaseSelector from "@/components/database-selector"

// News response interface
interface NewsResponse {
  task_id: string
  status: string
  country: string
  language: string
  category: string
  target_db_name: string
  user_email: string
}

// News article interface
interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
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

const categories = [
	{ code: "general", name: "General" },
	{ code: "business", name: "Business" },
	{ code: "technology", name: "Technology" },
	{ code: "entertainment", name: "Entertainment" },
	{ code: "health", name: "Health" },
	{ code: "science", name: "Science" },
	{ code: "sports", name: "Sports" },
]

export default function PostByNewsPage() {
	const [country, setCountry] = useState("")
	const [language, setLanguage] = useState("")
	const [category, setCategory] = useState("")
	const [targetDbName, setTargetDbName] = useState("")
	const [userEmail, setUserEmail] = useState("")
	const [isProcessing, setIsProcessing] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const [error, setError] = useState("")
	const [response, setResponse] = useState<NewsResponse | null>(null)
	const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
	const [isLoadingNews, setIsLoadingNews] = useState(false)

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!country || !language || !category || !userEmail) {
			setError("Please fill in all required fields")
			return
		}

		setIsProcessing(true)
		setError("")

		try {
			const formattedData = {
				country: country.toLowerCase(),
				language: language.toLowerCase(),
				category: category.toLowerCase(),
				user_email: userEmail,
				target_db_name: targetDbName || undefined
			}

			const response = await processNews(formattedData)
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

	const handleGetNews = async () => {
		if (!country || !language || !category || !userEmail) {
			setError("Please fill in all required fields")
			return
		}

		setIsLoadingNews(true)
		setError("")

		try {
			const articles = await getNewsArticles({
				country: country.toLowerCase(),
				language: language.toLowerCase(),
				category: category.toLowerCase(),
				user_email: userEmail
			})
			setNewsArticles(articles)
		} catch (err: any) {
			setError(err.message || "Failed to fetch news articles")
		} finally {
			setIsLoadingNews(false)
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
							Post by News
						</h1>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
								<h2 className="text-2xl font-bold text-white">Create Post by News</h2>
								<p className="text-gray-400 text-sm">Generate content from trending news and current events</p>
							</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-6">
							{error && (
								<div className="p-3 text-sm text-red-500 bg-red-100/10 rounded-lg">
									{error}
								</div>
							)}

							{/* Country, Language, and Category Selects */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
								<div className="space-y-2">
									<Label
										htmlFor="category"
										className="text-gray-300 text-sm font-medium flex items-center"
									>
										<Newspaper className="h-4 w-4 mr-2 text-blue-400" />
										Category
									</Label>
									<Select
										value={category}
										onValueChange={setCategory}
									>
										<SelectTrigger className="bg-gray-800/50 border border-gray-600 text-white rounded-xl">
											<SelectValue placeholder="Select a category" />
										</SelectTrigger>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category.code} value={category.code}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Target Database Selection */}
							<DatabaseSelector
								value={targetDbName}
								onValueChange={setTargetDbName}
							/>

							{/* Action Buttons */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Button
									type="submit"
									disabled={isProcessing || !country || !language || !category || !userEmail}
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
											<Newspaper className="h-5 w-5 mr-3" />
											Process News
										</>
									)}
								</Button>

								<Button
									type="button"
									onClick={handleGetNews}
									disabled={isLoadingNews || !country || !language || !category || !userEmail}
									variant="outline"
									className="w-full h-12 bg-gray-800/50 border-gray-600 text-blue-400 hover:bg-gray-700/50"
								>
									{isLoadingNews ? (
										<>
											<RefreshCw className="h-5 w-5 mr-3 animate-spin" />
											Loading News...
										</>
									) : (
										<>
											<RefreshCw className="h-5 w-5 mr-3" />
											Get News Articles
										</>
									)}
								</Button>
							</div>

							{/* Response Display */}
							{response && (
								<div className="mt-6 space-y-4">
									<div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
										<h3 className="font-semibold text-blue-400 mb-4">News Processing Started</h3>
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
											<div className="flex justify-between text-sm">
												<span className="text-gray-400">Country:</span>
												<span className="text-white">{response.country}</span>
											</div>
											<div className="flex justify-between text-sm">
												<span className="text-gray-400">Language:</span>
												<span className="text-white">{response.language}</span>
											</div>
											<div className="flex justify-between text-sm">
												<span className="text-gray-400">Category:</span>
												<span className="text-white">{response.category}</span>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* News Articles Display */}
							{newsArticles.length > 0 && (
								<div className="mt-6 space-y-4">
									<div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
										<h3 className="font-semibold text-green-400 mb-4">News Articles ({newsArticles.length})</h3>
										<div className="space-y-4 max-h-96 overflow-y-auto">
											{newsArticles.map((article, index) => (
												<div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
													<div className="flex justify-between items-start mb-2">
														<h4 className="text-white font-medium text-sm">{article.title}</h4>
														<Badge variant="outline" className="bg-blue-500/20 text-blue-400 text-xs">
															{article.source}
														</Badge>
													</div>
													<p className="text-gray-300 text-xs mb-2">{article.description}</p>
													<div className="flex justify-between items-center">
														<a 
															href={article.url} 
															target="_blank" 
															rel="noopener noreferrer"
															className="text-blue-400 text-xs hover:text-blue-300"
														>
															Read More
														</a>
														<span className="text-gray-500 text-xs">
															{new Date(article.publishedAt).toLocaleDateString()}
														</span>
													</div>
												</div>
											))}
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