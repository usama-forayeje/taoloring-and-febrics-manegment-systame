import databaseService from './database-service';
import { Query } from 'appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';

class AnalyticsService {
  constructor() {
    this.collections = appwriteConfig.collections;
  }

  // ===== REVENUE ANALYTICS =====

  /**
   * Get revenue trends over time
   */
  async getRevenueTrends(shopId, period = 'monthly', year = new Date().getFullYear()) {
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const transactions = await databaseService.getAll(
        this.collections.transactions,
        [
          Query.equal('shopId', shopId),
          Query.equal('type', 'tailoring_order'),
          Query.greaterThanEqual('transaction_date', startDate),
          Query.lessThanEqual('transaction_date', endDate),
          Query.orderAsc('transaction_date')
        ]
      );

      if (period === 'monthly') {
        return this.groupByMonth(transactions.documents, 'transaction_date', 'total_amount');
      } else if (period === 'weekly') {
        return this.groupByWeek(transactions.documents, 'transaction_date', 'total_amount');
      } else if (period === 'daily') {
        return this.groupByDay(transactions.documents, 'transaction_date', 'total_amount');
      }

      return transactions.documents;
    } catch (error) {
      console.error('Revenue trends error:', error);
      throw error;
    }
  }

  /**
   * Get order completion trends
   */
  async getOrderCompletionTrends(shopId, period = 'monthly') {
    try {
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;

      const orders = await databaseService.getAll(
        this.collections.tailoring_orders,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('order_date', startDate),
          Query.lessThanEqual('order_date', endDate)
        ]
      );

      const completedOrders = orders.documents.filter(order => 
        order.status === 'completed' || order.status === 'delivered'
      );

      if (period === 'monthly') {
        const ordersGrouped = this.groupByMonth(orders.documents, 'order_date', null, 'count');
        const completedGrouped = this.groupByMonth(completedOrders, 'actual_delivery_date', null, 'count');

        return this.mergeGroupedData(ordersGrouped, completedGrouped, 'completion_rate');
      }

      return { orders: orders.documents, completed: completedOrders };
    } catch (error) {
      console.error('Order completion trends error:', error);
      throw error;
    }
  }

  // ===== CUSTOMER ANALYTICS =====

  /**
   * Get customer acquisition trends
   */
  async getCustomerAcquisitionTrends(shopId, period = 'monthly') {
    try {
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;

      const customers = await databaseService.getAll(
        this.collections.customers,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('createdAt', startDate),
          Query.lessThanEqual('createdAt', endDate),
          Query.orderAsc('createdAt')
        ]
      );

      if (period === 'monthly') {
        return this.groupByMonth(customers.documents, 'createdAt', null, 'count');
      }

      return customers.documents;
    } catch (error) {
      console.error('Customer acquisition trends error:', error);
      throw error;
    }
  }

  /**
   * Get customer lifetime value analysis
   */
  async getCustomerLifetimeValue(shopId, limit = 50) {
    try {
      const orders = await databaseService.getAll(
        this.collections.tailoring_orders,
        [Query.equal('shopId', shopId)]
      );

      const customerData = {};

      orders.documents.forEach(order => {
        if (!customerData[order.customerId]) {
          customerData[order.customerId] = {
            customerId: order.customerId,
            totalSpent: 0,
            orderCount: 0,
            firstOrderDate: order.order_date,
            lastOrderDate: order.order_date,
            averageOrderValue: 0
          };
        }

        const customer = customerData[order.customerId];
        customer.totalSpent += order.total_price;
        customer.orderCount += 1;

        if (new Date(order.order_date) < new Date(customer.firstOrderDate)) {
          customer.firstOrderDate = order.order_date;
        }
        if (new Date(order.order_date) > new Date(customer.lastOrderDate)) {
          customer.lastOrderDate = order.order_date;
        }
      });

      // Calculate averages and customer lifetime
      Object.values(customerData).forEach(customer => {
        customer.averageOrderValue = customer.totalSpent / customer.orderCount;
        
        const firstOrder = new Date(customer.firstOrderDate);
        const lastOrder = new Date(customer.lastOrderDate);
        customer.customerLifetimeDays = Math.ceil((lastOrder - firstOrder) / (1000 * 60 * 60 * 24));
        
        customer.lifetimeValue = customer.totalSpent;
      });

      return Object.values(customerData)
        .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
        .slice(0, limit);
    } catch (error) {
      console.error('Customer lifetime value error:', error);
      throw error;
    }
  }

  // ===== INVENTORY ANALYTICS =====

  /**
   * Get fabric usage analytics
   */
  async getFabricUsageAnalytics(shopId, startDate, endDate) {
    try {
      const fabricSales = await databaseService.getAll(
        this.collections.fabric_sales,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('sale_date', startDate),
          Query.lessThanEqual('sale_date', endDate)
        ]
      );

      const fabricUsage = {};
      
      fabricSales.documents.forEach(sale => {
        sale.items.forEach(item => {
          if (!fabricUsage[item.fabricId]) {
            fabricUsage[item.fabricId] = {
              fabricId: item.fabricId,
              totalQuantitySold: 0,
              totalRevenue: 0,
              salesCount: 0
            };
          }
          
          fabricUsage[item.fabricId].totalQuantitySold += item.quantity;
          fabricUsage[item.fabricId].totalRevenue += item.sale_price * item.quantity;
          fabricUsage[item.fabricId].salesCount += 1;
        });
      });

      return Object.values(fabricUsage)
        .sort((a, b) => b.totalRevenue - a.totalRevenue);
    } catch (error) {
      console.error('Fabric usage analytics error:', error);
      throw error;
    }
  }

  /**
   * Get inventory turnover rate
   */
  async getInventoryTurnover(shopId, period = 'monthly') {
    try {
      const fabrics = await databaseService.getFabricsByShop(shopId);
      const currentDate = new Date();
      const periodStart = new Date();
      
      if (period === 'monthly') {
        periodStart.setMonth(currentDate.getMonth() - 1);
      } else if (period === 'quarterly') {
        periodStart.setMonth(currentDate.getMonth() - 3);
      } else if (period === 'yearly') {
        periodStart.setFullYear(currentDate.getFullYear() - 1);
      }

      const fabricSales = await databaseService.getAll(
        this.collections.fabric_sales,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('sale_date', periodStart.toISOString())
        ]
      );

      const turnoverData = fabrics.documents.map(fabric => {
        const salesForFabric = fabricSales.documents.filter(sale =>
          sale.items.some(item => item.fabricId === fabric.$id)
        );

        const totalSold = salesForFabric.reduce((sum, sale) => {
          const fabricItem = sale.items.find(item => item.fabricId === fabric.$id);
          return sum + (fabricItem ? fabricItem.quantity : 0);
        }, 0);

        const turnoverRate = fabric.stock_quantity > 0 
          ? (totalSold / fabric.stock_quantity) * 100 
          : 0;

        return {
          fabricId: fabric.$id,
          fabricName: fabric.name,
          currentStock: fabric.stock_quantity,
          soldQuantity: totalSold,
          turnoverRate,
          daysToStockOut: turnoverRate > 0 
            ? Math.ceil(fabric.stock_quantity / (totalSold / 30)) 
            : Infinity
        };
      });

      return turnoverData.sort((a, b) => b.turnoverRate - a.turnoverRate);
    } catch (error) {
      console.error('Inventory turnover error:', error);
      throw error;
    }
  }

  // ===== PERFORMANCE ANALYTICS =====

  /**
   * Get worker productivity analytics
   */
  async getWorkerProductivityAnalytics(shopId, startDate, endDate) {
    try {
      const workers = await databaseService.getUsersByRole('tailor', shopId);
      const embroideryWorkers = await databaseService.getUsersByRole('embroideryMan', shopId);
      const stoneWorkers = await databaseService.getUsersByRole('stoneMan', shopId);

      const allWorkers = [
        ...workers.documents,
        ...embroideryWorkers.documents,
        ...stoneWorkers.documents
      ];

      const productivityData = [];

      for (const worker of allWorkers) {
        const workLogs = await databaseService.getAll(
          this.collections.work_log,
          [
            Query.equal('userId', worker.$id),
            Query.equal('shopId', shopId),
            Query.greaterThanEqual('date', startDate),
            Query.lessThanEqual('date', endDate)
          ]
        );

        const completedTasks = await databaseService.getAll(
          this.collections.order_items_and_tasks,
          [
            Query.equal('assigned_to', worker.$id),
            Query.equal('status', 'finished')
          ]
        );

        const totalHours = workLogs.documents.reduce((sum, log) => sum + (log.total_hours || 0), 0);
        const tasksCompleted = completedTasks.documents.length;

        productivityData.push({
          workerId: worker.$id,
          workerName: worker.name,
          role: worker.role,
          totalHours,
          tasksCompleted,
          productivity: totalHours > 0 ? tasksCompleted / totalHours : 0,
          averageTaskTime: tasksCompleted > 0 ? totalHours / tasksCompleted : 0
        });
      }

      return productivityData.sort((a, b) => b.productivity - a.productivity);
    } catch (error) {
      console.error('Worker productivity analytics error:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  groupByMonth(data, dateField, valueField, operation = 'sum') {
    const grouped = {};
    
    data.forEach(item => {
      const date = new Date(item[dateField]);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          period: monthKey,
          value: 0,
          count: 0
        };
      }
      
      if (operation === 'sum' && valueField) {
        grouped[monthKey].value += item[valueField];
      } else if (operation === 'count') {
        grouped[monthKey].value += 1;
      }
      grouped[monthKey].count += 1;
    });

    return Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period));
  }

  groupByWeek(data, dateField, valueField, operation = 'sum') {
    const grouped = {};
    
    data.forEach(item => {
      const date = new Date(item[dateField]);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!grouped[weekKey]) {
        grouped[weekKey] = {
          period: weekKey,
          value: 0,
          count: 0
        };
      }
      
      if (operation === 'sum' && valueField) {
        grouped[weekKey].value += item[valueField];
      } else if (operation === 'count') {
        grouped[weekKey].value += 1;
      }
      grouped[weekKey].count += 1;
    });

    return Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period));
  }

  groupByDay(data, dateField, valueField, operation = 'sum') {
    const grouped = {};
    
    data.forEach(item => {
      const date = new Date(item[dateField]);
      const dayKey = date.toISOString().split('T')[0];
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = {
          period: dayKey,
          value: 0,
          count: 0
        };
      }
      
      if (operation === 'sum' && valueField) {
        grouped[dayKey].value += item[valueField];
      } else if (operation === 'count') {
        grouped[dayKey].value += 1;
      }
      grouped[dayKey].count += 1;
    });

    return Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period));
  }

  mergeGroupedData(data1, data2, calculatedField) {
    const merged = {};
    
    data1.forEach(item => {
      merged[item.period] = { ...item, [calculatedField]: 0 };
    });

    data2.forEach(item => {
      if (merged[item.period]) {
        merged[item.period][calculatedField] = merged[item.period].value > 0 
          ? (item.value / merged[item.period].value) * 100 
          : 0;
      }
    });

    return Object.values(merged);
  }

  // ===== PREDICTIVE ANALYTICS =====

  /**
   * Predict next month's revenue based on trends
   */
  async predictNextMonthRevenue(shopId) {
    try {
      const currentDate = new Date();
      const lastYear = new Date();
      lastYear.setFullYear(currentDate.getFullYear() - 1);

      const monthlyRevenue = await this.getRevenueTrends(shopId, 'monthly');
      
      if (monthlyRevenue.length < 3) {
        return { prediction: 0, confidence: 'low' };
      }

      // Simple linear regression for prediction
      const recentMonths = monthlyRevenue.slice(-6); // Last 6 months
      const trend = this.calculateTrend(recentMonths.map(m => m.value));
      
      const lastMonthRevenue = recentMonths[recentMonths.length - 1]?.value || 0;
      const prediction = Math.max(0, lastMonthRevenue + trend);

      const confidence = recentMonths.length >= 6 ? 'high' : 'medium';

      return {
        prediction: Math.round(prediction),
        confidence,
        trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
        trendValue: trend
      };
    } catch (error) {
      console.error('Revenue prediction error:', error);
      throw error;
    }
  }

  /**
   * Calculate simple trend from data points
   */
  calculateTrend(values) {
    if (values.length < 2) return 0;

    const n = values.length;
    const sumX = (n * (n - 1)) / 2; // Sum of indices
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squared indices

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  // ===== BUSINESS INSIGHTS =====

  /**
   * Get business insights and recommendations
   */
  async getBusinessInsights(shopId) {
    try {
      const insights = [];

      // Revenue insights
      const revenueData = await this.getRevenueTrends(shopId, 'monthly');
      const revenuePrediction = await this.predictNextMonthRevenue(shopId);
      
      if (revenuePrediction.trend === 'decreasing') {
        insights.push({
          type: 'warning',
          category: 'revenue',
          title: 'Revenue Declining',
          message: 'Revenue has been declining over the past few months. Consider marketing campaigns or new service offerings.',
          priority: 'high'
        });
      }

      // Inventory insights
      const inventoryReport = await databaseService.getAll(
        this.collections.fabrics,
        [Query.equal('shopId', shopId)]
      );

      const lowStockItems = inventoryReport.documents.filter(fabric => fabric.stock_quantity < 10);
      if (lowStockItems.length > 0) {
        insights.push({
          type: 'warning',
          category: 'inventory',
          title: 'Low Stock Alert',
          message: `${lowStockItems.length} fabric(s) are running low on stock.`,
          priority: 'medium',
          data: lowStockItems
        });
      }

      // Customer insights
      const customerData = await this.getCustomerLifetimeValue(shopId, 10);
      const topCustomer = customerData[0];
      
      if (topCustomer && topCustomer.lifetimeValue > 1000) {
        insights.push({
          type: 'success',
          category: 'customer',
          title: 'High-Value Customer',
          message: `Your top customer has spent ${topCustomer.lifetimeValue} OMR. Consider VIP treatment.`,
          priority: 'low'
        });
      }

      // Worker productivity insights
      const productivityData = await this.getWorkerProductivityAnalytics(
        shopId,
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        new Date().toISOString()
      );

      const lowProductivityWorkers = productivityData.filter(worker => worker.productivity < 0.5);
      if (lowProductivityWorkers.length > 0) {
        insights.push({
          type: 'info',
          category: 'productivity',
          title: 'Worker Training Needed',
          message: `${lowProductivityWorkers.length} worker(s) may need additional training or support.`,
          priority: 'medium'
        });
      }

      return insights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      console.error('Business insights error:', error);
      throw error;
    }
  }

  // ===== COMPARATIVE ANALYTICS =====

  /**
   * Compare performance across shops
   */
  async getShopPerformanceComparison(startDate, endDate) {
    try {
      const shops = await databaseService.getShops();
      const performanceData = [];

      for (const shop of shops.documents) {
        const transactions = await databaseService.getAll(
          this.collections.transactions,
          [
            Query.equal('shopId', shop.$id),
            Query.greaterThanEqual('transaction_date', startDate),
            Query.lessThanEqual('transaction_date', endDate)
          ]
        );

        const orders = await databaseService.getAll(
          this.collections.tailoring_orders,
          [
            Query.equal('shopId', shop.$id),
            Query.greaterThanEqual('order_date', startDate),
            Query.lessThanEqual('order_date', endDate)
          ]
        );

        const revenue = transactions.documents
          .filter(t => ['tailoring_order', 'fabric_sale'].includes(t.type))
          .reduce((sum, t) => sum + t.total_amount, 0);

        const completedOrders = orders.documents.filter(o => 
          o.status === 'completed' || o.status === 'delivered'
        ).length;

        performanceData.push({
          shopId: shop.$id,
          shopName: shop.name,
          revenue,
          orderCount: orders.documents.length,
          completedOrders,
          completionRate: orders.documents.length > 0 
            ? (completedOrders / orders.documents.length) * 100 
            : 0,
          averageOrderValue: orders.documents.length > 0 
            ? revenue / orders.documents.length 
            : 0
        });
      }

      return performanceData.sort((a, b) => b.revenue - a.revenue);
    } catch (error) {
      console.error('Shop performance comparison error:', error);
      throw error;
    }
  }

  // ===== REAL-TIME ANALYTICS =====

  /**
   * Get real-time dashboard metrics
   */
  async getRealTimeDashboardMetrics(shopId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().slice(0, 7);

      // Today's metrics
      const todayTransactions = await databaseService.getAll(
        this.collections.transactions,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('transaction_date', today)
        ]
      );

      const todayRevenue = todayTransactions.documents
        .filter(t => ['tailoring_order', 'fabric_sale'].includes(t.type))
        .reduce((sum, t) => sum + t.total_amount, 0);

      // This month's metrics
      const monthTransactions = await databaseService.getAll(
        this.collections.transactions,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('transaction_date', `${thisMonth}-01`)
        ]
      );

      const monthRevenue = monthTransactions.documents
        .filter(t => ['tailoring_order', 'fabric_sale'].includes(t.type))
        .reduce((sum, t) => sum + t.total_amount, 0);

      // Pending orders
      const pendingOrders = await databaseService.getAll(
        this.collections.tailoring_orders,
        [
          Query.equal('shopId', shopId),
          Query.equal('status', 'pending')
        ]
      );

      // Active workers today
      const todayWorkLogs = await databaseService.getAll(
        this.collections.work_log,
        [
          Query.equal('shopId', shopId),
          Query.greaterThanEqual('date', today)
        ]
      );

      return {
        today: {
          revenue: todayRevenue,
          transactions: todayTransactions.documents.length,
          activeWorkers: todayWorkLogs.documents.length
        },
        thisMonth: {
          revenue: monthRevenue,
          transactions: monthTransactions.documents.length
        },
        pending: {
          orders: pendingOrders.documents.length,
          value: pendingOrders.documents.reduce((sum, o) => sum + o.total_price, 0)
        }
      };
    } catch (error) {
      console.error('Real-time metrics error:', error);
      throw error;
    }
  }

  // ===== EXPORT METHODS =====

  /**
   * Export analytics data to different formats
   */
  async exportAnalyticsData(shopId, reportType, format = 'json', startDate, endDate) {
    try {
      let data;

      switch (reportType) {
        case 'financial':
          data = await this.getRevenueTrends(shopId, 'monthly');
          break;
        case 'customer':
          data = await this.getCustomerLifetimeValue(shopId);
          break;
        case 'inventory':
          data = await this.getFabricUsageAnalytics(shopId, startDate, endDate);
          break;
        case 'productivity':
          data = await this.getWorkerProductivityAnalytics(shopId, startDate, endDate);
          break;
        default:
          throw new Error('Invalid report type');
      }

      if (format === 'csv') {
        return this.convertToCSV(data);
      }

      return data;
    } catch (error) {
      console.error('Export analytics error:', error);
      throw error;
    }
  }

  convertToCSV(data) {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  }
}

// Export singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;