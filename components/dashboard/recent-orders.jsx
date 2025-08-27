"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useOrdersByShop } from "@/hooks/use-database"
import { motion } from "framer-motion"
import { Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  delivered: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

export function RecentOrders({ shopId }) {
  const { data: orders, isLoading } = useOrdersByShop(shopId || "")

  const recentOrders = orders?.slice(0, 5) || []

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="premium-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your shop</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No orders found</div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.$id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">Order #{order.orderId}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.order_date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={statusColors[order.status]}>
                      {order.status.replace("_", " ")}
                    </Badge>

                    <div className="text-right">
                      <p className="font-medium">${order.total_price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(order.delivery_date).toLocaleDateString()}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Order</DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
