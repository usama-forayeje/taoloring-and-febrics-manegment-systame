"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { databaseService } from "@/lib/database"
import { toast } from "sonner"

// Users hooks
export function useUsers(shopId) {
    return useQuery({
        queryKey: ["users", shopId],
        queryFn: () => databaseService.getUsers(shopId),
    })
}

export function useUsersByRole(role, shopId) {
    return useQuery({
        queryKey: ["users", "role", role, shopId],
        queryFn: () => databaseService.getUsersByRole(role, shopId),
    })
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, role, shopId }) =>
            databaseService.updateUserRole(userId, role, shopId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast({
                title: "User role updated",
                description: "The user role has been successfully updated.",
            })
        },
        onError: (error) => {
            toast({
                title: "Failed to update user role",
                description: error.message || "Please try again.",
                variant: "destructive",
            })
        },
    })
}

export function useCreateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userData) => databaseService.createUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast({
                title: "User created",
                description: "The new user has been successfully created.",
            })
        },
        onError: (error) => {
            toast({
                title: "Failed to create user",
                description: error.message || "Please try again.",
                variant: "destructive",
            })
        },
    })
}

// Shops hooks
export function useShops() {
    return useQuery({
        queryKey: ["shops"],
        queryFn: () => databaseService.getShops(),
    })
}

export function useCreateShop() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (shopData) => databaseService.createShop(shopData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shops"] })
            toast({
                title: "Shop created",
                description: "The new shop has been successfully created.",
            })
        },
        onError: (error) => {
            toast({
                title: "Failed to create shop",
                description: error.message || "Please try again.",
                variant: "destructive",
            })
        },
    })
}

// Orders hooks
export function useOrdersByShop(shopId) {
    return useQuery({
        queryKey: ["orders", "shop", shopId],
        queryFn: () => databaseService.getOrdersByShop(shopId),
        enabled: !!shopId,
    })
}

export function useOrdersByStatus(status, shopId) {
    return useQuery({
        queryKey: ["orders", "status", status, shopId],
        queryFn: () => databaseService.getOrdersByStatus(status, shopId),
    })
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ orderId, status }) =>
            databaseService.updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            toast({
                title: "Order status updated",
                description: "The order status has been successfully updated.",
            })
        },
        onError: (error) => {
            toast({
                title: "Failed to update order status",
                description: error.message || "Please try again.",
                variant: "destructive",
            })
        },
    })
}

// Customers hooks
export function useCustomers(shopId) {
    return useQuery({
        queryKey: ["customers", shopId],
        queryFn: () => databaseService.getCustomers(shopId),
    })
}

// Dashboard hooks
export function useDashboardStats(shopId) {
    return useQuery({
        queryKey: ["dashboard", "stats", shopId],
        queryFn: () => databaseService.getDashboardStats(shopId),
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    })
}

// Notifications hooks
export function useNotifications(userId) {
    return useQuery({
        queryKey: ["notifications", userId],
        queryFn: () => databaseService.getNotifications(userId),
        enabled: !!userId,
    })
}

export function useMarkNotificationAsRead() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (notificationId) => databaseService.markNotificationAsRead(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        },
    })
}

// Work logs hooks
export function useWorkLogs(userId, shopId) {
    return useQuery({
        queryKey: ["workLogs", userId, shopId],
        queryFn: () => databaseService.getWorkLogs(userId, shopId),
    })
}

// Catalog hooks
export function useCatalog(shopId) {
    return useQuery({
        queryKey: ["catalog", shopId],
        queryFn: () => databaseService.getCatalog(shopId),
    })
}

// Transactions hooks
export function useTransactionsByShop(shopId) {
    return useQuery({
        queryKey: ["transactions", "shop", shopId],
        queryFn: () => databaseService.getTransactionsByShop(shopId),
        enabled: !!shopId,
    })
}

export function useTransactionsByType(type, shopId) {
    return useQuery({
        queryKey: ["transactions", "type", type, shopId],
        queryFn: () => databaseService.getTransactionsByType(type, shopId),
    })
}

// Order Items and Tasks hooks
export function useOrderItemsByWorker(workerId) {
    return useQuery({
        queryKey: ["orderItems", "worker", workerId],
        queryFn: () => databaseService.getOrderItemsByWorker(workerId),
        enabled: !!workerId,
    })
}

export function useUpdateTaskStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ taskId, status }) =>
            databaseService.updateTaskStatus(taskId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orderItems"] })
            toast({
                title: "Task status updated",
                description: "The task status has been successfully updated.",
            })
        },
        onError: (error) => {
            toast({
                title: "Failed to update task status",
                description: error.message || "Please try again.",
                variant: "destructive",
            })
        },
    })
}
