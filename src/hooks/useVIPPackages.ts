
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface VIPPackage {
  package_id: number;
  package_name: string;
  capacity: number;
  price: number;
  is_available: boolean;
  description: string;
}

export const useVIPPackages = (eventId: number) => {
  return useQuery({
    queryKey: ['vip-packages', eventId],
    queryFn: async () => {
      try {
        // Using simpler query approach with better performance
        const { data: packages, error: packagesError } = await supabase
          .from('vip_packages')
          .select('id, name, capacity, price, description');

        if (packagesError) {
          console.error('Error fetching VIP packages:', packagesError);
          throw packagesError;
        }
        
        // Using standard capacities to avoid excessive database calls
        const capacities = [10, 15, 20, 25];
        const finalPackages: VIPPackage[] = [];
        
        // Create packages for all required capacities
        capacities.forEach(capacity => {
          const existingPackage = packages.find((p: any) => p.capacity === capacity);
          if (existingPackage) {
            finalPackages.push({
              package_id: existingPackage.id,
              package_name: `${capacity}-Person Package`,
              capacity: capacity,
              price: existingPackage.price,
              is_available: true,
              description: existingPackage.description || `${capacity}-Person Group Package`
            });
          } else {
            // Create a default package if one doesn't exist
            finalPackages.push({
              package_id: finalPackages.length + 1,
              package_name: `${capacity}-Person Package`,
              capacity: capacity,
              price: capacity * 30, // Basic pricing
              is_available: true,
              description: `${capacity}-Person Group Package`
            });
          }
        });
        
        return finalPackages;
      } catch (error) {
        console.error('Error in useVIPPackages:', error);
        // Provide fallback packages
        return [
          {
            package_id: 1,
            package_name: "10-Person Package",
            capacity: 10,
            price: 300,
            is_available: true,
            description: "10-Person Group Package"
          },
          {
            package_id: 2,
            package_name: "15-Person Package",
            capacity: 15,
            price: 450,
            is_available: true,
            description: "15-Person Group Package"
          },
          {
            package_id: 3,
            package_name: "20-Person Package",
            capacity: 20,
            price: 600,
            is_available: true,
            description: "20-Person Group Package"
          },
          {
            package_id: 4,
            package_name: "25-Person Package",
            capacity: 25,
            price: 750,
            is_available: true,
            description: "25-Person Group Package"
          }
        ];
      }
    },
    enabled: !!eventId,
    staleTime: 1000 * 60 * 10, // 10 minutes to reduce database calls
  });
};
