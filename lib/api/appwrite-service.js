import { account, databases } from "@/lib/appwrite"
import { ID, Query } from "appwrite"

// Database and Collection IDs (these should be environment variables in production)
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "main"
const COLLECTIONS = {
  USERS: "users",
  SHOPS: "shops",
  CUSTOMERS: "customers",
  TRANSACTIONS: "transactions",
  TAILORING_ORDERS: "tailoring_orders",
  ORDER_ITEMS_AND_TASKS: "order_items_and_tasks",
  FABRICS: "fabrics",
  FABRIC_SALES: "fabric_sales",
  EXPENSES: "expenses",
  SALARIES: "salaries",
  PAYMENTS: "payments",
  NOTIFICATIONS: "notifications",
  CATALOG: "catalog",
}

// Auth Services
export const authService = {
  getCurrentUser: async () => {
    try {
      return await account.get()
    } catch (error) {
      throw error
    }
  },

  signIn: async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password)
      return await account.get()
    } catch (error) {
      throw error
    }
  },

  signUp: async (email, password, name) => {
    try {
      await account.create(ID.unique(), email, password, name)
      await account.createEmailPasswordSession(email, password)
      return await account.get()
    } catch (error) {
      throw error
    }
  },

  signOut: async () => {
    try {
      await account.deleteSession("current")
    } catch (error) {
      throw error
    }
  },

  createOAuth2Session: (provider, successUrl, failureUrl) => {
    return account.createOAuth2Session(provider, successUrl, failureUrl)
  },
}

// Dashboard Services
export const dashboardService = {
  getStats: async () => {
    try {
      // Simulate API call - replace with actual Appwrite queries
      const [orders, customers, revenue] = await Promise.all([
        databases.listDocuments(DATABASE_ID, COLLECTIONS.TAILORING_ORDERS, [Query.limit(100)]),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.CUSTOMERS, [Query.limit(100)]),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.TRANSACTIONS, [
          Query.equal("type", "tailoring_order"),
          Query.limit(100),
        ]),
      ])

      const totalOrders = orders.total
      const activeCustomers = customers.total
      const totalRevenue = revenue.documents.reduce((sum, transaction) => sum + (transaction.total_amount || 0), 0)
      const pendingOrders = orders.documents.filter((order) => order.status === "pending").length

      return {
        totalOrders,
        activeCustomers,
        totalRevenue,
        pendingOrders,
        ordersGrowth: "+20.1%",
        customersGrowth: "+15.3%",
        revenueGrowth: "+19%",
        pendingGrowth: "+7%",
      }
    } catch (error) {
      // Return mock data if database is not set up
      return {
        totalOrders: 245,
        activeCustomers: 156,
        totalRevenue: 12234,
        pendingOrders: 23,
        ordersGrowth: "+20.1%",
        customersGrowth: "+15.3%",
        revenueGrowth: "+19%",
        pendingGrowth: "+7%",
      }
    }
  },

  getRecentOrders: async (limit = 10) => {
    try {
      const orders = await databases.listDocuments(DATABASE_ID, COLLECTIONS.TAILORING_ORDERS, [
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ])

      return orders.documents.map((order) => ({
        id: order.$id,
        customerName: order.customer_name || "Unknown Customer",
        orderDescription: order.notes || "Custom Order",
        amount: order.total_price || 0,
        status: order.status || "pending",
        createdAt: order.$createdAt,
      }))
    } catch (error) {
      // Return mock data if database is not set up
      return [
        {
          id: "1",
          customerName: "Fatima Al-Zahra",
          orderDescription: "Royal Omani Abaya",
          amount: 1999,
          status: "completed",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          customerName: "Aisha Mohammed",
          orderDescription: "Traditional Burkha Set",
          amount: 399,
          status: "processing",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          customerName: "Mariam Al-Busaidi",
          orderDescription: "Custom Evening Dress",
          amount: 799,
          status: "completed",
          createdAt: new Date().toISOString(),
        },
      ]
    }
  },

  getMonthlyRevenue: async () => {
    try {
      // This would be a complex query in production
      // For now, return mock data
      return [
        { name: "Jan", total: 1200, target: 1500 },
        { name: "Feb", total: 1900, target: 1800 },
        { name: "Mar", total: 2800, target: 2500 },
        { name: "Apr", total: 1800, target: 2000 },
        { name: "May", total: 2400, target: 2200 },
        { name: "Jun", total: 2100, target: 2300 },
        { name: "Jul", total: 2800, target: 2600 },
        { name: "Aug", total: 3200, target: 3000 },
        { name: "Sep", total: 2900, target: 2800 },
        { name: "Oct", total: 3100, target: 3200 },
        { name: "Nov", total: 2700, target: 2900 },
        { name: "Dec", total: 3400, target: 3300 },
      ]
    } catch (error) {
      throw error
    }
  },
}

// Orders Services
export const ordersService = {
  getOrders: async (filters) => {
    try {
      const queries = [Query.orderDesc("$createdAt")]

      if (filters?.status) {
        queries.push(Query.equal("status", filters.status))
      }

      if (filters?.limit) {
        queries.push(Query.limit(filters.limit))
      }

      const orders = await databases.listDocuments(DATABASE_ID, COLLECTIONS.TAILORING_ORDERS, queries)
      return orders
    } catch (error) {
      throw error
    }
  },

  createOrder: async (orderData) => {
    try {
      const order = await databases.createDocument(DATABASE_ID, COLLECTIONS.TAILORING_ORDERS, ID.unique(), orderData)
      return order
    } catch (error) {
      throw error
    }
  },

  updateOrder: async (orderId, orderData) => {
    try {
      const order = await databases.updateDocument(DATABASE_ID, COLLECTIONS.TAILORING_ORDERS, orderId, orderData)
      return order
    } catch (error) {
      throw error
    }
  },

  deleteOrder: async (orderId) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.TAILORING_ORDERS, orderId)
    } catch (error) {
      throw error
    }
  },
}

// Customers Services
export const customersService = {
  getCustomers: async (limit = 50) => {
    try {
      const customers = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CUSTOMERS, [
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ])
      return customers
    } catch (error) {
      throw error
    }
  },

  createCustomer: async (customerData) => {
    try {
      const customer = await databases.createDocument(DATABASE_ID, COLLECTIONS.CUSTOMERS, ID.unique(), customerData)
      return customer
    } catch (error) {
      throw error
    }
  },

  updateCustomer: async (customerId, customerData) => {
    try {
      const customer = await databases.updateDocument(DATABASE_ID, COLLECTIONS.CUSTOMERS, customerId, customerData)
      return customer
    } catch (error) {
      throw error
    }
  },
}
