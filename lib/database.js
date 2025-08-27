import { DATABASE_ID, COLLECTIONS, databases } from "./appwrite"
import { ID, Query } from "appwrite"
import { account } from "./appwrite"

export class DatabaseService {
    // Generic CRUD operations
    async create(collectionId, data, documentId) {
        try {
            return await databases.createRow(DATABASE_ID, collectionId, documentId || ID.unique(), data)
        } catch (error) {
            console.error(`Error creating document in ${collectionId}:`, error)
            throw error
        }
    }

    async getById(collectionId, documentId) {
        try {
            return await databases.getRow(DATABASE_ID, collectionId, documentId)
        } catch (error) {
            console.error(`Error getting document ${documentId} from ${collectionId}:`, error)
            throw error
        }
    }

    async list(collectionId, queries = []) {
        try {
            const response = await databases.listRows(DATABASE_ID, collectionId, queries)
            return {
                documents: response.documents,
                total: response.total,
            }
        } catch (error) {
            console.error(`Error listing documents from ${collectionId}:`, error)
            throw error
        }
    }

    async update(collectionId, documentId, data) {
        try {
            return await databases.updateRow(DATABASE_ID, collectionId, documentId, data)
        } catch (error) {
            console.error(`Error updating document ${documentId} in ${collectionId}:`, error)
            throw error
        }
    }

    async delete(collectionId, documentId) {
        try {
            return await databases.deleteRow(DATABASE_ID, collectionId, documentId)
        } catch (error) {
            console.error(`Error deleting document ${documentId} from ${collectionId}:`, error)
            throw error
        }
    }

    // User operations
    async getUsers(shopId) {
        const queries = shopId ? [Query.equal("shopId", shopId)] : []
        const result = await this.list(COLLECTIONS.USERS, queries)
        console.log(result);
        return result.documents
    }

    async getUsersByRole(role, shopId) {
        const queries = [Query.equal("role", role)]
        if (shopId) queries.push(Query.equal("shopId", shopId))
        const result = await this.list(COLLECTIONS.USERS, queries)
        return result.documents
    }

    async updateUserRole(userId, role, shopId) {
        const updateData = { role }
        if (shopId) updateData.shopId = shopId
        return await this.update(COLLECTIONS.USERS, userId, updateData)
    }

    async createUser(userData) {
        try {
            // Create user account in Appwrite Auth
            const user = await account.create(ID.unique(), userData.email, userData.password, userData.name)

            // Create user document in database
            const userDoc = await this.create(
                COLLECTIONS.USERS,
                {
                    phone: userData.phone || "",
                    email: userData.email,
                    avatar: "",
                    role: userData.role,
                    shopId: userData.shopId || "",
                },
                user.$id,
            )

            return userDoc
        } catch (error) {
            console.error("Error creating user:", error)
            throw error
        }
    }

    // Shop operations
    async getShops() {
        const result = await this.list(COLLECTIONS.SHOPS)
        return result.documents
    }

    async createShop(shopData) {
        return await this.create(COLLECTIONS.SHOPS, shopData)
    }

    // Order operations
    async getOrdersByShop(shopId, limit = 50) {
        const queries = [Query.equal("shopId", shopId), Query.limit(limit), Query.orderDesc("$createdAt")]
        const result = await this.list(COLLECTIONS.TAILORING_ORDERS, queries)
        return result.documents
    }

    async getOrdersByStatus(status, shopId) {
        const queries = [Query.equal("status", status)]
        if (shopId) queries.push(Query.equal("shopId", shopId))
        const result = await this.list(COLLECTIONS.TAILORING_ORDERS, queries)
        return result.documents
    }

    async updateOrderStatus(orderId, status) {
        return await this.update(COLLECTIONS.TAILORING_ORDERS, orderId, { status })
    }

