
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TicketTierForm from "./TicketTierForm";

interface TicketTier {
  tier_title: string;
  quantity: number;
  unit_price: number;
  food_service_price: number;
}

interface Event {
  id: number;
  title: string;
  date: string;
}

const TicketCreationDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const [open, setOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<string>("");
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([]);
  const queryClient = useQueryClient();

  // Fetch events
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, date')
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data as Event[];
    }
  });

  // Save ticket tiers mutation
  const saveTicketTiersMutation = useMutation({
    mutationFn: async (tiers: TicketTier[]) => {
      if (!selectedEventId || !selectedTicketType) {
        throw new Error("Please select an event and ticket type");
      }

      const promises = tiers.map(tier => 
        supabase.from('event_tier_inventory').insert({
          event_id: selectedEventId,
          ticket_type: selectedTicketType,
          tier_title: tier.tier_title,
          price: tier.unit_price,
          initial_quantity: tier.quantity,
          available_quantity: tier.quantity,
          is_active: true
        })
      );

      const results = await Promise.all(promises);
      
      for (const result of results) {
        if (result.error) throw result.error;
      }
      
      return results;
    },
    onSuccess: () => {
      toast.success("Ticket tiers created successfully!");
      resetForm();
      setOpen(false);
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['ticket-summaries'] });
    },
    onError: (error) => {
      console.error('Error saving ticket tiers:', error);
      toast.error("Failed to save ticket tiers");
    }
  });

  const addNewTier = () => {
    setTicketTiers([...ticketTiers, {
      tier_title: "",
      quantity: 0,
      unit_price: 0,
      food_service_price: 0
    }]);
  };

  const updateTier = (index: number, field: keyof TicketTier, value: string | number) => {
    const updatedTiers = [...ticketTiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setTicketTiers(updatedTiers);
  };

  const removeTier = (index: number) => {
    setTicketTiers(ticketTiers.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const validTiers = ticketTiers.filter(tier => 
      tier.tier_title.trim() && tier.quantity > 0 && tier.unit_price > 0
    );
    
    if (validTiers.length === 0) {
      toast.error("Please add at least one valid ticket tier");
      return;
    }

    saveTicketTiersMutation.mutate(validTiers);
  };

  const resetForm = () => {
    setSelectedEventId(null);
    setSelectedTicketType("");
    setTicketTiers([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brunch-purple hover:bg-brunch-purple-dark">
          <Plus className="mr-2 h-4 w-4" />
          Create Tickets
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Ticket Tiers</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Event and Ticket Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event</Label>
              <Select value={selectedEventId?.toString() || ""} onValueChange={(value) => setSelectedEventId(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.title} ({event.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ticket Type</Label>
              <Select value={selectedTicketType} onValueChange={setSelectedTicketType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ticket type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Admission</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ticket Tiers Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ticket Tiers</h3>
              <Button 
                onClick={addNewTier}
                disabled={!selectedEventId || !selectedTicketType}
                variant="outline"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Tier
              </Button>
            </div>

            {ticketTiers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Select an event and ticket type, then add ticket tiers
              </div>
            ) : (
              <TicketTierForm
                tiers={ticketTiers}
                onUpdateTier={updateTier}
                onRemoveTier={removeTier}
              />
            )}
          </div>

          {/* Save Button */}
          {ticketTiers.length > 0 && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saveTicketTiersMutation.isPending}
                className="bg-brunch-purple hover:bg-brunch-purple-dark"
              >
                Save All Tiers ({ticketTiers.length})
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketCreationDialog;
