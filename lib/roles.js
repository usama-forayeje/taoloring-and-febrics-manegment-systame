// ✅ Role Definitions
export const ROLES = {
  SUPER_ADMIN: 'superAdmin',
  ADMIN: 'admin', 
  MANAGER: 'manager',
  TAILOR: 'tailor',
  EMBROIDERY_MAN: 'embroideryMan',
  STONE_MAN: 'stoneMan',
  USER: 'user'
};

// ✅ Role Hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 6,
  [ROLES.ADMIN]: 5,
  [ROLES.MANAGER]: 4,
  [ROLES.TAILOR]: 3,
  [ROLES.EMBROIDERY_MAN]: 2,
  [ROLES.STONE_MAN]: 2,
  [ROLES.USER]: 1
};

// ✅ Role Permissions
export const PERMISSIONS = {
  // System Management
  MANAGE_SYSTEM: 'manage_system',
  MANAGE_SHOPS: 'manage_shops',
  
  // User Management
  MANAGE_USERS: 'manage_users',
  VIEW_ALL_USERS: 'view_all_users',
  ASSIGN_ROLES: 'assign_roles',
  
  // Order Management
  CREATE_ORDERS: 'create_orders',
  VIEW_ALL_ORDERS: 'view_all_orders',
  VIEW_OWN_ORDERS: 'view_own_orders',
  UPDATE_ORDERS: 'update_orders',
  DELETE_ORDERS: 'delete_orders',
  ASSIGN_ORDERS: 'assign_orders',
  
  // Customer Management
  MANAGE_CUSTOMERS: 'manage_customers',
  VIEW_CUSTOMERS: 'view_customers',
  
  // Financial
  MANAGE_FINANCES: 'manage_finances',
  VIEW_REPORTS: 'view_reports',
  MANAGE_EXPENSES: 'manage_expenses',
  MANAGE_PAYMENTS: 'manage_payments',
  
  // Inventory
  MANAGE_FABRICS: 'manage_fabrics',
  VIEW_INVENTORY: 'view_inventory',
  FABRIC_SALES: 'fabric_sales',
  
  // Work Management
  UPDATE_TASK_STATUS: 'update_task_status',
  VIEW_WORK_LOG: 'view_work_log',
  MANAGE_WORK_LOG: 'manage_work_log'
};

// ✅ Role-Permission Mapping
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // All permissions
    ...Object.values(PERMISSIONS)
  ],
  
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_SHOPS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_ALL_USERS,
    PERMISSIONS.ASSIGN_ROLES,
    PERMISSIONS.CREATE_ORDERS,
    PERMISSIONS.VIEW_ALL_ORDERS,
    PERMISSIONS.UPDATE_ORDERS,
    PERMISSIONS.DELETE_ORDERS,
    PERMISSIONS.ASSIGN_ORDERS,
    PERMISSIONS.MANAGE_CUSTOMERS,
    PERMISSIONS.MANAGE_FINANCES,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_EXPENSES,
    PERMISSIONS.MANAGE_PAYMENTS,
    PERMISSIONS.MANAGE_FABRICS,
    PERMISSIONS.VIEW_INVENTORY,
    PERMISSIONS.FABRIC_SALES,
    PERMISSIONS.MANAGE_WORK_LOG
  ],
  
  [ROLES.MANAGER]: [
    PERMISSIONS.CREATE_ORDERS,
    PERMISSIONS.VIEW_ALL_ORDERS,
    PERMISSIONS.UPDATE_ORDERS,
    PERMISSIONS.ASSIGN_ORDERS,
    PERMISSIONS.MANAGE_CUSTOMERS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_EXPENSES,
    PERMISSIONS.MANAGE_PAYMENTS,
    PERMISSIONS.MANAGE_FABRICS,
    PERMISSIONS.VIEW_INVENTORY,
    PERMISSIONS.FABRIC_SALES,
    PERMISSIONS.VIEW_WORK_LOG
  ],
  
  [ROLES.TAILOR]: [
    PERMISSIONS.VIEW_OWN_ORDERS,
    PERMISSIONS.UPDATE_TASK_STATUS,
    PERMISSIONS.VIEW_WORK_LOG,
    PERMISSIONS.VIEW_CUSTOMERS
  ],
  
  [ROLES.EMBROIDERY_MAN]: [
    PERMISSIONS.VIEW_OWN_ORDERS,
    PERMISSIONS.UPDATE_TASK_STATUS,
    PERMISSIONS.VIEW_WORK_LOG
  ],
  
  [ROLES.STONE_MAN]: [
    PERMISSIONS.VIEW_OWN_ORDERS,
    PERMISSIONS.UPDATE_TASK_STATUS,
    PERMISSIONS.VIEW_WORK_LOG
  ],
  
  [ROLES.USER]: [
    PERMISSIONS.VIEW_OWN_ORDERS
  ]
};

// ✅ Check if user has permission
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

// ✅ Check if user has any of the permissions
export const hasAnyPermission = (userRole, permissions = []) => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

// ✅ Check if user has all permissions
export const hasAllPermissions = (userRole, permissions = []) => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

// ✅ Check role hierarchy
export const hasHigherRole = (userRole, targetRole) => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] || 0;
  return userLevel > targetLevel;
};

// ✅ Get role display name
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.ADMIN]: 'Admin',
    [ROLES.MANAGER]: 'Manager',
    [ROLES.TAILOR]: 'Tailor',
    [ROLES.EMBROIDERY_MAN]: 'Embroidery Specialist',
    [ROLES.STONE_MAN]: 'Stone Work Specialist',
    [ROLES.USER]: 'User'
  };
  
  return roleNames[role] || 'Unknown Role';
};

// ✅ Get available roles for assignment (based on current user's role)
export const getAssignableRoles = (currentUserRole) => {
  const currentLevel = ROLE_HIERARCHY[currentUserRole] || 0;
  
  return Object.entries(ROLE_HIERARCHY)
    .filter(([role, level]) => level < currentLevel)
    .map(([role]) => ({
      value: role,
      label: getRoleDisplayName(role)
    }));
};