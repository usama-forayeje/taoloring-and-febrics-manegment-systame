"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useUpdateTaskStatus } from "@/hooks/use-database"
import { motion } from "framer-motion"
import { Play, CheckCircle, Clock } from "lucide-react"

const statusColors = {
    cutting: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    embroidery: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    stone_work: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    sewing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    finished: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

const statusIcons = {
    cutting: Clock,
    embroidery: Play,
    stone_work: Play,
    sewing: Play,
    finished: CheckCircle,
}

export function TaskList({ tasks, isLoading, userRole }) {
    const updateTaskStatus = useUpdateTaskStatus()

    const getNextStatus = (currentStatus, role) => {
        const statusFlow = {
            tailor: {
                cutting: "sewing",
                sewing: "finished",
            },
            embroideryMan: {
                embroidery: "finished",
            },
            stoneMan: {
                stone_work: "finished",
            },
        }

        return statusFlow[role]?.[currentStatus]
    }

    const canUpdateStatus = (task) => {
        const roleStatusMap = {
            tailor: ["cutting", "sewing"],
            embroideryMan: ["embroidery"],
            stoneMan: ["stone_work"],
        }

        return roleStatusMap[userRole]?.includes(task.status)
    }

    const handleStatusUpdate = (taskId, currentStatus) => {
        const nextStatus = getNextStatus(currentStatus, userRole)
        if (nextStatus) {
            updateTaskStatus.mutate({ taskId, status: nextStatus })
        }
    }

    return (
        <Card className="premium-card">
            <CardHeader>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>Tasks assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <LoadingSpinner />
                    </div>
                ) : !tasks || tasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No tasks assigned</div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task, index) => {
                            const StatusIcon = statusIcons[task.status]
                            const nextStatus = getNextStatus(task.status, userRole)

                            return (
                                <motion.div
                                    key={task.$id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <StatusIcon className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{task.item_name}</p>
                                            <p className="text-sm text-muted-foreground">Order: {task.orderId}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className={statusColors[task.status]}>
                                            {task.status.replace("_", " ")}
                                        </Badge>

                                        <div className="text-right">
                                            <p className="font-medium">${task.price.toLocaleString()}</p>
                                        </div>

                                        {canUpdateStatus(task) && nextStatus && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleStatusUpdate(task.$id, task.status)}
                                                disabled={updateTaskStatus.isPending}
                                            >
                                                {nextStatus === "finished" ? "Complete" : "Next Step"}
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
