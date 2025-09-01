import databaseService from './database-service';
import { Query } from 'appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';

class ReportsService {
  constructor() {
    this.collections = appwriteConfig.collections;
  }

  // ===== FINANCIAL REPORTS =====

  /**
   * Get comprehensive financial report for a shop
   */
  async getFinancialReport(shopId, startDate, endDate) {
    try {
      const dateQueries = [
        Query.greaterThanEqual('transaction_date', startDate),
        Query.lessThanEqual('transaction_date', endDate)
      ];

      if (shopId) {
        dateQueries.push(Query.equal('shopId', shopId));
      }

      // Get all transactions
      const transactions = await databaseService.getAll(
        this.collections.transactions,
        dateQueries
      );

      // Get expenses
      const expenses = await databaseService.getAll(
        this.collections.expenses,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('expense_date', startDate),
          Query.lessThanEqual('expense_date', endDate)
        ]
      );

      // Calculate totals
      const revenue = transactions.documents
        .filter(t => ['tailoring_order', 'fabric_sale'].includes(t.type))
        .reduce((sum, t) => sum + t.total_amount, 0);

      const totalExpenses = expenses.documents
        .reduce((sum, e) => sum + e.amount, 0);

      const profit = revenue - totalExpenses;

      // Group by type
      const revenueByType = {
        tailoring_orders: transactions.documents
          .filter(t => t.type === 'tailoring_order')
          .reduce((sum, t) => sum + t.total_amount, 0),
        fabric_sales: transactions.documents
          .filter(t => t.type === 'fabric_sale')
          .reduce((sum, t) => sum + t.total_amount, 0)
      };

      const expensesByType = {};
      expenses.documents.forEach(expense => {
        if (!expensesByType[expense.type]) {
          expensesByType[expense.type] = 0;
        }
        expensesByType[expense.type] += expense.amount;
      });

      return {
        summary: {
          totalRevenue: revenue,
          totalExpenses,
          netProfit: profit,
          profitMargin: revenue > 0 ? (profit / revenue) * 100 : 0
        },
        revenue: revenueByType,
        expenses: expensesByType,
        transactions: transactions.documents,
        expenseDetails: expenses.documents
      };
    } catch (error) {
      console.error('Financial report error:', error);
      throw error;
    }
  }

  /**
   * Get monthly financial summary
   */
  async getMonthlyFinancialSummary(shopId, year = new Date().getFullYear()) {
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const transactions = await databaseService.getAll(
        this.collections.transactions,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('transaction_date', startDate),
          Query.lessThanEqual('transaction_date', endDate)
        ]
      );

      const expenses = await databaseService.getAll(
        this.collections.expenses,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('expense_date', startDate),
          Query.lessThanEqual('expense_date', endDate)
        ]
      );

      // Group by month
      const monthlyData = {};
      
      // Initialize months
      for (let month = 0; month < 12; month++) {
        monthlyData[month] = {
          month: month + 1,
          revenue: 0,
          expenses: 0,
          profit: 0,
          orderCount: 0
        };
      }

      // Process transactions
      transactions.documents.forEach(transaction => {
        const month = new Date(transaction.transaction_date).getMonth();
        if (['tailoring_order', 'fabric_sale'].includes(transaction.type)) {
          monthlyData[month].revenue += transaction.total_amount;
          if (transaction.type === 'tailoring_order') {
            monthlyData[month].orderCount += 1;
          }
        }
      });

      // Process expenses
      expenses.documents.forEach(expense => {
        const month = new Date(expense.expense_date).getMonth();
        monthlyData[month].expenses += expense.amount;
      });

      // Calculate profit
      Object.values(monthlyData).forEach(data => {
        data.profit = data.revenue - data.expenses;
      });

      return Object.values(monthlyData);
    } catch (error) {
      console.error('Monthly financial summary error:', error);
      throw error;
    }
  }

  // ===== SALES REPORTS =====

  /**
   * Get sales performance report
   */
  async getSalesReport(shopId, startDate, endDate) {
    try {
      // Get tailoring orders
      const orders = await databaseService.getAll(
        this.collections.tailoring_orders,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('order_date', startDate),
          Query.lessThanEqual('order_date', endDate)
        ]
      );

      // Get fabric sales
      const fabricSales = await databaseService.getAll(
        this.collections.fabric_sales,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('sale_date', startDate),
          Query.lessThanEqual('sale_date', endDate)
        ]
      );

      // Calculate metrics
      const totalOrders = orders.documents.length;
      const completedOrders = orders.documents.filter(o => o.status === 'completed' || o.status === 'delivered').length;
      const pendingOrders = orders.documents.filter(o => o.status === 'pending' || o.status === 'in_progress').length;

      const totalTailoringRevenue = orders.documents.reduce((sum, o) => sum + o.total_price, 0);
      const totalFabricRevenue = fabricSales.documents.reduce((sum, s) => sum + s.total_amount, 0);

      const averageOrderValue = totalOrders > 0 ? totalTailoringRevenue / totalOrders : 0;

      // Group by status
      const ordersByStatus = {
        pending: orders.documents.filter(o => o.status === 'pending').length,
        in_progress: orders.documents.filter(o => o.status === 'in_progress').length,
        completed: orders.documents.filter(o => o.status === 'completed').length,
        delivered: orders.documents.filter(o => o.status === 'delivered').length
      };

      return {
        summary: {
          totalOrders,
          completedOrders,
          pendingOrders,
          completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
          totalRevenue: totalTailoringRevenue + totalFabricRevenue,
          tailoringRevenue: totalTailoringRevenue,
          fabricRevenue: totalFabricRevenue,
          averageOrderValue
        },
        ordersByStatus,
        orders: orders.documents,
        fabricSales: fabricSales.documents
      };
    } catch (error) {
      console.error('Sales report error:', error);
      throw error;
    }
  }

  // ===== INVENTORY REPORTS =====

  /**
   * Get inventory status report
   */
  async getInventoryReport(shopId) {
    try {
      const fabrics = await databaseService.getAll(
        this.collections.fabrics,
        [Query.equal('shopId', shopId)]
      );

      const totalValue = fabrics.documents.reduce(
        (sum, fabric) => sum + (fabric.stock_quantity * fabric.price_per_meter), 0
      );

      const totalCost = fabrics.documents.reduce(
        (sum, fabric) => sum + (fabric.stock_quantity * fabric.purchase_cost_per_meter), 0
      );

      const lowStockItems = fabrics.documents.filter(fabric => fabric.stock_quantity < 10);
      const outOfStockItems = fabrics.documents.filter(fabric => fabric.stock_quantity === 0);

      return {
        summary: {
          totalItems: fabrics.documents.length,
          totalValue,
          totalCost,
          potentialProfit: totalValue - totalCost,
          lowStockCount: lowStockItems.length,
          outOfStockCount: outOfStockItems.length
        },
        fabrics: fabrics.documents,
        lowStockItems,
        outOfStockItems
      };
    } catch (error) {
      console.error('Inventory report error:', error);
      throw error;
    }
  }

  // ===== WORKER PERFORMANCE REPORTS =====

  /**
   * Get worker performance report
   */
  async getWorkerPerformanceReport(shopId, startDate, endDate) {
    try {
      // Get work logs
      const workLogs = await databaseService.getAll(
        this.collections.work_log,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('date', startDate),
          Query.lessThanEqual('date', endDate)
        ]
      );

      // Get completed tasks
      const completedTasks = await databaseService.getAll(
        this.collections.order_items_and_tasks,
        [Query.equal('status', 'finished')]
      );

      // Get job payments
      const jobPayments = await databaseService.getAll(
        this.collections.job_payments,
        [
          Query.greaterThanEqual('payment_date', startDate),
          Query.lessThanEqual('payment_date', endDate)
        ]
      );

      // Group by worker
      const workerStats = {};

      workLogs.documents.forEach(log => {
        if (!workerStats[log.userId]) {
          workerStats[log.userId] = {
            userId: log.userId,
            totalHours: 0,
            workDays: 0,
            tasksCompleted: 0,
            totalEarnings: 0
          };
        }
        workerStats[log.userId].totalHours += log.total_hours || 0;
        workerStats[log.userId].workDays += 1;
      });

      completedTasks.documents.forEach(task => {
        if (workerStats[task.assigned_to]) {
          workerStats[task.assigned_to].tasksCompleted += 1;
        }
      });

      jobPayments.documents.forEach(payment => {
        if (workerStats[payment.userId]) {
          workerStats[payment.userId].totalEarnings += payment.amount;
        }
      });

      return {
        workerStats: Object.values(workerStats),
        totalWorkHours: Object.values(workerStats).reduce((sum, w) => sum + w.totalHours, 0),
        totalTasksCompleted: Object.values(workerStats).reduce((sum, w) => sum + w.tasksCompleted, 0),
        totalPayments: jobPayments.documents.reduce((sum, p) => sum + p.amount, 0)
      };
    } catch (error) {
      console.error('Worker performance report error:', error);
      throw error;
    }
  }

  // ===== CUSTOMER REPORTS =====

  /**
   * Get customer analytics report
   */
  async getCustomerReport(shopId, startDate, endDate) {
    try {
      // Get customers
      const customers = await databaseService.getAll(
        this.collections.customers,
        [Query.equal('shopId', shopId)]
      );

      // Get orders in date range
      const orders = await databaseService.getAll(
        this.collections.tailoring_orders,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('order_date', startDate),
          Query.lessThanEqual('order_date', endDate)
        ]
      );

      // Get feedback
      const feedback = await databaseService.getAll(
        this.collections.customer_feedback,
        [Query.equal('shopId', shopId)]
      );

      // Calculate customer metrics
      const customerMetrics = {};
      
      customers.documents.forEach(customer => {
        customerMetrics[customer.$id] = {
          customerId: customer.$id,
          name: customer.name,
          phone: customer.phone,
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          lastOrderDate: null,
          feedback: []
        };
      });

      orders.documents.forEach(order => {
        if (customerMetrics[order.customerId]) {
          customerMetrics[order.customerId].totalOrders += 1;
          customerMetrics[order.customerId].totalSpent += order.total_price;
          
          const orderDate = new Date(order.order_date);
          if (!customerMetrics[order.customerId].lastOrderDate || 
              orderDate > new Date(customerMetrics[order.customerId].lastOrderDate)) {
            customerMetrics[order.customerId].lastOrderDate = order.order_date;
          }
        }
      });

      feedback.documents.forEach(fb => {
        if (customerMetrics[fb.customerId]) {
          customerMetrics[fb.customerId].feedback.push(fb);
        }
      });

      // Calculate averages
      Object.values(customerMetrics).forEach(customer => {
        if (customer.totalOrders > 0) {
          customer.averageOrderValue = customer.totalSpent / customer.totalOrders;
        }
      });

      // Sort by total spent
      const topCustomers = Object.values(customerMetrics)
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10);

      const averageRating = feedback.documents.length > 0
        ? feedback.documents.reduce((sum, f) => sum + f.rating, 0) / feedback.documents.length
        : 0;

      return {
        summary: {
          totalCustomers: customers.documents.length,
          activeCustomers: Object.values(customerMetrics).filter(c => c.totalOrders > 0).length,
          averageOrderValue: orders.documents.length > 0 
            ? orders.documents.reduce((sum, o) => sum + o.total_price, 0) / orders.documents.length 
            : 0,
          averageRating,
          totalFeedback: feedback.documents.length
        },
        topCustomers,
        customerMetrics: Object.values(customerMetrics),
        feedback: feedback.documents
      };
    } catch (error) {
      console.error('Customer report error:', error);
      throw error;
    }
  }

  // ===== PRODUCTION REPORTS =====

  /**
   * Get production efficiency report
   */
  async getProductionReport(shopId, startDate, endDate) {
    try {
      // Get orders in date range
      const orders = await databaseService.getAll(
        this.collections.tailoring_orders,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('order_date', startDate),
          Query.lessThanEqual('order_date', endDate)
        ]
      );

      // Get order items
      const orderIds = orders.documents.map(o => o.$id);
      const allItems = [];
      
      for (const orderId of orderIds) {
        const items = await databaseService.getAll(
          this.collections.order_items_and_tasks,
          [Query.equal('orderId', orderId)]
        );
        allItems.push(...items.documents);
      }

      // Calculate production metrics
      const totalItems = allItems.length;
      const completedItems = allItems.filter(item => item.status === 'finished').length;
      const inProgressItems = allItems.filter(item => 
        ['cutting', 'embroidery', 'stone_work', 'sewing'].includes(item.status)
      ).length;

      // Group by status
      const itemsByStatus = {
        cutting: allItems.filter(item => item.status === 'cutting').length,
        embroidery: allItems.filter(item => item.status === 'embroidery').length,
        stone_work: allItems.filter(item => item.status === 'stone_work').length,
        sewing: allItems.filter(item => item.status === 'sewing').length,
        finished: completedItems
      };

      // Calculate average completion time
      const completedOrders = orders.documents.filter(o => 
        o.status === 'delivered' && o.actual_delivery_date
      );

      const averageCompletionTime = completedOrders.length > 0
        ? completedOrders.reduce((sum, order) => {
            const orderDate = new Date(order.order_date);
            const deliveryDate = new Date(order.actual_delivery_date);
            return sum + (deliveryDate - orderDate) / (1000 * 60 * 60 * 24); // days
          }, 0) / completedOrders.length
        : 0;

      return {
        summary: {
          totalItems,
          completedItems,
          inProgressItems,
          completionRate: totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
          averageCompletionTime: Math.round(averageCompletionTime)
        },
        itemsByStatus,
        orders: orders.documents,
        items: allItems
      };
    } catch (error) {
      console.error('Production report error:', error);
      throw error;
    }
  }

  // ===== WORKER REPORTS =====

  /**
   * Get individual worker report
   */
  async getWorkerReport(userId, startDate, endDate) {
    try {
      // Get work logs
      const workLogs = await databaseService.getAll(
        this.collections.work_log,
        [
          Query.equal('userId', userId),
          Query.greaterThanEqual('date', startDate),
          Query.lessThanEqual('date', endDate)
        ]
      );

      // Get completed tasks
      const completedTasks = await databaseService.getAll(
        this.collections.order_items_and_tasks,
        [
          Query.equal('assigned_to', userId),
          Query.equal('status', 'finished')
        ]
      );

      // Get job payments
      const jobPayments = await databaseService.getAll(
        this.collections.job_payments,
        [
          Query.equal('userId', userId),
          Query.greaterThanEqual('payment_date', startDate),
          Query.lessThanEqual('payment_date', endDate)
        ]
      );

      const totalHours = workLogs.documents.reduce((sum, log) => sum + (log.total_hours || 0), 0);
      const totalEarnings = jobPayments.documents.reduce((sum, payment) => sum + payment.amount, 0);
      const workDays = workLogs.documents.length;

      return {
        summary: {
          totalHours,
          workDays,
          averageHoursPerDay: workDays > 0 ? totalHours / workDays : 0,
          tasksCompleted: completedTasks.documents.length,
          totalEarnings,
          averageEarningsPerTask: completedTasks.documents.length > 0 
            ? totalEarnings / completedTasks.documents.length 
            : 0
        },
        workLogs: workLogs.documents,
        completedTasks: completedTasks.documents,
        jobPayments: jobPayments.documents
      };
    } catch (error) {
      console.error('Worker report error:', error);
      throw error;
    }
  }

  // ===== COMPARATIVE REPORTS =====

  /**
   * Get shop comparison report
   */
  async getShopComparisonReport(startDate, endDate) {
    try {
      const shops = await databaseService.getShops();
      const shopReports = [];

      for (const shop of shops.documents) {
        const report = await this.getFinancialReport(shop.$id, startDate, endDate);
        shopReports.push({
          shopId: shop.$id,
          shopName: shop.name,
          ...report.summary
        });
      }

      // Sort by revenue
      shopReports.sort((a, b) => b.totalRevenue - a.totalRevenue);

      return {
        shops: shopReports,
        totalRevenue: shopReports.reduce((sum, shop) => sum + shop.totalRevenue, 0),
        totalProfit: shopReports.reduce((sum, shop) => sum + shop.netProfit, 0),
        bestPerformingShop: shopReports[0],
        averageRevenue: shopReports.length > 0 
          ? shopReports.reduce((sum, shop) => sum + shop.totalRevenue, 0) / shopReports.length 
          : 0
      };
    } catch (error) {
      console.error('Shop comparison report error:', error);
      throw error;
    }
  }

  // ===== EXPORT UTILITIES =====

  /**
   * Format report data for CSV export
   */
  formatForCSV(data, type) {
    switch (type) {
      case 'financial':
        return this.formatFinancialDataForCSV(data);
      case 'sales':
        return this.formatSalesDataForCSV(data);
      case 'inventory':
        return this.formatInventoryDataForCSV(data);
      default:
        return data;
    }
  }

  formatFinancialDataForCSV(data) {
    const headers = ['Date', 'Type', 'Description', 'Amount', 'Category'];
    const rows = [];

    data.transactions.forEach(transaction => {
      rows.push([
        new Date(transaction.transaction_date).toLocaleDateString(),
        transaction.type,
        'Revenue',
        transaction.total_amount,
        transaction.type
      ]);
    });

    data.expenseDetails.forEach(expense => {
      rows.push([
        new Date(expense.expense_date).toLocaleDateString(),
        'expense',
        expense.description,
        -expense.amount,
        expense.type
      ]);
    });

    return { headers, rows };
  }

  formatSalesDataForCSV(data) {
    const headers = ['Order ID', 'Customer', 'Date', 'Status', 'Amount', 'Delivery Date'];
    const rows = data.orders.map(order => [
      order.orderId,
      order.customerId, // You might want to resolve customer name
      new Date(order.order_date).toLocaleDateString(),
      order.status,
      order.total_price,
      order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'N/A'
    ]);

    return { headers, rows };
  }

  formatInventoryDataForCSV(data) {
    const headers = ['Fabric Name', 'Code', 'Stock Quantity', 'Cost per Meter', 'Price per Meter', 'Total Value'];
    const rows = data.fabrics.map(fabric => [
      fabric.name,
      fabric.code,
      fabric.stock_quantity,
      fabric.purchase_cost_per_meter,
      fabric.price_per_meter,
      fabric.stock_quantity * fabric.price_per_meter
    ]);

    return { headers, rows };
  }

  // ===== ERROR HANDLING =====

  handleError(error) {
    console.error('Reports service error:', error);
    
    if (error.code === 401) {
      return new Error('Authentication required');
    } else if (error.code === 403) {
      return new Error('Permission denied');
    } else {
      return new Error(error.message || 'Report generation failed');
    }
  }
}

// Export singleton instance
const reportsService = new ReportsService();
export default reportsService;