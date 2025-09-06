
import { useSearchParams } from 'react-router-dom';
import { foodServiceConfig } from '@/config/foodService';

export const useCheckoutParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const tierTitle = searchParams.get('tier') || '';
  const quantity = parseInt(searchParams.get('quantity') || '1');
  const ticketType = searchParams.get('type') || 'ga';
  const includeFoodService = searchParams.get('includeFoodService') === 'true';
  const foodServicePrice = parseInt(searchParams.get('foodServicePrice') || foodServiceConfig.price.toString());

  const handleQuantityChange = (newQuantity: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('quantity', newQuantity.toString());
    setSearchParams(newParams);
  };

  const handleToggleFoodService = (include: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (include) {
      newParams.set('includeFoodService', 'true');
      newParams.set('foodServicePrice', foodServiceConfig.price.toString());
    } else {
      newParams.delete('includeFoodService');
      newParams.delete('foodServicePrice');
    }
    setSearchParams(newParams);
  };

  return {
    tierTitle,
    quantity,
    ticketType,
    includeFoodService,
    foodServicePrice,
    handleQuantityChange,
    handleToggleFoodService
  };
};
