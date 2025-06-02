"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SearchIcon as Keyword, Newspaper, LinkIcon, LogOut, Menu, Bell, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const [notifications] = useState(3)

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-30 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-white">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 ml-2">
                SocialPulse
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Bell className="h-5 w-5" />
                </Button>
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-blue-500 text-white text-xs border-0 shadow-lg shadow-blue-500/30">
                    {notifications}
                  </Badge>
                )}
              </div>

              <Link href="/">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <LogOut className="h-5 w-5" />
                </Button>
              </Link>

              <Avatar className="h-8 w-8 border-2 border-blue-500 shadow-lg shadow-blue-500/30">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to your Dashboard</h2>
          <p className="text-gray-400">Choose how you want to create your post</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Post by Keyword - Functional */}
          <Link href="/post-by-keyword" className="group">
            <Card className="h-full bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
              <div className="p-6 flex flex-col h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 relative">
                    <Keyword className="h-8 w-8 text-white" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Post by Keyword</h3>
                  <p className="text-gray-400 mb-4">Create posts based on specific keywords and target audience</p>
                </div>

                <Button className="relative z-10 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0 h-12 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50">
                  Get Started
                </Button>
              </div>
            </Card>
          </Link>

          {/* Post by News - Coming Soon */}
          <Card className="h-full bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-10">
              <Badge className="bg-gray-700/80 text-gray-300 hover:bg-gray-700/80 border-0 py-2 px-4 text-sm shadow-lg">
                Coming Soon
              </Badge>
            </div>
            <div className="p-6 flex flex-col h-full">
              <div className="flex-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-500 flex items-center justify-center mb-4 shadow-lg">
                  <Newspaper className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-500 mb-2">Post by News</h3>
                <p className="text-gray-600 mb-4">Generate posts from trending news and current events</p>
              </div>

              <Button
                disabled
                className="w-full bg-gray-800/50 text-gray-500 border-0 h-12 rounded-xl cursor-not-allowed"
              >
                Coming Soon
              </Button>
            </div>
          </Card>

          {/* Post by Link - Coming Soon */}
          <Card className="h-full bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-10">
              <Badge className="bg-gray-700/80 text-gray-300 hover:bg-gray-700/80 border-0 py-2 px-4 text-sm shadow-lg">
                Coming Soon
              </Badge>
            </div>
            <div className="p-6 flex flex-col h-full">
              <div className="flex-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-500 flex items-center justify-center mb-4 shadow-lg">
                  <LinkIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-500 mb-2">Post by Link</h3>
                <p className="text-gray-600 mb-4">Create engaging posts from any web link or URL</p>
              </div>

              <Button
                disabled
                className="w-full bg-gray-800/50 text-gray-500 border-0 h-12 rounded-xl cursor-not-allowed"
              >
                Coming Soon
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
