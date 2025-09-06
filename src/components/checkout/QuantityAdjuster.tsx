
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface QuantityAdjusterProps {
  quantity: number;
  onChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
}

const QuantityAdjuster = ({ quantity, onChange, min = 1, max = 10 }: QuantityAdjusterProps) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={quantity <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-12 text-center font-medium">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={quantity >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuantityAdjuster;
