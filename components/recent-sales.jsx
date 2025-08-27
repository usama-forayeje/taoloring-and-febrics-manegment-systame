"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import { useRecentOrders } from "../hooks/use-dashboard-queries"
import { Eye, TrendingUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function RecentSales() {
  const [visibleItems, setVisibleItems] = useState([])
  const { data: recentOrders, isLoading, error } = useRecentOrders(5)

  useEffect(() => {
    if (recentOrders) {
      recentOrders.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, index])
        }, index * 100)
      })
    }
  }, [recentOrders])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center p-3 rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="ml-4 space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Failed to load recent orders</p>
      </div>
    )
  }

  if (!recentOrders || recentOrders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No recent orders found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentOrders.map((order, index) => (
        <div
          key={order.id}
          className={`flex items-center p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 cursor-pointer group ${
            visibleItems.includes(index) ? "animate-slide-up opacity-100" : "opacity-0"
          }`}
        >
          <Avatar className="h-10 w-10 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all duration-200">
            <AvatarImage src="/placeholder.svg" alt={order.customerName} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
              {getInitials(order.customerName)}
            </AvatarFallback>
          </Avatar>

          <div className="ml-4 space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                {order.customerName}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={`text-xs ${getStatusColor(order.status)}`}>
                  {order.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{order.orderDescription}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="ml-4 flex items-center space-x-2">
            <div className="text-right">
              <div className="font-medium text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                +OMR {order.amount.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+12%</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-4 border-t">
        <Button variant="outline" className="w-full hover-lift bg-transparent">
          View All Orders
        </Button>
      </div>
    </div>
  )
}
