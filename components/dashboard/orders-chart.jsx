"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useOrdersByShop } from "@/hooks/use-database"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

export function OrdersChart({ shopId }) {
  const { data: orders, isLoading } = useOrdersByShop(shopId || "")

  // Process data for chart
  const chartData = React.useMemo(() => {
    if (!orders) return []

    const statusCounts = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      },
      {},
    )

    return [
      { status: "Pending", count: statusCounts.pending || 0, fill: "hsl(var(--chart-1))" },
      { status: "In Progress", count: statusCounts.in_progress || 0, fill: "hsl(var(--chart-2))" },
      { status: "Completed", count: statusCounts.completed || 0, fill: "hsl(var(--chart-3))" },
      { status: "Delivered", count: statusCounts.delivered || 0, fill: "hsl(var(--chart-4))" },
    ]
  }, [orders])

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className="premium-card">
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
          <CardDescription>Distribution of orders by status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <LoadingSpinner />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="status" className="text-muted-foreground" fontSize={12} />
                <YAxis className="text-muted-foreground" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [value, "Orders"]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
