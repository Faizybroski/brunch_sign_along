
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils } from 'lucide-react';

interface MenuItem {
  name: string;
  image: string;
}

const menuItems: MenuItem[] = [
  { name: "Sushi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400" },
  { name: "Beef Tartare", image: "/lovable-uploads/73e90765-f1ab-46a2-8f06-fb9e5973b545.png" },
  { name: "Shrimp Cocktail", image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=400" },
  { name: "Chicken Skewers", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=400" },
  { name: "Flatbread Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400" },
  { name: "Vegetarian Spring Rolls", image: "/lovable-uploads/1e49f761-b79e-4090-bfd8-2bf42512b1cd.png" },
  { name: "Samosas", image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?q=80&w=400" },
  { name: "Mixed Sandwiches", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=400" },
  { name: "Sausage Puff Pastry", image: "/lovable-uploads/920338d1-968c-4a85-917f-a6ee42f59b6a.png" }
];

const FoodServiceMenu = () => {
  return (
    <div className="mt-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="h-5 w-5 text-brunch-orange flex-shrink-0" />
        <h3 className="text-lg font-semibold">Menu Items - Served Buffet Style</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {menuItems.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                width="200"
                height="150"
              />
            </div>
            <CardContent className="p-2 sm:p-3">
              <p className="text-sm font-medium text-center">{item.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FoodServiceMenu;
