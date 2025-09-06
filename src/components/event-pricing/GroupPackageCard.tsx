
import React from 'react';
import { Users, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VIPPackage } from '@/hooks/useVIPPackages';

interface GroupPackageCardProps {
  pkg: VIPPackage;
  quantity: number;
  onQuantityChange: (increment: boolean) => void;
  onBookNow: () => void;
}

const GroupPackageCard = ({ pkg, quantity, onQuantityChange, onBookNow }: GroupPackageCardProps) => {
  return (
    <Card className="border-2 hover:border-brunch-purple transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Users className="h-5 w-5" />
          {pkg.package_name}
        </CardTitle>
        <CardDescription>{pkg.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-brunch-purple">${pkg.price}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {pkg.is_available ? `Capacity: ${pkg.capacity} people` : "Not Available"}
            </div>
          </div>
          {pkg.is_available && (
            <div className="flex items-center border rounded-md">
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-r-none"
                onClick={() => onQuantityChange(false)}
                disabled={!quantity}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-3 text-sm font-medium">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-l-none"
                onClick={() => onQuantityChange(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <Button 
          className="w-full bg-brunch-purple hover:bg-brunch-purple-dark mb-6"
          onClick={onBookNow}
          disabled={!pkg.is_available}
        >
          {pkg.is_available ? 'Book Package' : 'Not Available'}
        </Button>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <div className="h-4 w-4 text-brunch-purple flex items-center justify-center">✓</div>
            Reserved VIP Booth Seating
          </li>
          <li className="flex items-center gap-2">
            <div className="h-4 w-4 text-brunch-purple flex items-center justify-center">✓</div>
            Show Admission for {pkg.capacity} people
          </li>
          <li className="flex items-center gap-2">
            <div className="h-4 w-4 text-brunch-purple flex items-center justify-center">✓</div>
            Complimentary Welcome Mimosas
          </li>
          <li className="flex items-center gap-2">
            <div className="h-4 w-4 text-brunch-purple flex items-center justify-center">✓</div>
            Premium Location
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default GroupPackageCard;
