"use client"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import authService from "@/lib/services/auth-service"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Prevent infinite loops with refs
  const initializingRef = useRef(false)
  const lastPathnameRef = useRef('')

  // Public routes that don't require authentication
  const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/verify",
    "/error",
    "/auth/callback/google",
    "/callback",
    "/",
  ]

  // Check if current route is public
  const isPublicRoute = useCallback((path) => {
    return publicRoutes.some(publicRoute => 
      path === publicRoute || path.startsWith(publicRoute + '/')
    )
  }, [publicRoutes])

  // Centralized redirect logic
  const redirectAfterLogin = useCallback((role) => {
    console.log('Redirecting user with role:', role)
    
    const roleRedirects = {
      superAdmin: '/admin/dashboard',
      admin: '/admin/dashboard',
      manager: '/dashboard',
      tailor: '/dashboard/tasks',
      embroideryMan: '/dashboard/tasks', 
      stoneMan: '/dashboard/tasks',
      user: '/profile'
    }

    const redirectPath = roleRedirects[role] || '/profile'
    
    // Only redirect if we're not already on the target path
    if (pathname !== redirectPath) {
      console.log('Redirecting to:', redirectPath)
      router.replace(redirectPath)
    } else {
      console.log('Already on target path:', redirectPath)
    }
  }, [router, pathname])

  const initializeAuth = useCallback(async () => {
    // Prevent multiple simultaneous initializations
    if (initializingRef.current) {
      console.log('Auth initialization already in progress, skipping...')
      return
    }
    
    // Prevent re-initialization for same pathname
    if (lastPathnameRef.current === pathname && initialized) {
      console.log('Already initialized for pathname:', pathname)
      return
    }
    
    initializingRef.current = true
    lastPathnameRef.current = pathname
    
    try {
      setLoading(true)
      console.log('Initializing auth on pathname:', pathname)

      const currentUser = await authService.getCurrentUser()
      
      if (currentUser) {
        const profile = await authService.getCurrentUserProfile()

        if (profile) {
          setUser(currentUser)
          setUserProfile(profile)
          console.log('User authenticated:', profile.name, 'Role:', profile.role)

          // Handle OAuth callback first
          if (pathname.startsWith('/callback') || pathname === '/callback') {
            console.log('OAuth callback detected, skipping redirect')
            return
          }

          // Redirect authenticated users away from auth pages
          if (isPublicRoute(pathname) && pathname !== '/') {
            console.log('Authenticated user trying to access auth page, redirecting...')
            
            // Check for 'from' parameter for redirect back
            const fromParam = searchParams.get('from')
            if (fromParam && fromParam.startsWith('/') && !fromParam.startsWith('//')) {
              console.log('Redirecting to original destination:', fromParam)
              router.replace(fromParam)
            } else {
              redirectAfterLogin(profile.role)
            }
            return
          }
        } else {
          // User exists but no profile - try to create one
          try {
            const newProfile = await authService.createUserProfile(currentUser)
            setUser(currentUser)
            setUserProfile(newProfile)
            console.log('Created new user profile:', newProfile.name)

            // Redirect after profile creation only if needed
            if (isPublicRoute(pathname) && pathname !== '/') {
              redirectAfterLogin(newProfile.role)
            }
          } catch (profileError) {
            console.error('Failed to create user profile:', profileError)
            // Clear invalid auth state
            await authService.logout()
            setUser(null)
            setUserProfile(null)
            
            if (!isPublicRoute(pathname)) {
              router.push(`/sign-in?from=${encodeURIComponent(pathname)}`)
            }
          }
        }
      } else {
        // No authenticated user
        console.log('No authenticated user found')
        setUser(null)
        setUserProfile(null)
        
        // Redirect unauthenticated users from protected routes to sign-in
        if (!isPublicRoute(pathname)) {
          console.log('Unauthenticated user trying to access protected route:', pathname)
          router.push(`/sign-in?from=${encodeURIComponent(pathname)}`)
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
      setUser(null)
      setUserProfile(null)
      
      // On auth errors, redirect to sign-in for protected routes
      if (!isPublicRoute(pathname)) {
        router.push(`/sign-in?from=${encodeURIComponent(pathname)}`)
      }
    } finally {
      setLoading(false)
      setInitialized(true)
      initializingRef.current = false
    }
  }, [pathname, router, redirectAfterLogin, isPublicRoute, searchParams, initialized])

  // Initialize auth only when necessary
  useEffect(() => {
    // Don't reinitialize if already initialized for this path
    if (lastPathnameRef.current === pathname && initialized) {
      return
    }
    
    initializeAuth()
  }, [initializeAuth, pathname, initialized])

  const signUp = async (userData) => {
    try {
      setLoading(true)

      const result = await authService.signUp(userData)

      if (result.success) {
        setUser(result.user)
        setUserProfile(result.profile)

        toast.success(`Welcome ${result.profile.name}!`)
        redirectAfterLogin(result.profile.role)

        return { success: true }
      }

      return result
    } catch (error) {
      console.error("SignUp error:", error)
      return {
        success: false,
        error: error.message || "Failed to create account",
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)

      const result = await authService.signIn(email, password)

      if (result.success) {
        setUser(result.session)
        setUserProfile(result.user)

        toast.success(`Welcome back ${result.user.name}!`)
        
        // Check for redirect parameter
        const fromParam = searchParams.get('from')
        if (fromParam && fromParam.startsWith('/') && !fromParam.startsWith('//')) {
          router.replace(fromParam)
        } else {
          redirectAfterLogin(result.user.role)
        }

        return { success: true }
      }

      return result
    } catch (error) {
      console.error("SignIn error:", error)
      return {
        success: false,
        error: error.message || "Sign in failed",
      }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await authService.signInWithGoogle()
      if (result.success) {
        toast.success(result.message || 'Redirecting to Google...')
      }
      return result
    } catch (error) {
      console.error("Google SignIn error:", error)
      return {
        success: false,
        error: error.message || "Google sign in failed",
      }
    }
  }

  const handleOAuthSuccess = async () => {
    try {
      setLoading(true)
      
      const result = await authService.handleOAuthSuccess()
      
      if (result.success) {
        setUser(result.user)
        setUserProfile(result.profile)

        console.log('OAuth Success - Setting user:', result.user);
        console.log('OAuth Success - Setting profile:', result.profile);

        toast.success('Successfully signed in with Google!')
        
        // Add delay before redirect to ensure state is set
        setTimeout(() => {
          redirectAfterLogin(result.profile.role)
        }, 500);

        return { success: true }
      } else {
        toast.error(result.error.message || 'Authentication failed')
        router.push('/sign-in?error=oauth_failed')
        return result
      }
    } catch (error) {
      console.error("OAuth success error:", error)
      toast.error('Authentication failed')
      router.push('/sign-in?error=oauth_failed')
      return {
        success: false,
        error: error.message || "Authentication failed",
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)

      const result = await authService.logout()
      if (result.success) {
        setUser(null)
        setUserProfile(null)

        toast.success("Signed out successfully")
        router.push("/sign-in")
      }
      return result
    } catch (error) {
      console.error("Logout error:", error)
      return {
        success: false,
        error: error.message || "Logout failed",
      }
    } finally {
      setLoading(false)
    }
  }

  // Helper functions for role checking
  const hasRole = useCallback(
    (role) => {
      return userProfile?.role === role
    },
    [userProfile],
  )

  const hasAnyRole = useCallback(
    (roles) => {
      return roles.includes(userProfile?.role)
    },
    [userProfile],
  )

  const isAdmin = useCallback(() => {
    return hasAnyRole(['superAdmin', 'admin'])
  }, [hasAnyRole])

  // Check if user can access a route based on roles
  const canAccessRoute = useCallback((requiredRoles = []) => {
    if (!userProfile) return false
    if (requiredRoles.length === 0) return true
    return requiredRoles.includes(userProfile.role)
  }, [userProfile])

  const value = {
    // State
    user,
    userProfile,
    loading,
    initialized,
    isAuthenticated: !!user && !!userProfile,

    // Auth Methods
    signUp,
    signIn,
    signInWithGoogle,
    handleOAuthSuccess,
    logout,

    // Role Information
    role: userProfile?.role,
    shopId: userProfile?.shopId,
    userId: userProfile?.$id,

    // Permission checks
    hasRole,
    hasAnyRole,
    isAdmin,
    canAccessRoute,

    // Utility
    refreshAuth: initializeAuth,
    redirectAfterLogin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}