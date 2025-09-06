
import { useState } from 'react';
import { useCustomerManagement } from '@/hooks/useCustomerManagement';
import { CustomerForm } from '@/components/admin/CustomerForm';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CustomersPage = () => {
  const { customers, isLoading, addCustomer, updateCustomer, deleteCustomer } = useCustomerManagement();
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleAddCustomer = (data: any) => {
    // Ensure required fields are present
    const customerData = {
      name: data.name || '',
      email: data.email || '',
      phone: data.phone,
      birthdate: data.birthdate,
      notes: data.notes,
    };
    addCustomer.mutate(customerData);
  };

  const handleUpdateCustomer = (data: any) => {
    // Ensure required fields are present
    const customerData = {
      id: editingCustomer.id,
      name: data.name || editingCustomer.name,
      email: data.email || editingCustomer.email,
      phone: data.phone,
      birthdate: data.birthdate,
      notes: data.notes,
    };
    updateCustomer.mutate(customerData);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Customer</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm onSubmit={handleAddCustomer} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Birth Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone || '-'}</TableCell>
                <TableCell>{customer.birthdate || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingCustomer(customer)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Customer</DialogTitle>
                        </DialogHeader>
                        <CustomerForm
                          onSubmit={handleUpdateCustomer}
                          initialData={customer}
                          isEditing
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this customer?')) {
                          deleteCustomer.mutate(customer.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomersPage;
