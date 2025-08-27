import { PERMISSIONS, hasPermission } from '@/lib/roles';

// Role-based navigation items
export const getNavigationItems = (userRole) => {
  const baseItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'LayoutDashboard',
      permission: null
    }
  ];

  const conditionalItems = [
    {
      label: 'Orders',
      href: '/dashboard/orders',
      icon: 'ShoppingBag',
      permission: PERMISSIONS.VIEW_ALL_ORDERS,
      children: [
        {
          label: 'All Orders',
          href: '/dashboard/orders',
          permission: PERMISSIONS.VIEW_ALL_ORDERS
        },
        {
          label: 'Create Order',
          href: '/dashboard/orders/create',
          permission: PERMISSIONS.CREATE_ORDERS
        },
        {
          label: 'My Tasks',
          href: '/dashboard/orders/tasks',
          permission: PERMISSIONS.VIEW_OWN_ORDERS
        }
      ]
    },
    {
      label: 'Customers',
      href: '/dashboard/customers',
      icon: 'Users',
      permission: PERMISSIONS.VIEW_CUSTOMERS,
      children: [
        {
          label: 'All Customers',
          href: '/dashboard/customers',
          permission: PERMISSIONS.VIEW_CUSTOMERS
        },
        {
          label: 'Add Customer',
          href: '/dashboard/customers/create',
          permission: PERMISSIONS.MANAGE_CUSTOMERS
        }
      ]
    },
    {
      label: 'Inventory',
      href: '/dashboard/inventory',
      icon: 'Package',
      permission: PERMISSIONS.VIEW_INVENTORY,
      children: [
        {
          label: 'Fabrics',
          href: '/dashboard/inventory/fabrics',
          permission: PERMISSIONS.VIEW_INVENTORY
        },
        {
          label: 'Manage Fabrics',
          href: '/dashboard/inventory/fabrics/manage',
          permission: PERMISSIONS.MANAGE_FABRICS
        }
      ]
    },
    {
      label: 'Finance',
      href: '/dashboard/finance',
      icon: 'DollarSign',
      permission: PERMISSIONS.VIEW_REPORTS,
      children: [
        {
          label: 'Reports',
          href: '/dashboard/finance/reports',
          permission: PERMISSIONS.VIEW_REPORTS
        },
        {
          label: 'Expenses',
          href: '/dashboard/finance/expenses',
          permission: PERMISSIONS.MANAGE_EXPENSES
        },
        {
          label: 'Payments',
          href: '/dashboard/finance/payments',
          permission: PERMISSIONS.MANAGE_PAYMENTS
        }
      ]
    },
    {
      label: 'Users',
      href: '/dashboard/users',
      icon: 'UserCheck',
      permission: PERMISSIONS.MANAGE_USERS,
      children: [
        {
          label: 'All Users',
          href: '/dashboard/users',
          permission: PERMISSIONS.VIEW_ALL_USERS
        },
        {
          label: 'Add User',
          href: '/dashboard/users/create',
          permission: PERMISSIONS.MANAGE_USERS
        },
        {
          label: 'Roles & Permissions',
          href: '/dashboard/users/roles',
          permission: PERMISSIONS.ASSIGN_ROLES
        }
      ]
    },
    {
      label: 'Work Log',
      href: '/dashboard/work-log',
      icon: 'Clock',
      permission: PERMISSIONS.VIEW_WORK_LOG
    }
  ];

  // Filter items based on user permissions
  const filteredItems = conditionalItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(userRole, item.permission);
  });

  // Filter children based on permissions
  const itemsWithFilteredChildren = filteredItems.map(item => {
    if (item.children) {
      const filteredChildren = item.children.filter(child => {
        if (!child.permission) return true;
        return hasPermission(userRole, child.permission);
      });
      return { ...item, children: filteredChildren };
    }
    return item;
  });

  return [...baseItems, ...itemsWithFilteredChildren];
};

// Role-based dashboard widgets
export const getDashboardWidgets = (userRole) => {
  const widgets = [
    {
      id: 'orders-overview',
      component: 'OrdersOverview',
      permission: PERMISSIONS.VIEW_ALL_ORDERS,
      priority: 1
    },
    {
      id: 'revenue-chart',
      component: 'RevenueChart',
      permission: PERMISSIONS.VIEW_REPORTS,
      priority: 2
    },
    {
      id: 'recent-customers',
      component: 'RecentCustomers',
      permission: PERMISSIONS.VIEW_CUSTOMERS,
      priority: 3
    },
    {
      id: 'my-tasks',
      component: 'MyTasks',
      permission: PERMISSIONS.VIEW_OWN_ORDERS,
      priority: 4
    },
    {
      id: 'inventory-alerts',
      component: 'InventoryAlerts',
      permission: PERMISSIONS.VIEW_INVENTORY,
      priority: 5
    },
    {
      id: 'pending-payments',
      component: 'PendingPayments',
      permission: PERMISSIONS.MANAGE_PAYMENTS,
      priority: 6
    }
  ];

  return widgets
    .filter(widget => hasPermission(userRole, widget.permission))
    .sort((a, b) => a.priority - b.priority);
};

// Quick actions based on role
export const getQuickActions = (userRole) => {
  const actions = [
    {
      label: 'New Order',
      href: '/dashboard/orders/create',
      icon: 'Plus',
      permission: PERMISSIONS.CREATE_ORDERS,
      color: 'blue'
    },
    {
      label: 'Add Customer',
      href: '/dashboard/customers/create',
      icon: 'UserPlus',
      permission: PERMISSIONS.MANAGE_CUSTOMERS,
      color: 'green'
    },
    {
      label: 'Record Expense',
      href: '/dashboard/finance/expenses/create',
      icon: 'Receipt',
      permission: PERMISSIONS.MANAGE_EXPENSES,
      color: 'red'
    },
    {
      label: 'Add User',
      href: '/dashboard/users/create',
      icon: 'UserCheck',
      permission: PERMISSIONS.MANAGE_USERS,
      color: 'purple'
    }
  ];
}
