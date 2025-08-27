
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customersService } from '@/lib/services/customers-service';
import { toast } from 'sonner';

// ✅ Create Customer Hook
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customersService.createCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['customers']);
      queryClient.setQueryData(['customer', data.$id], data);
      
      toast.success(`Customer ${data.name} created successfully!`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create customer');
    }
  });
};

// ✅ Update Customer Hook
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, updateData }) => 
      customersService.updateCustomer(customerId, updateData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['customers']);
      queryClient.setQueryData(['customer', variables.customerId], data);
      
      toast.success('Customer updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update customer');
    }
  });
};