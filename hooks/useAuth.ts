import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken, getCurrentUser } from '@/lib/api'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      const userInfo = await getCurrentUser()
      setUser(userInfo)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const requireAuth = () => {
    if (isAuthenticated === false && !loading) {
      router.push('/login')
    }
  }

  return {
    isAuthenticated,
    user,
    loading,
    requireAuth,
    checkAuth
  }
} 