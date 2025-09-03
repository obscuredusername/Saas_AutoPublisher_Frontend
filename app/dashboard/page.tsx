"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SearchIcon as Keyword, Newspaper, FileText, LogOut, Bell, User, Clock, Globe } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, loading, user, isAdmin } = useAuth(true)
  
  // Debug logs
  useEffect(() => {
    console.log('Dashboard render state:', { 
      isAuthenticated, 
      loading, 
      user, 
      isAdmin: isAdmin(),
      localStorageRole: typeof window !== 'undefined' ? localStorage.getItem('user_role') : 'server',
      userRole: user?.role,
      userEmail: user?.email
    })
  }, [isAuthenticated, loading, user, isAdmin])
  const [notifications] = useState(3)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Show loading state while checking authentication
  if (loading || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-400">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  // If not authenticated, the hook will handle the redirect
  if (!isAuthenticated) {
    return null
  }

  const handleLogout = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout/`, {
        method: 'POST',
        credentials: 'include',
      })
      
      if (response.ok) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">AutoPublisher</h1>
              <nav className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/dashboard" className="text-blue-400 border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/post-by-keyword" className="text-gray-300 hover:text-white px-1 pt-1 text-sm font-medium">
                  Post by Keyword
                </Link>
                <Link href="/post-by-news" className="text-gray-300 hover:text-white px-1 pt-1 text-sm font-medium">
                  Post by News
                </Link>
                {isAdmin() && (
                  <Link href="/admin" className="text-gray-300 hover:text-white px-1 pt-1 text-sm font-medium">
                    Admin
                  </Link>
                )}
              </nav>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </Button>

                <div className="ml-3 relative">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user?.email} />
                      <AvatarFallback className="bg-blue-500 text-xs">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.email || 'User'}</span>
                    {isAdmin() && (
                      <Badge variant="outline" className="ml-2 bg-green-500/10 border-green-500/30 text-green-400 text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="ml-4 text-gray-400 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-400 hover:text-white"
              >
                <span className="sr-only">Open main menu</span>
                {showMobileMenu ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/dashboard" 
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/post-by-keyword" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                Post by Keyword
              </Link>
              <Link 
                href="/post-by-news" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                Post by News
              </Link>
              {isAdmin() && (
                <Link 
                  href="/admin" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Admin
                </Link>
              )}
              {isAdmin() && (
                <Link 
                  href="/dashboard/admin" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:bg-gray-800"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Admin Panel
                </Link>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={user?.email} />
                    <AvatarFallback className="bg-blue-500">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user?.email || 'User'}</div>
                  <div className="text-sm font-medium text-gray-400">{isAdmin() ? 'Admin' : 'User'}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="ml-auto text-gray-400 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-400">Welcome back, {user?.email || 'User'}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Recent Posts</p>
                <p className="text-2xl font-bold mt-1">24</p>
                <p className="text-xs text-green-500 mt-1">+12% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Scheduled</p>
                <p className="text-2xl font-bold mt-1">8</p>
                <p className="text-xs text-yellow-500 mt-1">2 pending approval</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500/10">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Keywords</p>
                <p className="text-2xl font-bold mt-1">156</p>
                <p className="text-xs text-green-500 mt-1">+8 new this week</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <Keyword className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6 bg-gray-900 border-gray-800 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Activity</h3>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                View All
              </Button>
            </div>
            
            <div className="mt-4 space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-start pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                  <div className="p-2 rounded-full bg-gray-800 mr-4">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New post published</p>
                    <p className="text-xs text-gray-400 mt-1">Keyword: "artificial intelligence"</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  <Badge variant="outline" className="ml-2 bg-green-500/10 border-green-500/30 text-green-400 text-xs">
                    Success
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
