"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { motion } from "framer-motion"
import { CheckCircle, Clock, Target, TrendingUp } from "lucide-react"

export function WorkerStatsCards({ tasks, workLogs, isLoading }) {
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

    const completedTasks = tasks?.filter((task) => task.status === "finished").length || 0
    const pendingTasks = tasks?.filter((task) => task.status !== "finished").length || 0
    const todayWorkLog = workLogs?.find((log) => {
        const today = new Date().toDateString()
        return new Date(log.date).toDateString() === today
    })
    const todayHours = todayWorkLog?.total_hours || 0

    const cards = [
        {
            title: "Pending Tasks",
            value: pendingTasks,
            icon: Clock,
            color: "text-yellow-600",
        },
        {
            title: "Completed Tasks",
            value: completedTasks,
            icon: CheckCircle,
            color: "text-green-600",
        },
        {
            title: "Today's Hours",
            value: `${todayHours}h`,
            icon: Target,
            color: "text-blue-600",
        },
        {
            title: "Productivity",
            value: `${completedTasks > 0 ? Math.round((completedTasks / (completedTasks + pendingTasks)) * 100) : 0}%`,
            icon: TrendingUp,
            color: "text-purple-600",
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
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}
