
import { useParams, useNavigate } from 'react-router-dom';
import { useEventData } from './useEventData';
import { useNormalizeEventData } from './useNormalizeEventData';

export const useTicketTypeSelection = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { data: eventData, isLoading, error } = useEventData(eventId);
  const { normalizeEventData } = useNormalizeEventData();
  
  // Normalize the event data to ensure it has the correct structure
  const event = eventData ? normalizeEventData(eventData) : null;
  
  const handleSelectTicketType = (type: string) => {
    navigate(`/pricing/${eventId}?type=${type}`);
  };

  return {
    event,
    isLoading,
    error,
    handleSelectTicketType
  };
};
