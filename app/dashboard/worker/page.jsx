"use client"

import { useAuth } from "@/hooks/use-auth"
import { useOrderItemsByWorker, useWorkLogs } from "@/hooks/use-database"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { WorkerStatsCards } from "@/components/dashboard/worker-stats-cards"
import { TaskList } from "@/components/dashboard/task-list"
import { WorkLogCard } from "@/components/dashboard/work-log-card"
import { WorkerQuickActions } from "@/components/dashboard/worker-quick-actions"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { motion } from "framer-motion"

export default function WorkerDashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { data: tasks, isLoading: tasksLoading } = useOrderItemsByWorker(user?.$id || "")
  const { data: workLogs, isLoading: workLogsLoading } = useWorkLogs(user?.$id, user?.shopId)

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isWorker = ["tailor", "embroideryMan", "stoneMan"].includes(user.role)

  if (!isWorker) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const roleDisplayName =
    {
      tailor: "Tailor",
      embroideryMan: "Embroidery Specialist",
      stoneMan: "Stone Work Specialist",
    }[user.role] || "Worker"

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
              <h1 className="text-3xl font-bold tracking-tight">Worker Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.name} - {roleDisplayName}
              </p>
            </div>
            <WorkerQuickActions />
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <WorkerStatsCards tasks={tasks} workLogs={workLogs} isLoading={tasksLoading || workLogsLoading} />
          </motion.div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Tasks */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <TaskList tasks={tasks} isLoading={tasksLoading} userRole={user.role} />
            </motion.div>

            {/* Work Log */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <WorkLogCard workLogs={workLogs} isLoading={workLogsLoading} />
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  )
}
