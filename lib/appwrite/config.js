export const appwriteConfig = {
  // Server Configuration
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  
  // Database & Storage
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID,
  
  // All Collections Mapping
  collections: {
    // Core Collections
    users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
    shops: process.env.NEXT_PUBLIC_APPWRITE_SHOPS_COLLECTION_ID,
    customers: process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID,
    
    // Order Management
    orders: process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID,
    orderItems: process.env.NEXT_PUBLIC_APPWRITE_ORDER_ITEMS_COLLECTION_ID,
    catalog: process.env.NEXT_PUBLIC_APPWRITE_CATALOG_COLLECTION_ID,
    
    // Financial
    transactions: process.env.NEXT_PUBLIC_APPWRITE_TRANSACTIONS_COLLECTION_ID,
    payments: process.env.NEXT_PUBLIC_APPWRITE_PAYMENTS_COLLECTION_ID,
    expenses: process.env.NEXT_PUBLIC_APPWRITE_EXPENSES_COLLECTION_ID,
    salaries: process.env.NEXT_PUBLIC_APPWRITE_SALARIES_COLLECTION_ID,
    jobPayments: process.env.NEXT_PUBLIC_APPWRITE_JOB_PAYMENTS_COLLECTION_ID,
    
    // Inventory
    fabrics: process.env.NEXT_PUBLIC_APPWRITE_FABRICS_COLLECTION_ID,
    fabricSales: process.env.NEXT_PUBLIC_APPWRITE_FABRIC_SALES_COLLECTION_ID,
    
    // Additional
    feedback: process.env.NEXT_PUBLIC_APPWRITE_FEEDBACK_COLLECTION_ID,
    workLog: process.env.NEXT_PUBLIC_APPWRITE_WORK_LOG_COLLECTION_ID,
    notifications: process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID,
  },
  
  // Additional Configuration (Optional)
  buckets: {
    avatars: process.env.NEXT_PUBLIC_APPWRITE_AVATARS_BUCKET_ID,
    documents: process.env.NEXT_PUBLIC_APPWRITE_DOCUMENTS_BUCKET_ID,
    images: process.env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID,
  },
  
  // API Endpoints (if needed)
  functions: {
    sendNotification: process.env.NEXT_PUBLIC_APPWRITE_SEND_NOTIFICATION_FUNCTION_ID,
    generateReport: process.env.NEXT_PUBLIC_APPWRITE_GENERATE_REPORT_FUNCTION_ID,
  }
};

// Validation Function (Optional but Recommended)
export const validateConfig = () => {
  const required = [
    'endpoint',
    'projectId', 
    'databaseId',
    'storageId'
  ];
  
  for (const key of required) {
    if (!appwriteConfig[key]) {
      throw new Error(`Missing required config: ${key}`);
    }
  }
  
  console.log('✅ Appwrite configuration validated successfully');
};

// Export individual configs for easy access
export const {
  endpoint,
  projectId,
  databaseId,
  storageId,
  collections,
  buckets,
  functions
} = appwriteConfig;
