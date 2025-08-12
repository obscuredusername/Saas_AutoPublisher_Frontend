import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken, getCurrentUser } from '@/lib/api'

export interface AuthUser extends UserInfo {
  role: string;
  email: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    try {
      const token = getAuthToken()
      console.log('Auth token:', token ? 'exists' : 'missing')
      
      if (!token) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      console.log('Fetching current user info...')
      const userInfo = await getCurrentUser()
      console.log('User info from /auth/me:', userInfo)
      
      setUser(userInfo as AuthUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const requireAuth = useCallback(() => {
    if (isAuthenticated === false && !loading) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  const isAdmin = useCallback(() => {
    return user?.role === 'admin'
  }, [user])

  return {
    isAuthenticated,
    user,
    loading,
    requireAuth,
    isAdmin,
    checkAuth
  }
}