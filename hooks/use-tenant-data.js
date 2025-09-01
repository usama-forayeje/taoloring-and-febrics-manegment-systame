import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useTenantData() {
  const { currentShopId } = useTenant();
  const queryClient = useQueryClient();

  // Helper function to filter data by shop
  const filterByShop = useCallback((data, shopIdField = 'shopId') => {
    if (!currentShopId || !data) return data;
    return data.filter(item => item[shopIdField] === currentShopId);
  }, [currentShopId]);

  // Orders for current shop
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', currentShopId],
    queryFn: async () => {
      // Replace with your actual API call
      const response = await fetch(`/api/orders?shopId=${currentShopId}`);
      return response.json();
    },
    enabled: !!currentShopId,
  });

  // Customers for current shop
  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['customers', currentShopId],
    queryFn: async () => {
      const response = await fetch(`/api/customers?shopId=${currentShopId}`);
      return response.json();
    },
    enabled: !!currentShopId,
  });

  // Fabrics for current shop
  const { data: fabrics, isLoading: fabricsLoading } = useQuery({
    queryKey: ['fabrics', currentShopId],
    queryFn: async () => {
      const response = await fetch(`/api/fabrics?shopId=${currentShopId}`);
      return response.json();
    },
    enabled: !!currentShopId,
  });

  // Users for current shop
  const { data: shopUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['shop-users', currentShopId],
    queryFn: async () => {
      const response = await fetch(`/api/users?shopId=${currentShopId}`);
      return response.json();
    },
    enabled: !!currentShopId,
  });

  // Transactions for current shop
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', currentShopId],
    queryFn: async () => {
      const response = await fetch(`/api/transactions?shopId=${currentShopId}`);
      return response.json();
    },
    enabled: !!currentShopId,
  });

  // Function to invalidate all tenant data when switching
  const invalidateAllTenantData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['customers'] });
    queryClient.invalidateQueries({ queryKey: ['fabrics'] });
    queryClient.invalidateQueries({ queryKey: ['shop-users'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  }, [queryClient]);

  return {
    currentShopId,
    orders,
    customers,
    fabrics,
    shopUsers,
    transactions,
    loading: ordersLoading || customersLoading || fabricsLoading || usersLoading || transactionsLoading,
    filterByShop,
    invalidateAllTenantData,
  };
}