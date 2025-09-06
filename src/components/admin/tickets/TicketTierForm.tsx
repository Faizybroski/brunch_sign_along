
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface TicketTier {
  tier_title: string;
  quantity: number;
  unit_price: number;
  food_service_price: number;
}

interface TicketTierFormProps {
  tiers: TicketTier[];
  onUpdateTier: (index: number, field: keyof TicketTier, value: string | number) => void;
  onRemoveTier: (index: number) => void;
}

const TicketTierForm = ({ tiers, onUpdateTier, onRemoveTier }: TicketTierFormProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tier Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price ($)</TableHead>
            <TableHead>Food Service Price ($)</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiers.map((tier, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  value={tier.tier_title}
                  onChange={(e) => onUpdateTier(index, 'tier_title', e.target.value)}
                  placeholder="e.g., Early Bird"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={tier.quantity}
                  onChange={(e) => onUpdateTier(index, 'quantity', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  step="0.01"
                  value={tier.unit_price}
                  onChange={(e) => onUpdateTier(index, 'unit_price', parseFloat(e.target.value) || 0)}
                  min="0"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  step="0.01"
                  value={tier.food_service_price}
                  onChange={(e) => onUpdateTier(index, 'food_service_price', parseFloat(e.target.value) || 0)}
                  min="0"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveTier(index)}
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
  );
};

export default TicketTierForm;
