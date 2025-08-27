"use client"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { authService } from "@/lib/services/auth-service"
import { useRouter, usePathname } from "next/navigation"
import { hasPermission, hasAnyPermission, ROLES, PERMISSIONS } from "@/lib/roles"
import { toast } from "sonner"

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
  const [sessionCheckInterval, setSessionCheckInterval] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  // Public routes that don't require authentication
  const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/verify",
    "/error",
    "/callback",
    "/",
  ]

  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true)

      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        const profile = await authService.getCurrentUserProfile()

        if (profile) {
          setUser(currentUser)
          setUserProfile(profile)
          startSessionCheck()
        } else {
          // User exists but no profile, create one
          const newProfile = await authService.createUserProfile(currentUser)
          setUser(currentUser)
          setUserProfile(newProfile)
          startSessionCheck()
        }
      } else {
        // No authenticated user
        setUser(null)
        setUserProfile(null)
        stopSessionCheck()
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
      setUser(null)
      setUserProfile(null)
      stopSessionCheck()

      // Only redirect if not on public route
      if (!publicRoutes.includes(pathname)) {
        toast.error("Session expired. Please sign in again.")
        router.push("/sign-in")
      }
    } finally {
      setLoading(false)
      setInitialized(true)
    }
  }, [pathname, router])

  const startSessionCheck = useCallback(() => {
    if (sessionCheckInterval) return

    const interval = setInterval(
      async () => {
        try {
          const currentUser = await authService.getCurrentUser()
          if (!currentUser) {
            handleSessionExpired()
          }
        } catch (error) {
          if (error.code === 401) {
            handleSessionExpired()
          }
        }
      },
      5 * 60 * 1000,
    ) // Check every 5 minutes

    setSessionCheckInterval(interval)
  }, [sessionCheckInterval])

  const stopSessionCheck = useCallback(() => {
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval)
      setSessionCheckInterval(null)
    }
  }, [sessionCheckInterval])

  const handleSessionExpired = useCallback(() => {
    setUser(null)
    setUserProfile(null)
    stopSessionCheck()

    if (!publicRoutes.includes(pathname)) {
      toast.warning("Your session has expired. Please sign in again.")
      router.push("/sign-in")
    }
  }, [pathname, router, stopSessionCheck])

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth()

    // Cleanup on unmount
    return () => {
      stopSessionCheck()
    }
  }, [initializeAuth, stopSessionCheck])

  const signUp = async (userData) => {
    try {
      setLoading(true)

      const result = await authService.signUp(userData)

      if (result.success) {
        setUser(result.user)
        setUserProfile(result.profile)
        startSessionCheck()

        toast.success(`Welcome ${result.profile.name}! Account created successfully.`)

        // Redirect based on role
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
        startSessionCheck()

        toast.success(`Welcome back ${result.user.name}!`)

        // Redirect based on role
        redirectAfterLogin(result.user.role)

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
      return await authService.signInWithGoogle()
    } catch (error) {
      console.error("Google SignIn error:", error)
      return {
        success: false,
        error: error.message || "Google sign in failed",
      }
    }
  }

  const logout = async () => {
    try {
      setLoading(true)

      const result = await authService.logout()
      if (result.success) {
        setUser(null)
        setUserProfile(null)
        stopSessionCheck()

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

  const updateProfile = async (updateData) => {
    try {
      if (!userProfile) throw new Error("No user profile found")

      const updatedProfile = await authService.updateUserProfile(userProfile.$id, updateData)

      setUserProfile(updatedProfile)
      toast.success("Profile updated successfully")

      return { success: true, data: updatedProfile }
    } catch (error) {
      console.error("Update profile error:", error)
      toast.error("Failed to update profile")
      return {
        success: false,
        error: error.message || "Update failed",
      }
    }
  }

  const redirectAfterLogin = useCallback(
    (role) => {
      const roleRedirects = {
        [ROLES.SUPER_ADMIN]: "/dashboard/admin",
        [ROLES.ADMIN]: "/dashboard/admin",
        [ROLES.MANAGER]: "/dashboard/manager",
        [ROLES.TAILOR]: "/dashboard/worker",
        [ROLES.EMBROIDERY_MAN]: "/dashboard/worker",
        [ROLES.STONE_MAN]: "/dashboard/worker",
        [ROLES.USER]: "/dashboard",
      }

      const redirectPath = roleRedirects[role] || "/dashboard"
      router.push(redirectPath)
    },
    [router],
  )

  const checkPermission = useCallback(
    (permission) => {
      if (!userProfile?.role) return false
      return hasPermission(userProfile.role, permission)
    },
    [userProfile],
  )

  const checkAnyPermission = useCallback(
    (permissions) => {
      if (!userProfile?.role) return false
      return hasAnyPermission(userProfile.role, permissions)
    },
    [userProfile],
  )

  const checkAllPermissions = useCallback(
    (permissions) => {
      if (!userProfile?.role || !permissions.length) return false
      return permissions.every((permission) => hasPermission(userProfile.role, permission))
    },
    [userProfile],
  )

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
    return hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN])
  }, [hasAnyRole])

  const isWorker = useCallback(() => {
    return hasAnyRole([ROLES.TAILOR, ROLES.EMBROIDERY_MAN, ROLES.STONE_MAN])
  }, [hasAnyRole])

  const canManageUsers = useCallback(() => {
    return checkPermission(PERMISSIONS.MANAGE_USERS)
  }, [checkPermission])

  const canViewAllOrders = useCallback(() => {
    return checkPermission(PERMISSIONS.VIEW_ALL_ORDERS)
  }, [checkPermission])

  const canManageFinances = useCallback(() => {
    return checkPermission(PERMISSIONS.MANAGE_FINANCES)
  }, [checkPermission])

  const canSwitchShops = useCallback(() => {
    return hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN])
  }, [hasAnyRole])

  const resetPassword = async (email) => {
    try {
      const result = await authService.resetPassword(email)
      if (result.success) {
        toast.success(result.message)
      }
      return result
    } catch (error) {
      return {
        success: false,
        error: error.message || "Password reset failed",
      }
    }
  }

  const updatePassword = async (oldPassword, newPassword) => {
    try {
      const result = await authService.updatePassword(oldPassword, newPassword)
      if (result.success) {
        toast.success(result.message)
      }
      return result
    } catch (error) {
      return {
        success: false,
        error: error.message || "Password update failed",
      }
    }
  }

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
    logout,
    updateProfile,
    resetPassword,
    updatePassword,

    // Role Information
    role: userProfile?.role,
    shopId: userProfile?.shopId,
    userId: userProfile?.$id,

    checkPermission,
    checkAnyPermission,
    checkAllPermissions,

    hasRole,
    hasAnyRole,
    isAdmin,
    isWorker,

    // Utility Permission Checks
    canManageUsers,
    canViewAllOrders,
    canManageFinances,
    canSwitchShops,

    // Utility
    refreshAuth: initializeAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
