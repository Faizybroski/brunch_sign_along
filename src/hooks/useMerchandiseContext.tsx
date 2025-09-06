
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MerchandiseItem } from '@/types/merchandise';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface MerchandiseContextType {
  selectedItem: MerchandiseItem | null;
  isModalOpen: boolean;
  openModal: (item: MerchandiseItem) => void;
  closeModal: () => void;
  merchandiseItems: MerchandiseItem[];
  isLoading: boolean;
  reloadItems: () => void;
}

const MerchandiseContext = createContext<MerchandiseContextType | undefined>(undefined);

export const MerchandiseProvider = ({ children }: { children: ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState<MerchandiseItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [merchandiseItems, setMerchandiseItems] = useState<MerchandiseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMerchandiseItems = async () => {
    setIsLoading(true);
    try {
      // Fetch from actual Supabase table
      const { data, error } = await supabase
        .from('merchandise')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) {
        throw error;
      }
      
      // Transform the data to match the expected interface
      const transformedItems: MerchandiseItem[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        image: item.image_url || '/placeholder.svg',
        price: `$${item.price.toFixed(2)}`,
        description: item.description || '',
        inventory: item.inventory,
        active: item.active
      }));
      
      setMerchandiseItems(transformedItems);
    } catch (error) {
      console.error('Error fetching merchandise items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load merchandise items',
        variant: 'destructive',
      });
      
      // Fallback to mock data if database fetch fails
      const mockItems: MerchandiseItem[] = [
        {
          id: 1,
          name: 'Heart Of The Ocean Necklace',
          image: '/lovable-uploads/c87609a8-1047-4f60-b03a-bb078be8184f.png',
          price: '$20.00',
          description: 'Take home this iconic necklace today'
        },
        {
          id: 2,
          name: 'My Mimosa Will Go On Clack-Fan',
          image: '/lovable-uploads/2d64491f-97e8-479b-9a6b-ca2212a209a0.png',
          price: '$20.00',
          description: 'Stay cool with our signature pink fan'
        },
        {
          id: 3,
          name: 'Power Of Brunch Clack-Fan',
          image: '/lovable-uploads/4ac90e06-2b23-4657-b155-0f30c44a438f.png',
          price: '$20.00',
          description: 'Express your brunch power with our purple fan'
        }
      ];
      setMerchandiseItems(mockItems);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchandiseItems();
  }, []);

  const openModal = (item: MerchandiseItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // We don't immediately clear the selected item to avoid UI flicker during dialog close animation
    setTimeout(() => setSelectedItem(null), 300);
  };

  const reloadItems = () => {
    fetchMerchandiseItems();
  };

  return (
    <MerchandiseContext.Provider
      value={{
        selectedItem,
        isModalOpen,
        openModal,
        closeModal,
        merchandiseItems,
        isLoading,
        reloadItems
      }}
    >
      {children}
    </MerchandiseContext.Provider>
  );
};

export const useMerchandiseContext = () => {
  const context = useContext(MerchandiseContext);
  if (context === undefined) {
    throw new Error('useMerchandiseContext must be used within a MerchandiseProvider');
  }
  return context;
};
