
import { databaseService } from '@/services/database';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'appwrite';

export const customersService = {
    // ✅ Create Customer
    async createCustomer(customerData) {
        try {
            // Phone number already exists check 
            const existingCustomer = await this.findByPhone(customerData.phone);
            if (existingCustomer) {
                throw new Error('Customer with this phone number already exists');
            }

            return await databaseService.create(
                appwriteConfig.collections.customers,
                {
                    ...customerData,
                    created_at: new Date().toISOString()
                }
            );
        } catch (error) {
            console.error('Create customer error:', error);
            throw error;
        }
    },

    // ✅ Find Customer by Phone
    async findByPhone(phone) {
        try {
            const result = await databaseService.getAll(
                appwriteConfig.collections.customers,
                [Query.equal('phone', phone), Query.limit(1)]
            );

            return result.documents.length > 0 ? result.documents[0] : null;
        } catch (error) {
            console.error('Find customer by phone error:', error);
            return null;
        }
    },

    // ✅ Search Customers
    async searchCustomers(searchTerm, limit = 20) {
        try {
            const queries = [
                Query.or([
                    Query.search('name', searchTerm),
                    Query.search('phone', searchTerm)
                ]),
                Query.limit(limit)
            ];

            return await databaseService.getAll(
                appwriteConfig.collections.customers,
                queries
            );
        } catch (error) {
            console.error('Search customers error:', error);
            throw error;
        }
    },

    // ✅ Get Customer with Order History
    async getCustomerWithOrders(customerId) {
        try {
            const customer = await databaseService.getById(
                appwriteConfig.collections.customers,
                customerId
            );

            const orders = await databaseService.getAll(
                appwriteConfig.collections.orders,
                [
                    Query.equal('customerId', customerId),
                    Query.orderDesc('order_date'),
                    Query.limit(50)
                ]
            );

            return {
                ...customer,
                orders: orders.documents,
                totalOrders: orders.total
            };
        } catch (error) {
            console.error('Get customer with orders error:', error);
            throw error;
        }
    }
};