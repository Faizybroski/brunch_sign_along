
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock4, ChevronDown } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
import { CheckoutFormValues } from "@/hooks/useCheckoutForm";
import FoodServiceMenu from './FoodServiceMenu';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { foodServiceConfig } from "@/config/foodService";

interface FoodServiceSelectionProps {
  form: UseFormReturn<CheckoutFormValues> | null;
  foodServiceDescription: string;
  foodServicePrice: number;
  quantity: number;
  includeFoodService: boolean;
  onToggleFoodService: (include: boolean) => void;
}

const FoodServiceSelection = ({
  form,
  foodServiceDescription,
  foodServicePrice,
  quantity,
  includeFoodService,
  onToggleFoodService
}: FoodServiceSelectionProps) => {
  const [showFullMenu, setShowFullMenu] = useState(false);
  const isMobile = useIsMobile();

  const renderStandaloneCheckbox = () => (
    <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 sm:p-4 bg-muted/50">
      <Checkbox
        checked={includeFoodService}
        onCheckedChange={(checked) => onToggleFoodService(!!checked)}
        className="mt-0.5"
      />
      <div className="space-y-1 leading-none">
        <div className="font-medium text-sm sm:text-base">
          Add Food Service to Your Experience
        </div>
        <div className="flex flex-col text-xs sm:text-sm text-muted-foreground gap-1">
          <div className="flex items-center">
            <Clock4 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
            <span>{foodServiceConfig.serviceTime}</span>
          </div>
          <div className="flex flex-col">
            <span>{foodServiceDescription} - ${foodServicePrice} per person</span>
            <span>x {quantity} {quantity === 1 ? 'ticket' : 'tickets'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFormField = () => {
    if (!form) return renderStandaloneCheckbox();
    
    return (
      <FormField
        control={form.control}
        name="includeFoodService"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/50">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  onToggleFoodService(!!checked);
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Add Food Service to Your Experience
              </FormLabel>
              <div className="flex flex-col text-sm text-muted-foreground gap-1">
                <div className="flex items-center">
                  <Clock4 className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{foodServiceConfig.serviceTime}</span>
                </div>
                <div className="flex flex-col">
                  <span>{foodServiceDescription} - ${foodServicePrice} per person</span>
                  <span>x {quantity} {quantity === 1 ? 'ticket' : 'tickets'}</span>
                </div>
              </div>
            </div>
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Clock4 className="h-5 w-5 text-brunch-orange flex-shrink-0" />
          <h3 className="text-lg font-semibold">Gourmet Food Service</h3>
        </div>
        <Button
          variant="ghost"
          onClick={() => setShowFullMenu(!showFullMenu)}
          className="text-xs sm:text-sm"
          size={isMobile ? "sm" : "default"}
        >
          {showFullMenu ? 'Hide menu' : 'View full menu'}
          <ChevronDown className={cn(
            "ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200",
            showFullMenu && "transform rotate-180"
          )} />
        </Button>
      </div>

      <div className={cn(
        "transition-all duration-300",
        showFullMenu ? "opacity-100 max-h-[2000px]" : "opacity-0 max-h-0 overflow-hidden"
      )}>
        <FoodServiceMenu />
      </div>

      {renderFormField()}
    </div>
  );
};

export default FoodServiceSelection;
