import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface TicketTypeCardProps {
  icon: LucideIcon;
  title: string;
  price: string;
  features: string[];
  onClick: () => void;
  isPrimary?: boolean;
  isPopular?: boolean;
  type?: string;
  soldOut?: boolean;
}

const TicketTypeCard = ({
  icon: IconComponent,
  title,
  price,
  features,
  onClick,
  isPrimary = false,
  isPopular = false,
  soldOut = false,
}: TicketTypeCardProps) => {
  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2 duration-300 
      ${
        isPrimary ? "shadow-xl border-2 border-brunch-purple relative pt-6" : ""
      }
      ${soldOut ? "opacity-50 grayscale" : ""}`}
    >
      {isPopular && (
        <div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-gradient-to-r from-brunch-purple to-brunch-pink 
          text-white px-6 py-2 rounded-full text-sm font-bold 
          shadow-lg z-10 
          transition-all duration-300 
          group-hover:scale-105 
          group-hover:shadow-xl
          flex items-center gap-2 
          min-w-[150px] 
          text-center 
          whitespace-nowrap 
          overflow-hidden
        "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 7v5l4.5 2.5" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          Most Popular
        </div>
      )}
      <div className="p-6 flex flex-col h-full">
        <div className="mb-6 flex-grow">
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <IconComponent className="h-5 w-5" /> {title}
          </h3>
          <div className="text-2xl font-bold text-brunch-purple mb-4">
            <span className="text-sm text-gray-600 mr-2">Starting at</span>
            {price}
          </div>

          {/* Only show features for available tickets */}
          {!soldOut && (
            <ul className="space-y-2 text-sm mb-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-4 w-4 text-brunch-purple flex items-center justify-center">
                    ✓
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button
          onClick={onClick}
          className="w-full bg-brunch-purple hover:bg-brunch-pink text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={soldOut || price === "$0"}
        >
          {soldOut
            ? "Sold Out"
            : price === "$0"
            ? "No tires found"
            : `Select ${title}`}
        </Button>
      </div>
    </div>
  );
};

export default TicketTypeCard;
