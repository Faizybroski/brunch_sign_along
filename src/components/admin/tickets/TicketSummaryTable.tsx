
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TicketTier {
  tier_title: string;
  initial_quantity: number;
  price: number;
  // Note: food_service_price is not in the database schema, using price instead
}

interface TicketSummary {
  event_id: number;
  event_title: string;
  ticket_type: string;
  tiers: TicketTier[];
}

const TicketSummaryTable = () => {
  const queryClient = useQueryClient();

  // Fetch ticket summaries with detailed tier information
  const { data: summaries = [], isLoading } = useQuery({
    queryKey: ['ticket-summaries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_tier_inventory')
        .select(`
          event_id,
          ticket_type,
          tier_title,
          initial_quantity,
          price,
          events!inner(title)
        `);
      
      if (error) throw error;

      // Group by event and ticket type, collecting all tiers
      const grouped = data.reduce((acc: Record<string, TicketSummary>, item) => {
        const key = `${item.event_id}-${item.ticket_type}`;
        if (!acc[key]) {
          acc[key] = {
            event_id: item.event_id,
            event_title: item.events.title,
            ticket_type: item.ticket_type,
            tiers: []
          };
        }
        acc[key].tiers.push({
          tier_title: item.tier_title,
          initial_quantity: item.initial_quantity,
          price: item.price
        });
        return acc;
      }, {});

      return Object.values(grouped);
    }
  });

  // Delete tickets mutation
  const deleteTicketsMutation = useMutation({
    mutationFn: async ({ eventId, ticketType }: { eventId: number; ticketType: string }) => {
      const { error } = await supabase
        .from('event_tier_inventory')
        .delete()
        .eq('event_id', eventId)
        .eq('ticket_type', ticketType);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Tickets deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['ticket-summaries'] });
    },
    onError: (error) => {
      console.error('Error deleting tickets:', error);
      toast.error("Failed to delete tickets");
    }
  });

  const handleDelete = (eventId: number, ticketType: string) => {
    if (confirm("Are you sure you want to delete all tickets for this event and ticket type?")) {
      deleteTicketsMutation.mutate({ eventId, ticketType });
    }
  };

  const formatTicketType = (type: string) => {
    switch (type) {
      case 'general': return 'General Admission';
      case 'vip': return 'VIP';
      case 'premium': return 'Premium';
      default: return type;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading tickets...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Created Tickets Summary</h3>
      
      {summaries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tickets created yet. Use the "Create Tickets" button above to get started.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Ticket Type</TableHead>
                <TableHead className="min-w-[300px]">Tiers Information</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaries.map((summary) => (
                <TableRow key={`${summary.event_id}-${summary.ticket_type}`}>
                  <TableCell className="font-medium">{summary.event_title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {formatTicketType(summary.ticket_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {summary.tiers.map((tier, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded border text-sm">
                          <div className="font-medium text-gray-900">{tier.tier_title}</div>
                          <div className="text-gray-600 space-y-1">
                            <div>Quantity: <span className="font-medium">{tier.initial_quantity}</span></div>
                            <div>Unit Price: <span className="font-medium">{formatPrice(tier.price)}</span></div>
                            <div>Food Service: <span className="font-medium">$0.00</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(summary.event_id, summary.ticket_type)}
                      disabled={deleteTicketsMutation.isPending}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TicketSummaryTable;