    // Customer operations
    async getCustomers(shopId) {
        const queries = shopId ? [Query.equal("shopId", shopId)] : []
        const result = await this.list(COLLECTIONS.CUSTOMERS, queries)
        return result.documents
    }

    // Transaction operations
    async getTransactionsByShop(shopId, limit = 100) {
        const queries = [Query.equal("shopId", shopId), Query.limit(limit), Query.orderDesc("transaction_date")]
        const result = await this.list(COLLECTIONS.TRANSACTIONS, queries)
        return result.documents
    }

    async getTransactionsByType(type, shopId) {
        const queries = [Query.equal("type", type)]
        if (shopId) queries.push(Query.equal("shopId", shopId))
        const result = await this.list(COLLECTIONS.TRANSACTIONS, queries)
        return result.documents
    }

    // Dashboard analytics
    async getDashboardStats(shopId) {
        try {
            const queries = shopId ? [Query.equal("shopId", shopId)] : []

            // Get orders
            const ordersResult = await this.list(COLLECTIONS.TAILORING_ORDERS, queries)
            const orders = ordersResult.documents

            // Get transactions for revenue
            const transactionsResult = await this.list(COLLECTIONS.TRANSACTIONS, [
                ...queries,
                Query.equal("type", "tailoring_order"),
            ])
            const transactions = transactionsResult.documents

            // Get customers
            const customersResult = await this.list(COLLECTIONS.CUSTOMERS, queries)
            const customers = customersResult.documents

            // Get active workers
            const workersResult = await this.list(COLLECTIONS.USERS, [...queries, Query.notEqual("role", "user")])
            const workers = workersResult.documents

            // Calculate stats
            const totalOrders = orders.length
            const pendingOrders = orders.filter((order) => order.status === "pending").length
            const completedOrders = orders.filter(
                (order) => order.status === "completed" || order.status === "delivered",
            ).length

            const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.total_amount, 0)

            // Monthly revenue (current month)
            const currentMonth = new Date().getMonth()
            const currentYear = new Date().getFullYear()
            const monthlyRevenue = transactions
                .filter((transaction) => {
                    const transactionDate = new Date(transaction.transaction_date)
                    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
                })
                .reduce((sum, transaction) => sum + transaction.total_amount, 0)

            return {
                totalOrders,
                pendingOrders,
                completedOrders,
                totalRevenue,
                monthlyRevenue,
                totalCustomers: customers.length,
                activeWorkers: workers.length,
            }
        } catch (error) {
            console.error("Error getting dashboard stats:", error)
            throw error
        }
    }

    // Notification operations
    async getNotifications(userId) {
        const queries = [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
        const result = await this.list(COLLECTIONS.NOTIFICATIONS, queries)
        return result.documents
    }

    async markNotificationAsRead(notificationId) {
        return await this.update(COLLECTIONS.NOTIFICATIONS, notificationId, { read_status: true })
    }

    // Work log operations
    async getWorkLogs(userId, shopId) {
        const queries = []
        if (userId) queries.push(Query.equal("userId", userId))
        if (shopId) queries.push(Query.equal("shopId", shopId))
        queries.push(Query.orderDesc("date"))

        const result = await this.list(COLLECTIONS.WORK_LOG, queries)
        return result.documents
    }

    // Catalog operations
    async getCatalog(shopId) {
        const queries = shopId ? [Query.equal("shopId", shopId)] : []
        const result = await this.list(COLLECTIONS.CATALOG, queries)
        return result.documents
    }

    // Order Items and Tasks operations
    async getOrderItemsByWorker(workerId) {
        const queries = [Query.equal("assigned_to", workerId), Query.orderDesc("$createdAt")]
        const result = await this.list(COLLECTIONS.ORDER_ITEMS_AND_TASKS, queries)
        return result.documents
    }

    async updateTaskStatus(taskId, status) {
        return await this.update(COLLECTIONS.ORDER_ITEMS_AND_TASKS, taskId, { status })
    }
}

export const databaseService = new DatabaseService()
