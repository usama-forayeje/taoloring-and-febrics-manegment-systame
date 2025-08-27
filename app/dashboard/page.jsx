"use client"

import { useAuth } from "@/hooks/use-auth"
import { useDashboardStats, useShops } from "@/hooks/use-database"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { OrdersChart } from "@/components/dashboard/orders-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { useShopStore } from "@/hooks/use-shop-store"
import { motion } from "framer-motion"

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
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{isAdmin ? "Admin Dashboard" : "Dashboard"}</h1>
              <p className="text-muted-foreground">
                {currentShop ? `Managing ${currentShop.name}` : "Overview of all shops"}
              </p>
            </div>
            <QuickActions />
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
              <RevenueChart shopId={selectedShopId} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <OrdersChart shopId={selectedShopId} />
            </motion.div>
          </div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <RecentOrders shopId={selectedShopId} />
          </motion.div>
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  )
}
