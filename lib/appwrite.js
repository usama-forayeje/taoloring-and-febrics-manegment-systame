import { Account, Client, Functions, TablesDB, Storage } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")

export const account = new Account(client)
export const databases = new TablesDB(client);
export const storage = new Storage(client)
export const functions = new Functions(client)

export { client }

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || ""

// Collection IDs based on the database structure
export const COLLECTIONS = {
  USERS: "users",
  SHOPS: "shops",
  CUSTOMERS: "customers",
  TRANSACTIONS: "transactions",
  TAILORING_ORDERS: "tailoring_orders",
  ORDER_ITEMS_AND_TASKS: "order_items_and_tasks",
  FABRICS: "fabrics",
  FABRIC_SALES: "fabric_sales",
  PURCHASE_INVOICES: "purchase_invoices",
  EXPENSES: "expenses",
  SALARIES: "salaries",
  JOB_PAYMENTS: "job_payments",
  PAYMENTS: "payments",
  CUSTOMER_FEEDBACK: "customer_feedback",
  LOGS: "logs",
  WORK_LOG: "work_log",
  PERSONAL_ACCOUNTS: "personal_accounts",
  NOTIFICATIONS: "notifications",
  CATALOG: "catalog",
}

// User roles enum
export const USER_ROLES = {
  SUPER_ADMIN: "superAdmin",
  ADMIN: "admin",
  MANAGER: "manager",
  TAILOR: "tailor",
  USER: "user",
  EMBROIDERY_MAN: "embroideryMan",
  STONE_MAN: "stoneMan",
}

// Order status enum
export const ORDER_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  DELIVERED: "delivered",
}

// Task status enum
export const TASK_STATUS = {
  CUTTING: "cutting",
  EMBROIDERY: "embroidery",
  STONE_WORK: "stone_work",
  SEWING: "sewing",
  FINISHED: "finished",
}
