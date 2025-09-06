
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Loader2, RefreshCw, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
  status: string;
}

const AdminNewsletterSubmissions = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<NewsletterSubscriber | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  
  const paginatedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchNewsletterSubscribers();
  }, []);

  useEffect(() => {
    // Filter subscribers based on search query
    if (searchQuery.trim() === '') {
      setFilteredSubscribers(subscribers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = subscribers.filter((subscriber) => 
        subscriber.email.toLowerCase().includes(query)
      );
      setFilteredSubscribers(filtered);
    }
    
    // Reset to first page when filtering
    setCurrentPage(1);
  }, [searchQuery, subscribers]);

  const fetchNewsletterSubscribers = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setSubscribers(data || []);
      setFilteredSubscribers(data || []);
    } catch (error: any) {
      console.error('Error fetching newsletter subscribers:', error);
      toast.error('Failed to load newsletter subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      // Format data for CSV
      const csvContent = [
        ['Email', 'Status', 'Date Subscribed'],
        ...subscribers.map(subscriber => [
          subscriber.email,
          subscriber.status,
          new Date(subscriber.created_at).toLocaleDateString()
        ])
      ]
      .map(row => row.join(','))
      .join('\n');
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV file exported successfully');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteClick = (subscriber: NewsletterSubscriber) => {
    setSubscriberToDelete(subscriber);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subscriberToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', subscriberToDelete.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state by removing the deleted subscriber
      const updatedSubscribers = subscribers.filter(sub => sub.id !== subscriberToDelete.id);
      setSubscribers(updatedSubscribers);
      setFilteredSubscribers(prev => prev.filter(sub => sub.id !== subscriberToDelete.id));
      
      toast.success(`Subscriber ${subscriberToDelete.email} has been removed`);
    } catch (error: any) {
      console.error('Error deleting subscriber:', error);
      toast.error('Failed to delete subscriber');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSubscriberToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSubscriberToDelete(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={fetchNewsletterSubscribers}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={exportToCSV} 
              disabled={isLoading || isExporting || subscribers.length === 0}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export to CSV
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Subscriber List</CardTitle>
            <CardDescription>
              Manage all newsletter subscribers in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-brunch-purple" />
              </div>
            ) : filteredSubscribers.length > 0 ? (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Subscribed</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSubscribers.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell className="font-medium">{subscriber.email}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              subscriber.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {subscriber.status}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteClick(subscriber)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) setCurrentPage(currentPage - 1);
                            }} 
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          // Show 5 page numbers: current page in middle when possible
                          let pageNum;
                          if (totalPages <= 5) {
                            // If 5 or fewer pages, show all
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            // If near start, show first 5
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            // If near end, show last 5
                            pageNum = totalPages - 4 + i;
                          } else {
                            // Otherwise center current page
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(pageNum);
                                }}
                                isActive={pageNum === currentPage}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                            }} 
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? 'No subscribers found matching your search' : 'No subscribers found'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-medium">{subscriberToDelete?.email}</span> from your newsletter subscribers list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Subscriber'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminNewsletterSubmissions;
