"use client"

import { useDashboardStats, useShops } from "@/hooks/use-database"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { useShopStore } from "@/hooks/use-shop-store"
import { useAuth } from "@/providers/auth-provider"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { selectedShopId } = useShopStore()
  const { data: shops, isLoading: shopsLoading } = useShops()
  const { data: stats, isLoading: statsLoading } = useDashboardStats(selectedShopId)

  if (authLoading || shopsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isAdmin = user.role === "superAdmin" || user.role === "admin"
  const currentShop = shops?.find((shop) => shop.$id === selectedShopId)

  return (
    <ErrorBoundary>
      <DashboardLayout>
      
      </DashboardLayout>
    </ErrorBoundary>
  )
}
