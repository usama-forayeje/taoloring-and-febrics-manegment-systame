import { databases, storage, account } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { ID, Query, Permission, Role } from 'appwrite';

class DatabaseService {
  constructor() {
    this.databaseId = appwriteConfig.databaseId;
    this.collections = appwriteConfig.collections;
  }

  // ===== GENERIC CRUD OPERATIONS =====

  /**
   * Create a new document in any collection
   */
  async create(collectionId, data, documentId = ID.unique(), permissions = []) {
    try {
      return await databases.createDocument(
        this.databaseId,
        collectionId,
        documentId,
        data,
        permissions
      );
    } catch (error) {
      console.error(`Create document error in ${collectionId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get document by ID
   */
  async getById(collectionId, documentId) {
    try {
      return await databases.getDocument(
        this.databaseId,
        collectionId,
        documentId
      );
    } catch (error) {
      console.error(`Get document error in ${collectionId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get all documents with optional queries
   */
  async getAll(collectionId, queries = []) {
    try {
      return await databases.listDocuments(
        this.databaseId,
        collectionId,
        queries
      );
    } catch (error) {
      console.error(`List documents error in ${collectionId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Update document
   */
  async update(collectionId, documentId, data, permissions = []) {
    try {
      return await databases.updateDocument(
        this.databaseId,
        collectionId,
        documentId,
        data,
        permissions
      );
    } catch (error) {
      console.error(`Update document error in ${collectionId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete document
   */
  async delete(collectionId, documentId) {
    try {
      return await databases.deleteDocument(
        this.databaseId,
        collectionId,
        documentId
      );
    } catch (error) {
      console.error(`Delete document error in ${collectionId}:`, error);
      throw this.handleError(error);
    }
  }

  // ===== USERS SERVICE =====

  async createUser(userData) {
    try {
      const userDoc = {
        phone: userData.phone,
        email: userData.email,
        avatar: userData.avatar || this.generateAvatar(userData.name, userData.email),
        role: userData.role || 'user',
        shopId: userData.shopId || null,
        name: userData.name,
        address: userData.address || '',
        salary: userData.salary || 0,
        joinDate: new Date().toISOString(),
        isActive: true
      };

      return await this.create(this.collections.users, userDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUsersByShop(shopId) {
    try {
      const queries = shopId ? [Query.equal('shopId', shopId)] : [];
      return await this.getAll(this.collections.users, queries);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUsersByRole(role, shopId = null) {
    try {
      const queries = [Query.equal('role', role)];
      if (shopId) queries.push(Query.equal('shopId', shopId));
      
      return await this.getAll(this.collections.users, queries);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUserRole(userId, role, shopId = null) {
    try {
      const updateData = { role };
      if (shopId) updateData.shopId = shopId;
      
      return await this.update(this.collections.users, userId, updateData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== SHOPS SERVICE =====

  async createShop(shopData) {
    try {
      const shopDoc = {
        name: shopData.name,
        address: shopData.address || '',
        contact: shopData.contact || '',
        createdAt: new Date().toISOString(),
        isActive: true
      };

      return await this.create(this.collections.shops, shopDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getShops() {
    try {
      return await this.getAll(this.collections.shops, [
        Query.equal('isActive', true),
        Query.orderDesc('createdAt')
      ]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateShop(shopId, shopData) {
    try {
      return await this.update(this.collections.shops, shopId, shopData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteShop(shopId) {
    try {
      return await this.update(this.collections.shops, shopId, { isActive: false });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== CUSTOMERS SERVICE =====

  async createCustomer(customerData) {
    try {
      const customerDoc = {
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address || '',
        shopId: customerData.shopId,
        createdAt: new Date().toISOString()
      };

      return await this.create(this.collections.customers, customerDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCustomersByShop(shopId) {
    try {
      return await this.getAll(this.collections.customers, [
        Query.equal('shopId', shopId),
        Query.orderDesc('createdAt')
      ]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchCustomers(searchTerm, shopId = null) {
    try {
      const queries = [
        Query.or([
          Query.search('name', searchTerm),
          Query.search('phone', searchTerm)
        ])
      ];
      
      if (shopId) queries.push(Query.equal('shopId', shopId));
      
      return await this.getAll(this.collections.customers, queries);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== TRANSACTIONS SERVICE =====

  async createTransaction(transactionData) {
    try {
      const transactionDoc = {
        type: transactionData.type,
        shopId: transactionData.shopId,
        customerId: transactionData.customerId || null,
        createdBy: transactionData.createdBy,
        transaction_date: transactionData.transaction_date || new Date().toISOString(),
        total_amount: transactionData.total_amount
      };

      return await this.create(this.collections.transactions, transactionDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTransactionsByShop(shopId, type = null) {
    try {
      const queries = [Query.equal('shopId', shopId), Query.orderDesc('transaction_date')];
      if (type) queries.push(Query.equal('type', type));
      
      return await this.getAll(this.collections.transactions, queries);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== TAILORING ORDERS SERVICE =====

  async createTailoringOrder(orderData) {
    try {
      // First create transaction
      const transaction = await this.createTransaction({
        type: 'tailoring_order',
        shopId: orderData.shopId,
        customerId: orderData.customerId,
        createdBy: orderData.orderedBy,
        total_amount: orderData.total_price
      });

      // Then create tailoring order
      const orderDoc = {
        orderId: `ORD-${Date.now()}`,
        customerId: orderData.customerId,
        transactionId: transaction.$id,
        shopId: orderData.shopId,
        orderedBy: orderData.orderedBy,
        catalogId: orderData.catalogId || null,
        assigned_tailorId: orderData.assigned_tailorId || null,
        assigned_stoneManId: orderData.assigned_stoneManId || null,
        assigned_embroideryManId: orderData.assigned_embroideryManId || null,
        order_date: new Date().toISOString(),
        delivery_date: orderData.delivery_date,
        status: 'pending',
        service_fee: orderData.service_fee || 0,
        materials_cost: orderData.materials_cost || 0,
        total_price: orderData.total_price,
        discount_amount: orderData.discount_amount || 0,
        notes: orderData.notes || ''
      };

      return await this.create(this.collections.tailoring_orders, orderDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTailoringOrdersByShop(shopId, status = null) {
    try {
      const queries = [Query.equal('shopId', shopId), Query.orderDesc('order_date')];
      if (status) queries.push(Query.equal('status', status));
      
      return await this.getAll(this.collections.tailoring_orders, queries);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTailoringOrderStatus(orderId, status, notes = '') {
    try {
      const updateData = { status };
      if (status === 'delivered') {
        updateData.actual_delivery_date = new Date().toISOString();
      }
      if (notes) updateData.notes = notes;
      
      return await this.update(this.collections.tailoring_orders, orderId, updateData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== ORDER ITEMS AND TASKS SERVICE =====

  async createOrderItem(itemData) {
    try {
      const itemDoc = {
        orderId: itemData.orderId,
        item_name: itemData.item_name,
        measurements: itemData.measurements || {},
        price: itemData.price,
        status: 'cutting',
        assigned_to: itemData.assigned_to || null
      };

      return await this.create(this.collections.order_items_and_tasks, itemDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrderItemsByOrder(orderId) {
    try {
      return await this.getAll(this.collections.order_items_and_tasks, [
        Query.equal('orderId', orderId)
      ]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrderItemsByWorker(workerId) {
    try {
      return await this.getAll(this.collections.order_items_and_tasks, [
        Query.equal('assigned_to', workerId),
        Query.notEqual('status', 'finished')
      ]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTaskStatus(taskId, status) {
    try {
      return await this.update(this.collections.order_items_and_tasks, taskId, { status });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== FABRICS SERVICE =====

  async createFabric(fabricData) {
    try {
      const fabricDoc = {
        name: fabricData.name,
        code: fabricData.code,
        stock_quantity: fabricData.stock_quantity,
        purchase_cost_per_meter: fabricData.purchase_cost_per_meter,
        price_per_meter: fabricData.price_per_meter,
        shopId: fabricData.shopId,
        invoiceId: fabricData.invoiceId || null
      };

      return await this.create(this.collections.fabrics, fabricDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getFabricsByShop(shopId) {
    try {
      return await this.getAll(this.collections.fabrics, [
        Query.equal('shopId', shopId),
        Query.orderDesc('$createdAt')
      ]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateFabricStock(fabricId, newQuantity) {
    try {
      return await this.update(this.collections.fabrics, fabricId, {
        stock_quantity: newQuantity
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== FABRIC SALES SERVICE =====

  async createFabricSale(saleData) {
    try {
      // Create transaction first
      const transaction = await this.createTransaction({
        type: 'fabric_sale',
        shopId: saleData.shopId,
        customerId: saleData.customerId || null,
        createdBy: saleData.soldBy,
        total_amount: saleData.total_amount
      });

      // Create fabric sale
      const saleDoc = {
        transactionId: transaction.$id,
        sale_date: new Date().toISOString(),
        shopId: saleData.shopId,
        total_amount: saleData.total_amount,
        total_cost_of_goods: saleData.total_cost_of_goods,
        soldBy: saleData.soldBy,
        items: saleData.items
      };

      const sale = await this.create(this.collections.fabric_sales, saleDoc);

      // Update fabric stock
      for (const item of saleData.items) {
        const fabric = await this.getById(this.collections.fabrics, item.fabricId);
        const newQuantity = fabric.stock_quantity - item.quantity;
        await this.updateFabricStock(item.fabricId, newQuantity);
      }

      return sale;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== EXPENSES SERVICE =====

  async createExpense(expenseData) {
    try {
      // Create transaction first
      const transaction = await this.createTransaction({
        type: 'expense',
        shopId: expenseData.shopId,
        createdBy: expenseData.recordedBy,
        total_amount: expenseData.amount
      });

      const expenseDoc = {
        transactionId: transaction.$id,
        type: expenseData.type,
        description: expenseData.description,
        amount: expenseData.amount,
        expense_date: expenseData.expense_date || new Date().toISOString(),
        shopId: expenseData.shopId,
        recordedBy: expenseData.recordedBy
      };

      return await this.create(this.collections.expenses, expenseDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getExpensesByShop(shopId, type = null) {
    try {
      const queries = [Query.equal('shopId', shopId), Query.orderDesc('expense_date')];
      if (type) queries.push(Query.equal('type', type));
      
      return await this.getAll(this.collections.expenses, queries);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== SALARIES SERVICE =====

  async createSalary(salaryData) {
    try {
      const salaryDoc = {
        userId: salaryData.userId,
        amount: salaryData.amount,
        payment_date: salaryData.payment_date || new Date().toISOString(),
        month: salaryData.month,
        shopId: salaryData.shopId,
        paidBy: salaryData.paidBy,
        notes: salaryData.notes || ''
      };

      return await this.create(this.collections.salaries, salaryDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSalariesByShop(shopId, month = null, year = null) {
    try {
      const queries = [Query.equal('shopId', shopId), Query.orderDesc('payment_date')];
      if (month) queries.push(Query.equal('month', month));
      
      return await this.getAll(this.collections.salaries, queries);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== JOB PAYMENTS SERVICE =====

  async createJobPayment(paymentData) {
    try {
      const paymentDoc = {
        userId: paymentData.userId,
        orderItemId: paymentData.orderItemId,
        amount: paymentData.amount,
        payment_date: new Date().toISOString(),
        status: 'paid',
        description: paymentData.description || '',
        notes: paymentData.notes || ''
      };

      return await this.create(this.collections.job_payments, paymentDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getJobPaymentsByUser(userId) {
    try {
      return await this.getAll(this.collections.job_payments, [
        Query.equal('userId', userId),
        Query.orderDesc('payment_date')
      ]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== PAYMENTS SERVICE =====

  async createPayment(paymentData) {
    try {
      const paymentDoc = {
        transactionId: paymentData.transactionId,
        amount: paymentData.amount,
        payment_date: new Date().toISOString(),
        payment_method: paymentData.payment_method,
        paidBy: paymentData.paidBy
      };

      return await this.create(this.collections.payments, paymentDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== CUSTOMER FEEDBACK SERVICE =====

  async createFeedback(feedbackData) {
    try {
      const feedbackDoc = {
        customerId: feedbackData.customerId,
        orderId: feedbackData.orderId,
        rating: feedbackData.rating,
        comment: feedbackData.comment || '',
        shopId: feedbackData.shopId
      };

      return await this.create(this.collections.customer_feedback, feedbackDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getFeedbackByShop(shopId) {
    try {
      return await this.getAll(this.collections.customer_feedback, [
        Query.equal('shopId', shopId),
        Query.orderDesc('$createdAt')
      ]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== WORK LOG SERVICE =====

  async createWorkLog(workLogData) {
    try {
      const workLogDoc = {
        userId: workLogData.userId,
        shopId: workLogData.shopId,
        date: workLogData.date || new Date().toISOString(),
        check_in: workLogData.check_in,
        check_out: workLogData.check_out || null,
        tasks_done: workLogData.tasks_done || '',
        total_hours: workLogData.total_hours || 0
      };

      return await this.create(this.collections.work_log, workLogDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getWorkLogsByUser(userId, shopId) {
    try {
      return await this.getAll(this.collections.work_log, [
        Query.equal('userId', userId),
        Query.equal('shopId', shopId),
        Query.orderDesc('date')
      ]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== NOTIFICATIONS SERVICE =====

  async createNotification(notificationData) {
    try {
      const notificationDoc = {
        userId: notificationData.userId,
        title: notificationData.title,
        message: notificationData.message,
        related_object_type: notificationData.related_object_type || 'general',
        related_object_id: notificationData.related_object_id || null,
        read_status: false,
        created_at: new Date().toISOString()
      };

      return await this.create(this.collections.notifications, notificationDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNotificationsByUser(userId) {
    try {
      return await this.getAll(this.collections.notifications, [
        Query.equal('userId', userId),
        Query.orderDesc('created_at')
      ]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      return await this.update(this.collections.notifications, notificationId, {
        read_status: true
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== CATALOG SERVICE =====

  async createCatalogItem(catalogData) {
    try {
      const catalogDoc = {
        shopId: catalogData.shopId,
        type: catalogData.type,
        name: catalogData.name,
        description: catalogData.description || '',
        price: catalogData.price,
        design_code: catalogData.design_code,
        image: catalogData.image || '',
        createdBy: catalogData.createdBy
      };

      return await this.create(this.collections.catalog, catalogDoc);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCatalogByShop(shopId, type = null) {
    try {
      const queries = [Query.equal('shopId', shopId)];
      if (type) queries.push(Query.equal('type', type));
      
      return await this.getAll(this.collections.catalog, queries);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== DASHBOARD STATS SERVICE =====

  async getDashboardStats(shopId = null) {
    try {
      const queries = shopId ? [Query.equal('shopId', shopId)] : [];

      // Get orders count
      const orders = await this.getAll(this.collections.tailoring_orders, queries);
      const pendingOrders = orders.documents.filter(order => order.status === 'pending');
      
      // Get total revenue
      const transactions = await this.getAll(this.collections.transactions, [
        ...queries,
        Query.equal('type', 'tailoring_order')
      ]);
      const totalRevenue = transactions.documents.reduce((sum, t) => sum + t.total_amount, 0);

      // Get active workers
      const workerQueries = shopId ? [Query.equal('shopId', shopId)] : [];
      workerQueries.push(Query.equal('isActive', true));
      workerQueries.push(Query.or([
        Query.equal('role', 'tailor'),
        Query.equal('role', 'embroideryMan'),
        Query.equal('role', 'stoneMan')
      ]));
      
      const workers = await this.getAll(this.collections.users, workerQueries);

      return {
        totalOrders: orders.documents.length,
        pendingOrders: pendingOrders.length,
        totalRevenue,
        activeWorkers: workers.documents.length
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== UTILITY METHODS =====

  generateAvatar(name, email) {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${email}&backgroundColor=3b82f6&textColor=ffffff`;
  }

  handleError(error) {
    console.error('Database service error:', error);
    
    if (error.code === 401) {
      return new Error('Authentication required');
    } else if (error.code === 403) {
      return new Error('Permission denied');
    } else if (error.code === 404) {
      return new Error('Resource not found');
    } else if (error.code === 409) {
      return new Error('Resource already exists');
    } else {
      return new Error(error.message || 'Database operation failed');
    }
  }

  // ===== SEARCH AND FILTER UTILITIES =====

  async searchAcrossCollections(searchTerm, shopId = null) {
    try {
      const results = {};

      // Search customers
      const customerQueries = [Query.search('name', searchTerm)];
      if (shopId) customerQueries.push(Query.equal('shopId', shopId));
      results.customers = await this.getAll(this.collections.customers, customerQueries);

      // Search orders
      const orderQueries = [Query.search('orderId', searchTerm)];
      if (shopId) orderQueries.push(Query.equal('shopId', shopId));
      results.orders = await this.getAll(this.collections.tailoring_orders, orderQueries);

      // Search fabrics
      const fabricQueries = [Query.search('name', searchTerm)];
      if (shopId) fabricQueries.push(Query.equal('shopId', shopId));
      results.fabrics = await this.getAll(this.collections.fabrics, fabricQueries);

      return results;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== ANALYTICS AND REPORTS =====

  async getMonthlyRevenue(shopId = null, year = new Date().getFullYear()) {
    try {
      const queries = [
        Query.equal('type', 'tailoring_order'),
        Query.greaterThanEqual('transaction_date', `${year}-01-01`),
        Query.lessThanEqual('transaction_date', `${year}-12-31`)
      ];
      
      if (shopId) queries.push(Query.equal('shopId', shopId));

      const transactions = await this.getAll(this.collections.transactions, queries);
      
      // Group by month
      const monthlyData = {};
      transactions.documents.forEach(transaction => {
        const month = new Date(transaction.transaction_date).getMonth();
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        monthlyData[month] += transaction.total_amount;
      });

      return monthlyData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTopCustomers(shopId = null, limit = 10) {
    try {
      const queries = shopId ? [Query.equal('shopId', shopId)] : [];
      const orders = await this.getAll(this.collections.tailoring_orders, queries);
      
      // Group by customer and calculate totals
      const customerTotals = {};
      orders.documents.forEach(order => {
        if (!customerTotals[order.customerId]) {
          customerTotals[order.customerId] = {
            customerId: order.customerId,
            totalAmount: 0,
            orderCount: 0
          };
        }
        customerTotals[order.customerId].totalAmount += order.total_price;
        customerTotals[order.customerId].orderCount += 1;
      });

      // Sort and limit
      return Object.values(customerTotals)
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, limit);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== BULK OPERATIONS =====

  async bulkCreateOrderItems(orderId, items) {
    try {
      const promises = items.map(item => 
        this.createOrderItem({
          ...item,
          orderId
        })
      );
      
      return await Promise.all(promises);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bulkUpdateTaskStatus(taskIds, status) {
    try {
      const promises = taskIds.map(taskId => 
        this.updateTaskStatus(taskId, status)
      );
      
      return await Promise.all(promises);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Export singleton instance
const databaseService = new DatabaseService();
export default databaseService;