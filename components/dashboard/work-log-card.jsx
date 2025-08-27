"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Clock, Play, Square } from "lucide-react"

export function WorkLogCard({ workLogs, isLoading }) {
    const todayLog = workLogs?.find((log) => {
        const today = new Date().toDateString()
        return new Date(log.date).toDateString() === today
    })

    const isCheckedIn = todayLog?.check_in && !todayLog?.check_out

    return (
        <Card className="premium-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Work Log
                </CardTitle>
                <CardDescription>Track your daily work hours</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Today's Status */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                            <div>
                                <p className="font-medium">Today's Status</p>
                                <p className="text-sm text-muted-foreground">
                                    {todayLog ? `${todayLog.total_hours || 0} hours logged` : "No time logged"}
                                </p>
                            </div>
                            <Badge variant={isCheckedIn ? "default" : "secondary"}>
                                {isCheckedIn ? "Checked In" : "Checked Out"}
                            </Badge>
                        </div>

                        {/* Check In/Out Button */}
                        <Button className="w-full gap-2" variant={isCheckedIn ? "destructive" : "default"}>
                            {isCheckedIn ? (
                                <>
                                    <Square className="h-4 w-4" />
                                    Check Out
                                </>
                            ) : (
                                <>
                                    <Play className="h-4 w-4" />
                                    Check In
                                </>
                            )}
                        </Button>

                        {/* Recent Work Logs */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Recent Activity</h4>
                            {workLogs?.slice(0, 3).map((log, index) => (
                                <motion.div
                                    key={log.$id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span>{new Date(log.date).toLocaleDateString()}</span>
                                    <span className="text-muted-foreground">{log.total_hours}h</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
