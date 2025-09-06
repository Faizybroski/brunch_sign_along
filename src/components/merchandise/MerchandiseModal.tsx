
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEventsData } from '@/hooks/useEventsData';
import { useMerchandiseContext } from '@/hooks/useMerchandiseContext';
import { MerchandiseItem } from '@/types/merchandise';

interface MerchandiseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MerchandiseItem | null;
}

const MerchandiseModal = ({ open, onOpenChange, item }: MerchandiseModalProps) => {
  const navigate = useNavigate();
  // Fix: Pass null instead of an empty object to useEventsData
  const { events } = useEventsData(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const { closeModal } = useMerchandiseContext();
  
  // Reset form state when item changes or modal closes
  useEffect(() => {
    if (open && item) {
      setQuantity(1);
      setDeliveryMethod('pickup');
      setSelectedEvent('');
    }
  }, [open, item]);
  
  if (!item) return null;
  
  const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
  const formattedPrice = `$${price.toFixed(2)}`;
  const subtotal = price * quantity;

  const handleContinue = () => {
    const params = new URLSearchParams({
      itemId: item.id.toString(),
      name: item.name,
      price: price.toString(),
      quantity: quantity.toString(),
      deliveryMethod,
      image: item.image,
      ...(deliveryMethod === 'pickup' && selectedEvent ? { eventId: selectedEvent } : {})
    });
    
    navigate(`/merchandise-checkout?${params.toString()}`);
    onOpenChange(false);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{item.name}</DialogTitle>
          <DialogDescription className="text-gray-500">{item.description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex justify-center">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full max-w-[200px] h-auto object-contain"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Price:</span>
            <span className="font-semibold text-brunch-purple">{formattedPrice}</span>
          </div>
          
          <div>
            <Label htmlFor="quantity" className="mb-2 block">Quantity</Label>
            <div className="flex items-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="px-3"
              >
                -
              </Button>
              <Input 
                id="quantity"
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
                className="text-center mx-2 w-20"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={increaseQuantity}
                className="px-3"
              >
                +
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="delivery" className="mb-2 block">Delivery Method</Label>
            <RadioGroup 
              id="delivery" 
              value={deliveryMethod} 
              onValueChange={setDeliveryMethod}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup">Pick up at event</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ship" id="ship" />
                <Label htmlFor="ship">Ship to me</Label>
              </div>
            </RadioGroup>
          </div>
          
          {deliveryMethod === 'pickup' && (
            <div>
              <Label htmlFor="event" className="mb-2 block">Select Event for Pickup</Label>
              <Select
                value={selectedEvent}
                onValueChange={setSelectedEvent}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {events && events.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.title} - {new Date(event.date).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="border-t pt-4 mt-2">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Subtotal:</span>
              <span className="text-lg font-bold text-brunch-purple">${subtotal.toFixed(2)}</span>
            </div>
            
            <Button 
              className="w-full bg-brunch-pink hover:bg-brunch-purple text-white"
              onClick={handleContinue}
              disabled={deliveryMethod === 'pickup' && !selectedEvent}
            >
              Continue to Checkout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MerchandiseModal;
