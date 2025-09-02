import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getAuthToken, getCurrentUser, removeAuthToken } from '@/lib/api'
import { UserInfo } from '@/lib/api'

export interface AuthUser extends UserInfo {
  role: string;
  email: string;
}

export function useAuth(shouldRequireAuth = false) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'
  const isPublicPage = ['/login', '/signup'].includes(pathname || '')

  const checkAuth = useCallback(async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      console.log('Auth token check:', token ? 'exists' : 'missing')
      
      if (!token) {
        console.log('No auth token found')
        setIsAuthenticated(false)
        setUser(null)
        setLoading(false)
        return false
      }

      console.log('Token found, verifying with server...')
      try {
        const userInfo = await getCurrentUser()
        console.log('User info from /user/session:', userInfo)
        
        if (userInfo) {
          // Ensure we have the most up-to-date role from localStorage
          const storedRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null
          const role = storedRole || userInfo.role || 'user'
          
          const userWithRole = {
            ...userInfo,
            role: role
          }
          
          setUser(userWithRole as AuthUser)
          setIsAuthenticated(true)
          
          console.log('User authenticated successfully with role:', role)
          
          // If on login page but already authenticated, redirect to dashboard
          if (isLoginPage) {
            const redirectTo = role === 'admin' ? '/admin' : '/dashboard'
            console.log('Redirecting to:', redirectTo)
            router.push(redirectTo)
          }
          
          return true
        } else {
          console.log('No user info returned, clearing auth')
          removeAuthToken()
          setIsAuthenticated(false)
          setUser(null)
          
          // Clear any stored user data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user_role')
            localStorage.removeItem('user_email')
          }
          
          // If not on a public page, redirect to login
          if (!isPublicPage) {
            router.push(`/login?from=${encodeURIComponent(pathname || '/dashboard')}`)
          }
          
          return false
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
        removeAuthToken()
        setIsAuthenticated(false)
        setUser(null)
        
        if (!isPublicPage) {
          router.push(`/login?from=${encodeURIComponent(pathname || '/dashboard')}`)
        }
        
        return false
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
      setUser(null)
      return false
    } finally {
      setLoading(false)
    }
  }, [isLoginPage, isPublicPage, pathname, router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const requireAuth = useCallback(() => {
    if (!loading && isAuthenticated === false && !isPublicPage) {
      router.push(`/login?from=${encodeURIComponent(pathname || '/dashboard')}`)
      return false
    }
    return isAuthenticated === true
  }, [isAuthenticated, loading, isPublicPage, pathname, router])

  const isAdmin = useCallback(() => {
    // First check the user object from the hook
    if (user?.role === 'admin') return true;
    
    // Then check localStorage as fallback
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('user_role');
      console.log('Checking admin status - role:', role);
      return role === 'admin';
    }
    
    return false;
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
