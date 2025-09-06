
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TicketCreationDialog from "@/components/admin/tickets/TicketCreationDialog";
import TicketSummaryTable from "@/components/admin/tickets/TicketSummaryTable";

const AdminTickets = () => {
  const handleTicketCreationSuccess = () => {
    // This will trigger a refresh of the summary table
    console.log("Tickets created successfully");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Ticket Management</h1>
            <p className="text-gray-600 mt-1">Create and manage ticket tiers for events</p>
          </div>
          <TicketCreationDialog onSuccess={handleTicketCreationSuccess} />
        </div>

        {/* Ticket Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <TicketSummaryTable />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTickets;
