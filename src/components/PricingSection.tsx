import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Utensils, Ticket, Users, Mic, PartyPopper, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { foodServiceConfig } from '@/config/foodService';

const PricingSection = () => {
  const navigate = useNavigate();
  const [showFoodMenu, setShowFoodMenu] = useState(false);

  return (
    <section className="py-12 bg-white" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ticket <span className="font-dancing text-brunch-pink">Options</span></h2>
          <div className="w-20 h-1 bg-brunch-purple mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your perfect brunch experience!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="border-2 hover:border-brunch-purple transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                General Admission
              </CardTitle>
              <CardDescription>Perfect for the casual bruncher</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-600">Starting at</span>
                  <span className="text-4xl font-bold text-brunch-purple">$34</span>
                </div>
              </div>
              <Button 
                className="w-full bg-brunch-purple hover:bg-brunch-pink mb-6"
                onClick={() => navigate('/events?type=ga')}
              >
                View Events
              </Button>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  Show Admission
                </li>
                <li className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Inflatable Microphone
                </li>
                <li className="flex items-center gap-2">
                  🥂 Complimentary Mimosa
                </li>
                <li className="flex items-center gap-2">
                  💃 Dance Floor Access
                </li>
                <li className="flex items-center gap-2">
                  💺 Limited Seating - First Come, First Served
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-brunch-purple shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brunch-pink text-white px-4 py-1 rounded-full text-sm">
              MOST POPULAR
            </div>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                VIP Experience
              </CardTitle>
              <CardDescription>Enhanced brunch experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-600">Starting at</span>
                  <span className="text-4xl font-bold text-brunch-purple">$49</span>
                </div>
              </div>
              <Button 
                className="w-full bg-brunch-purple hover:bg-brunch-purple mb-6"
                onClick={() => navigate('/events?type=vip')}
              >
                View Events
              </Button>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  Show Admission
                </li>
                <li className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Inflatable Microphone
                </li>
                <li className="flex items-center gap-2">
                  🥂 Complimentary Mimosa
                </li>
                <li className="flex items-center gap-2">
                  💃 Dance Floor Access
                </li>
                <li className="flex items-center gap-2">
                  ✨ Reserved VIP Seating
                </li>
                <li className="flex items-center gap-2">
                  <PartyPopper className="h-4 w-4" />
                  Confetti Popper
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-brunch-purple transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="h-5 w-5" />
                Group VIP
              </CardTitle>
              <CardDescription>Perfect for large groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-600">Starting at</span>
                  <span className="text-4xl font-bold text-brunch-purple">$499</span>
                </div>
              </div>
              <Button 
                className="w-full bg-brunch-purple hover:bg-brunch-pink mb-6"
                onClick={() => navigate('/events?type=group')}
              >
                View Events
              </Button>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  10-25 VIP Admissions
                </li>
                <li className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  10-25 Inflatable Microphones
                </li>
                <li className="flex items-center gap-2">
                  🥂 10-25 Complimentary Mimosas
                </li>
                <li className="flex items-center gap-2">
                  💃 Dance Floor Access
                </li>
                <li className="flex items-center gap-2 font-medium">
                  ✨ Reserved VIP Booth Seating
                </li>
                <li className="flex items-center gap-2">
                  <PartyPopper className="h-4 w-4" />
                  10-25 Confetti Poppers
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

{/*         <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Optional Add-on<br />
              <span className="font-dancing text-brunch-pink">Food Service</span>
            </h2>
            <div className="w-20 h-1 bg-brunch-purple mx-auto mb-8"></div>
          </div>

          <Card className="border-2 hover:border-brunch-purple transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-brunch-orange flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">${foodServiceConfig.price} per person</h3>
                    <p className="text-gray-600">{foodServiceConfig.serviceTime}<br />Buffet catered by Saloon</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowFoodMenu(!showFoodMenu)}
                  className="text-sm hover:text-brunch-purple hover:bg-brunch-purple-light ml-3"
                >
                  View menu samples
                  <ChevronDown className={cn(
                    "ml-2 h-4 w-4 transition-transform duration-200",
                    showFoodMenu && "transform rotate-180"
                  )} />
                </Button>
              </div>

              <div className={cn(
                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 transition-all duration-300",
                showFoodMenu ? "opacity-100 max-h-[2000px]" : "opacity-0 max-h-0 overflow-hidden"
              )}>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000"
                    alt="Sushi platter"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                    <span className="text-white text-sm">Sushi</span>
                  </div>
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src="/lovable-uploads/73e90765-f1ab-46a2-8f06-fb9e5973b545.png"
                    alt="Beef Tartare"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                    <span className="text-white text-sm">Beef Tartare</span>
                  </div>
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=1000"
                    alt="Shrimp Cocktail"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                    <span className="text-white text-sm">Shrimp Cocktail</span>
                  </div>
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=1000"
                    alt="Chicken Skewers"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                    <span className="text-white text-sm">Chicken Skewers</span>
                  </div>
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000"
                    alt="Flatbread Pizza"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                    <span className="text-white text-sm">Flatbread Pizza</span>
                  </div>
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src="/lovable-uploads/1e49f761-b79e-4090-bfd8-2bf42512b1cd.png"
                    alt="Vegetarian Spring Rolls"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                    <span className="text-white text-sm">Spring Rolls</span>
                  </div>
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?q=80&w=1000"
                    alt="Samosas"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                    <span className="text-white text-sm">Samosas</span>
                  </div>
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1000"
                    alt="Mixed Sandwiches"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                    <span className="text-white text-sm break-words">Mixed Sandwiches</span>
                  </div>
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src="/lovable-uploads/920338d1-968c-4a85-917f-a6ee42f59b6a.png"
                    alt="Sausage Puff Pastry"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                    <span className="text-white text-sm">Sausage Puff Pastry</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </section>
  );
};

export default PricingSection;
