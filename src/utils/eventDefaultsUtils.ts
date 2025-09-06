
import { TransformedEvent } from "@/hooks/types";

/**
 * Default event data used as fallback
 */
export const getFallbackEvents = (): TransformedEvent[] => {
  return [
    {
      id: 1,
      title: "Brunch Singalong Show",
      date: "May 24, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Stock Bar Montreal",
      image: "https://images.unsplash.com/photo-1564759224907-65b945ff0e84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      image_url: "https://images.unsplash.com/photo-1564759224907-65b945ff0e84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      city: "Montreal",
      tiers: {
        ga: [
          {
            title: "First Release",
            price: "34",
            description: "Early Bird General Admission",
            ticketsLeft: 50,
            primary: true,
            soldOut: false,
            disabled: false,
            features: []
          },
          {
            title: "Second Release",
            price: "39",
            description: "Standard General Admission",
            ticketsLeft: 40,
            primary: false,
            soldOut: false,
            disabled: false,
            features: []
          },
          {
            title: "Final Release",
            price: "45",
            description: "Last Chance General Admission",
            ticketsLeft: 30,
            primary: false,
            soldOut: false,
            disabled: false,
            features: []
          }
        ],
        vip: [
          {
            title: "VIP Tier 1",
            price: "49",
            description: "Standard VIP Experience",
            ticketsLeft: 25,
            primary: true,
            soldOut: false,
            disabled: false,
            features: []
          },
          {
            title: "VIP Premium",
            price: "69",
            description: "Enhanced VIP Experience",
            ticketsLeft: 15,
            primary: false,
            soldOut: false,
            disabled: false,
            features: []
          },
          {
            title: "VIP Ultimate",
            price: "89",
            description: "Ultimate VIP Experience",
            ticketsLeft: 10,
            primary: false,
            soldOut: false,
            disabled: false,
            features: []
          }
        ],
        group: [
          {
            title: "Group of 8",
            price: "499",
            description: "Perfect for small groups",
            ticketsLeft: 5,
            primary: true,
            soldOut: false,
            disabled: false,
            features: []
          },
          {
            title: "Group of 10",
            price: "599",
            description: "Our most popular group package",
            ticketsLeft: 3,
            primary: false,
            soldOut: false,
            disabled: false,
            features: []
          },
          {
            title: "Group of 12",
            price: "699",
            description: "Ultimate group package",
            ticketsLeft: 2,
            primary: false,
            soldOut: false,
            disabled: false,
            features: []
          }
        ]
      },
      foodService: {
        price: 25,
        description: "Brunch Food Service (12:30 PM - 2:00 PM)",
      }
    }
  ];
};

/**
 * Gets the default food service information
 */
export const getDefaultFoodService = () => {
  return {
    price: 25,
    description: "Brunch Food Service (12:30 PM - 2:00 PM)",
  };
};
