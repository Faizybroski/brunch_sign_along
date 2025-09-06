import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useOrdersData, Order } from "@/hooks/useOrdersData";
import OrdersSearch from "@/components/admin/orders/OrdersSearch";
import OrdersTabs from "@/components/admin/orders/OrdersTabs";
import OrderDetailsDialog from "@/components/admin/orders/OrderDetailsDialog";

const AdminOrders = () => {
  const { orders, isLoading, error, refetch } = useOrdersData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const handleViewOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleExportOrders = () => {
    // In a real implementation, this would generate a CSV export
    toast.success("Orders exported successfully");
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesOrderInfo =
      order.id.toLowerCase().includes(searchLower) ||
      order.customer.name.toLowerCase().includes(searchLower) ||
      order.customer.email.toLowerCase().includes(searchLower);

    const matchesEventTitle = order.items.some((item) =>
      item.event_title?.toLowerCase().includes(searchLower)
    );

    return matchesOrderInfo || matchesEventTitle;
  });

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Order Management
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage customer orders
            </p>
          </div>
        </div>
        <div className="text-center py-20">
          <p className="text-red-600">Error loading orders: {error}</p>
          <Button onClick={refetch} className="mt-4">
            Try Again
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
        <Button
          variant="outline"
          className="flex items-center"
          onClick={handleExportOrders}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </div>

      <OrdersSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <OrdersTabs
        orders={filteredOrders}
        isLoading={isLoading}
        onViewOrder={handleViewOrder}
      />

      <OrderDetailsDialog
        order={currentOrder}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      />
    </AdminLayout>
  );
};

export default AdminOrders;
