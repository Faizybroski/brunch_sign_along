
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  birthdate: string | null;
  notes: string | null;
  created_at: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone?: string;
  birthdate?: string;
  notes?: string;
}

export const useCustomerManagement = () => {
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load customers');
        throw error;
      }

      return data as Customer[];
    }
  });

  const addCustomer = useMutation({
    mutationFn: async (customerData: CustomerFormData) => {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add customer');
      console.error('Error adding customer:', error);
    }
  });

  const updateCustomer = useMutation({
    mutationFn: async ({ id, ...customerData }: CustomerFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update customer');
      console.error('Error updating customer:', error);
    }
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete customer');
      console.error('Error deleting customer:', error);
    }
  });

  return {
    customers,
    isLoading,
    addCustomer,
    updateCustomer,
    deleteCustomer
  };
};
