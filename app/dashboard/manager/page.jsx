"use client"

import { useAuth } from "@/hooks/use-auth"
import { useDashboardStats, useShops } from "@/hooks/use-database"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { OrdersChart } from "@/components/dashboard/orders-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { ManagerQuickActions } from "@/components/dashboard/manager-quick-actions"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { useShopStore } from "@/hooks/use-shop-store"

export default function ManagerDashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { selectedShopId, setSelectedShopId } = useShopStore()
  const { data: shops, isLoading: shopsLoading } = useShops()
  const { data: stats, isLoading: statsLoading } = useDashboardStats(selectedShopId)

  // Set user's shop as selected if not already set
  useEffect(() => {
    if (user?.shopId && !selectedShopId) {
      setSelectedShopId(user.shopId)
    }
  }, [user?.shopId, selectedShopId, setSelectedShopId])

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

  // Managers can only see their own shop
  const isManager = user.role === "manager"
  const userShopId = isManager ? user.shopId : selectedShopId
  const currentShop = shops?.find((shop) => shop.$id === userShopId)

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Shop Manager Dashboard</h1>
              <p className="text-muted-foreground">
                {currentShop ? `Managing ${currentShop.name}` : "Shop Management"}
              </p>
            </div>
            <ManagerQuickActions />
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatsCards stats={stats} isLoading={statsLoading} />
          </motion.div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <RevenueChart shopId={userShopId} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <OrdersChart shopId={userShopId} />
            </motion.div>
          </div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <RecentOrders shopId={userShopId} />
          </motion.div>
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  )
}
