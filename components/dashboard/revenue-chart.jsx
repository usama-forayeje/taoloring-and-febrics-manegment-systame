"use client"

import React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useTransactionsByShop } from "@/hooks/use-database"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

export function RevenueChart({ shopId }) {
    const { data: transactions, isLoading } = useTransactionsByShop(shopId || "")

    // Process data for chart
    const chartData = React.useMemo(() => {
        if (!transactions) return []

        const monthlyData = transactions.reduce(
            (acc, transaction) => {
                const date = new Date(transaction.transaction_date)
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

                if (!acc[monthKey]) {
                    acc[monthKey] = { month: monthKey, revenue: 0 }
                }

                acc[monthKey].revenue += transaction.total_amount
                return acc
            },
            {},
        )

        return Object.values(monthlyData)
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-6) // Last 6 months
            .map((item) => ({
                ...item,
                month: new Date(item.month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            }))
    }, [transactions])

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="premium-card">
                <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-[300px]">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="month" className="text-muted-foreground" fontSize={12} />
                                <YAxis
                                    className="text-muted-foreground"
                                    fontSize={12}
                                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}
