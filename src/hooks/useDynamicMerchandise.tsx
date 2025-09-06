
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DynamicMerchandiseItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  inventory: number;
  image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  variants?: MerchandiseVariant[];
}

export interface MerchandiseVariant {
  id: number;
  merchandise_id: number;
  size: string;
  color: string | null;
  inventory: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMerchandiseData {
  name: string;
  description?: string;
  price: number;
  inventory: number;
  image_url?: string;
  active?: boolean;
}

export interface UpdateMerchandiseData extends Partial<CreateMerchandiseData> {
  id: number;
}

export const useDynamicMerchandise = () => {
  const [merchandiseItems, setMerchandiseItems] = useState<DynamicMerchandiseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMerchandise = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch merchandise with variants
      const { data: merchandise, error: merchError } = await supabase
        .from('merchandise')
        .select(`
          *,
          merchandise_variants (*)
        `)
        .order('created_at', { ascending: false });

      if (merchError) throw merchError;

      const formattedItems: DynamicMerchandiseItem[] = (merchandise || []).map(item => ({
        ...item,
        variants: item.merchandise_variants || []
      }));

      setMerchandiseItems(formattedItems);
    } catch (err: any) {
      console.error('Error fetching merchandise:', err);
      setError(err.message || 'Failed to fetch merchandise');
      toast.error('Failed to load merchandise items');
    } finally {
      setIsLoading(false);
    }
  };

  const createMerchandise = async (data: CreateMerchandiseData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('merchandise')
        .insert([data]);

      if (error) throw error;

      toast.success('Merchandise item created successfully');
      await fetchMerchandise(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error('Error creating merchandise:', err);
      toast.error(err.message || 'Failed to create merchandise item');
      return false;
    }
  };

  const updateMerchandise = async (data: UpdateMerchandiseData): Promise<boolean> => {
    try {
      const { id, ...updateData } = data;
      const { error } = await supabase
        .from('merchandise')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast.success('Merchandise item updated successfully');
      await fetchMerchandise(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error('Error updating merchandise:', err);
      toast.error(err.message || 'Failed to update merchandise item');
      return false;
    }
  };

  const deleteMerchandise = async (id: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('merchandise')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Merchandise item deleted successfully');
      await fetchMerchandise(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error('Error deleting merchandise:', err);
      toast.error(err.message || 'Failed to delete merchandise item');
      return false;
    }
  };

  const createVariant = async (merchandiseId: number, variantData: { size: string; color?: string; inventory: number }): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('merchandise_variants')
        .insert([{
          merchandise_id: merchandiseId,
          ...variantData
        }]);

      if (error) throw error;

      toast.success('Variant added successfully');
      await fetchMerchandise(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error('Error creating variant:', err);
      toast.error(err.message || 'Failed to add variant');
      return false;
    }
  };

  useEffect(() => {
    fetchMerchandise();
  }, []);

  return {
    merchandiseItems,
    isLoading,
    error,
    fetchMerchandise,
    createMerchandise,
    updateMerchandise,
    deleteMerchandise,
    createVariant,
    reloadItems: fetchMerchandise // Alias for compatibility
  };
};
