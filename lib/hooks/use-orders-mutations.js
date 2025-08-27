
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/lib/services/orders-service';
import { toast } from 'sonner';

// ✅ Create Order Hook
export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ordersService.createOrder,
        onSuccess: (data, variables) => {
            // Cache invalidate 
            queryClient.invalidateQueries(['orders', variables.shopId]);
            queryClient.invalidateQueries(['orders-stats', variables.shopId]);

            // Success message
            toast.success(`Order #${data.orderId} created successfully!`);

            // Optional: Optimistic update
            queryClient.setQueryData(['order', data.$id], data);
        },
        onError: (error, variables) => {
            toast.error(error.message || 'Failed to create order');
            console.error('Create order mutation error:', error);
        },
        onSettled: () => {
        }
    });
};

// ✅ Update Order Hook
export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, updateData }) =>
            ordersService.updateOrder(orderId, updateData),
        onSuccess: (data, variables) => {
            const { orderId } = variables;

            // Specific queries invalidate 
            queryClient.invalidateQueries(['orders']);
            queryClient.invalidateQueries(['order', orderId]);

            toast.success('Order updated successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update order');
        }
    });
};

// ✅ Update Order Status Hook
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, status, notes }) =>
            ordersService.updateOrderStatus(orderId, status, notes),
        onMutate: async ({ orderId, status }) => {
            // Optimistic update
            await queryClient.cancelQueries(['order', orderId]);

            const previousOrder = queryClient.getQueryData(['order', orderId]);

            // Optimistically update cache
            queryClient.setQueryData(['order', orderId], old => ({
                ...old,
                status,
                updated_at: new Date().toISOString()
            }));

            return { previousOrder, orderId };
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['orders']);
            toast.success(`Order status updated to ${variables.status}!`);
        },
        onError: (error, variables, context) => {
            // Rollback optimistic update
            if (context?.previousOrder) {
                queryClient.setQueryData(['order', context.orderId], context.previousOrder);
            }
            toast.error(error.message || 'Failed to update order status');
        }
    });
};

// ✅ Delete Order Hook  
export const useDeleteOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderId) => ordersService.deleteOrder(orderId),
        onSuccess: (data, orderId) => {
            // Remove from all order lists
            queryClient.invalidateQueries(['orders']);

            // Remove specific order from cache
            queryClient.removeQueries(['order', orderId]);

            toast.success('Order deleted successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete order');
        }
    });
};