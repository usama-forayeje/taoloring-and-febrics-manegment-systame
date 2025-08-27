
import databaseService from '@/services/database';
import { Query } from 'appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';

export const ordersService = {
    // ✅ Create Order
    async createOrder(orderData) {
        try {
            const order = await databaseService.create(
                appwriteConfig.collections.orders,
                {
                    ...orderData,
                    order_date: new Date().toISOString(),
                    status: 'pending'
                }
            );

            // Transaction ও create করি
            if (orderData.createTransaction) {
                await this.createOrderTransaction(order.$id, orderData);
            }

            return order;
        } catch (error) {
            console.error('Create order error:', error);
            throw new Error('Failed to create order');
        }
    },

    // ✅ Get Orders with Filters
    async getOrders(shopId, filters = {}) {
        try {
            const queries = [
                Query.equal('shopId', shopId),
                Query.orderDesc('order_date')
            ];

            // Dynamic filters add করি
            if (filters.status) {
                queries.push(Query.equal('status', filters.status));
            }

            if (filters.customerId) {
                queries.push(Query.equal('customerId', filters.customerId));
            }

            if (filters.dateFrom && filters.dateTo) {
                queries.push(Query.between('order_date', filters.dateFrom, filters.dateTo));
            }

            if (filters.limit) {
                queries.push(Query.limit(filters.limit));
            }

            return await databaseService.getAll(
                appwriteConfig.collections.orders,
                queries
            );
        } catch (error) {
            console.error('Get orders error:', error);
            throw new Error('Failed to fetch orders');
        }
    },

    // ✅ Get Order with Relations (Customer, Items)
    async getOrderWithDetails(orderId) {
        try {
            // Order fetch 
            const order = await databaseService.getById(
                appwriteConfig.collections.orders,
                orderId
            );

            // Customer info fetch 
            const customer = await databaseService.getById(
                appwriteConfig.collections.customers,
                order.customerId
            );

            // Order items fetch 
            const items = await databaseService.getAll(
                appwriteConfig.collections.orderItems,
                [Query.equal('orderId', orderId)]
            );

            return {
                ...order,
                customer,
                items: items.documents
            };
        } catch (error) {
            console.error('Get order details error:', error);
            throw new Error('Failed to fetch order details');
        }
    },

    // ✅ Update Order Status
    async updateOrderStatus(orderId, status, notes = '') {
        try {
            const updateData = {
                status,
                updated_at: new Date().toISOString()
            };

            if (status === 'delivered') {
                updateData.actual_delivery_date = new Date().toISOString();
            }

            if (notes) {
                updateData.status_notes = notes;
            }

            return await databaseService.update(
                appwriteConfig.collections.orders,
                orderId,
                updateData
            );
        } catch (error) {
            console.error('Update order status error:', error);
            throw new Error('Failed to update order status');
        }
    },

    // ✅ Create Order Transaction
    async createOrderTransaction(orderId, orderData) {
        try {
            return await databaseService.create(
                appwriteConfig.collections.transactions,
                {
                    type: 'tailoring_order',
                    shopId: orderData.shopId,
                    customerId: orderData.customerId,
                    createdBy: orderData.orderedBy,
                    transaction_date: new Date().toISOString(),
                    total_amount: orderData.total_price,
                    reference_id: orderId
                }
            );
        } catch (error) {
            console.error('Create transaction error:', error);
            throw error;
        }
    }
};