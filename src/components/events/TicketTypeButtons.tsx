
import React from 'react';
import { Button } from '@/components/ui/button';
import { Ticket, Crown, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface TicketTypeButtonsProps {
  ticketType: string | null;
  selectedEventDate: string | null;
}

const TicketTypeButtons = ({ ticketType, selectedEventDate }: TicketTypeButtonsProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const getButtonClasses = (type: string) => {
    const isSelected = ticketType === type || (!ticketType && type === 'ga');
    return `flex items-center gap-1 md:gap-2 text-xs md:text-sm ${
      isSelected 
        ? 'bg-brunch-purple hover:bg-brunch-pink text-white' 
        : 'border-2 border-brunch-purple text-brunch-purple hover:bg-brunch-pink hover:text-white hover:border-brunch-pink'
    }`;
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
      <Button 
        variant={ticketType === 'ga' || !ticketType ? 'default' : 'outline'}
        onClick={() => {
          if (selectedEventDate) {
            navigate(`/events?type=ga&date=${selectedEventDate}`);
          } else {
            navigate('/events?type=ga');
          }
        }}
        className={getButtonClasses('ga')}
        size={isMobile ? "sm" : "default"}
      >
        <Ticket className="h-3 w-3 md:h-4 md:w-4" />
        General Admission
      </Button>
      <Button 
        variant={ticketType === 'vip' ? 'default' : 'outline'}
        onClick={() => {
          if (selectedEventDate) {
            navigate(`/events?type=vip&date=${selectedEventDate}`);
          } else {
            navigate('/events?type=vip');
          }
        }}
        className={getButtonClasses('vip')}
        size={isMobile ? "sm" : "default"}
      >
        <Crown className="h-3 w-3 md:h-4 md:w-4" />
        VIP Experience
      </Button>
      <Button 
        variant={ticketType === 'group' ? 'default' : 'outline'}
        onClick={() => {
          if (selectedEventDate) {
            navigate(`/events?type=group&date=${selectedEventDate}`);
          } else {
            navigate('/events?type=group');
          }
        }}
        className={getButtonClasses('group')}
        size={isMobile ? "sm" : "default"}
      >
        <Users className="h-3 w-3 md:h-4 md:w-4" />
        Group Packages
      </Button>
    </div>
  );
};

export default TicketTypeButtons;

