import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { dashboardService, ordersService, customersService } from "@/lib/api/appwrite-service"
import { toast } from "sonner"

// Query Keys
export const QUERY_KEYS = {
  DASHBOARD_STATS: ["dashboard", "stats"],
  RECENT_ORDERS: ["dashboard", "recent-orders"],
  MONTHLY_REVENUE: ["dashboard", "monthly-revenue"],
  ORDERS: ["orders"],
  CUSTOMERS: ["customers"],
} 

// Dashboard Queries
export const useDashboardStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_STATS,
    queryFn: dashboardService.getStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useRecentOrders = (limit = 5) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECENT_ORDERS, limit],
    queryFn: () => dashboardService.getRecentOrders(limit),
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}

export const useMonthlyRevenue = () => {
  return useQuery({
    queryKey: QUERY_KEYS.MONTHLY_REVENUE,
    queryFn: dashboardService.getMonthlyRevenue,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Orders Queries
export const useOrders = (filters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS, filters],
    queryFn: () => ordersService.getOrders(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECENT_ORDERS })
      toast.success("Order created successfully!")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create order")
    },
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, orderData }) =>
      ordersService.updateOrder(orderId, orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECENT_ORDERS })
      toast.success("Order updated successfully!")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order")
    },
  })
}

// Customers Queries
export const useCustomers = (limit = 50) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CUSTOMERS, limit],
    queryFn: () => customersService.getCustomers(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: customersService.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMERS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS })
      toast.success("Customer created successfully!")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create customer")
    },
  })
}

// Utility hook for manual refetching
export const useRefreshDashboard = () => {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECENT_ORDERS })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MONTHLY_REVENUE })
    toast.success("Dashboard refreshed!")
  }
}
