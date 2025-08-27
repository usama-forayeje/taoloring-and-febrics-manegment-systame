"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, ShoppingBag, Users, DollarSign, Clock } from "lucide-react"

export function StatsCards({ stats, isLoading }) {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="premium-card">
                        <CardContent className="flex items-center justify-center p-6">
                            <LoadingSpinner />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const cards = [
        {
            title: "Total Orders",
            value: stats?.totalOrders || 0,
            icon: ShoppingBag,
            trend: "+12%",
            trendUp: true,
        },
        {
            title: "Pending Orders",
            value: stats?.pendingOrders || 0,
            icon: Clock,
            trend: "-5%",
            trendUp: false,
        },
        {
            title: "Total Revenue",
            value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            trend: "+18%",
            trendUp: true,
        },
        {
            title: "Active Workers",
            value: stats?.activeWorkers || 0,
            icon: Users,
            trend: "+2",
            trendUp: true,
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <Card className="premium-card hover-lift">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                            <card.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                {card.trendUp ? (
                                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                                ) : (
                                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                                )}
                                <span className={card.trendUp ? "text-green-500" : "text-red-500"}>{card.trend}</span>
                                <span className="ml-1">from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}
