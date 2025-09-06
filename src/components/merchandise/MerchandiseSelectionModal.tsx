import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MerchandiseItem } from '@/types/merchandise';
import { useMerchandiseContext } from '@/hooks/useMerchandiseContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface MerchandiseSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: MerchandiseItem[];
  currentItems?: MerchandiseItem[];
  onAddItem?: (item: MerchandiseItem) => void;
}

const MerchandiseSelectionModal: React.FC<MerchandiseSelectionModalProps> = ({
  open,
  onOpenChange,
  items,
  currentItems = [],
  onAddItem,
}) => {
  const { openModal } = useMerchandiseContext();
  const navigate = useNavigate();
  
  const handleSelectItem = (item: MerchandiseItem) => {
    // If we have an onAddItem callback, use that
    if (onAddItem) {
      onAddItem(item);
      onOpenChange(false);
      toast.success(`${item.name} added to your order!`);
    } else {
      // Otherwise use the original behavior - close this modal and open the item details modal
      onOpenChange(false);
      // Short timeout to avoid modal transition conflicts
      setTimeout(() => {
        openModal(item);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Select Merchandise</DialogTitle>
          <DialogDescription>
            Choose an item to add to your order.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg p-4 border hover:border-brunch-purple hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleSelectItem(item)}
            >
              <div className="flex flex-col items-center">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-32 h-32 object-contain mb-3" 
                />
                <h3 className="font-medium text-center">{item.name}</h3>
                <p className="text-brunch-purple font-bold">{item.price}</p>
                <Button 
                  variant="outline" 
                  className="mt-2 w-full hover:bg-brunch-pink hover:text-white border-brunch-purple"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectItem(item);
                  }}
                >
                  Select
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MerchandiseSelectionModal;
