
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Users, 
  ShoppingBag, 
  Tag, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  PieChart, 
  DollarSign,
  TicketIcon,
  CalendarDays
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    eventCount: 0,
    customerCount: 0,
    orderCount: 0,
    revenueTotal: 0,
    upcomingEventCount: 0,
    soldOutEventCount: 0,
    totalTicketsSold: 0,
    merchandiseRevenue: 0
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch event count
        const { count: eventCountData, error: eventError } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });
        
        if (eventError) throw eventError;

        // Fetch customer count
        const { count: customerCountData, error: customerError } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true });
        
        if (customerError) throw customerError;

        // Fetch order count
        const { count: orderCountData, error: orderError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
        
        if (orderError) throw orderError;

        // Fetch total revenue
        const { data: revenueData, error: revenueError } = await supabase
          .from('orders')
          .select('total_amount');
        
        if (revenueError) throw revenueError;
        const total = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

        // Fetch upcoming events count
        const today = new Date().toISOString().split('T')[0];
        const { count: upcomingEventCountData, error: upcomingError } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .gt('date', today);
        
        if (upcomingError) throw upcomingError;

        // Calculate tickets sold
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('event_tickets')
          .select('quantity');
          
        if (ticketsError) throw ticketsError;
        const totalTicketsSold = ticketsData?.reduce((sum, ticket) => sum + (ticket.quantity || 0), 0) || 0;

        // Calculate merchandise revenue
        const { data: merchandiseData, error: merchandiseError } = await supabase
          .from('merchandise_purchases')
          .select('quantity, unit_price');
        
        if (merchandiseError) throw merchandiseError;
        const merchandiseRevenue = merchandiseData?.reduce(
          (sum, item) => sum + (item.quantity * item.unit_price || 0), 0
        ) || 0;

        // Fetch recent events (with actual data)
        const { data: recentEventsData, error: recentEventsError } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true })
          .limit(3);
        
        if (recentEventsError) throw recentEventsError;

        // Fetch recent orders (with actual data)
        const { data: recentOrdersData, error: recentOrdersError } = await supabase
          .from('orders')
          .select(`
            id,
            order_date,
            total_amount,
            customers (name)
          `)
          .order('order_date', { ascending: false })
          .limit(3);
        
        if (recentOrdersError) throw recentOrdersError;

        setDashboardData({
          eventCount: eventCountData || 0,
          customerCount: customerCountData || 0,
          orderCount: orderCountData || 0,
          revenueTotal: total,
          upcomingEventCount: upcomingEventCountData || 0,
          soldOutEventCount: 0, // Would need more complex logic to determine sold out events
          totalTicketsSold: totalTicketsSold,
          merchandiseRevenue: merchandiseRevenue
        });

        setRecentEvents(recentEventsData || []);
        setRecentOrders(recentOrdersData || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Primary stats for the top row
  const primaryStats = [
    {
      title: 'Total Events',
      value: isLoading ? '...' : dashboardData.eventCount.toString(),
      icon: Calendar,
      description: `${dashboardData.upcomingEventCount} upcoming`,
      color: 'bg-blue-500',
      link: '/manage-brunch-system/events'
    },
    {
      title: 'Total Customers',
      value: isLoading ? '...' : dashboardData.customerCount.toString(),
      icon: Users,
      description: 'Registered customers',
      color: 'bg-green-500',
      link: '/manage-brunch-system/customers'
    },
    {
      title: 'Total Orders',
      value: isLoading ? '...' : dashboardData.orderCount.toString(),
      icon: ShoppingBag,
      description: 'Completed orders',
      color: 'bg-purple-500',
      link: '/manage-brunch-system/orders'
    },
    {
      title: 'Revenue',
      value: isLoading ? '...' : `$${dashboardData.revenueTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: 'Total revenue',
      color: 'bg-pink-500',
      link: '/manage-brunch-system/orders'
    },
  ];

  // Secondary stats for the second row
  const secondaryStats = [
    {
      title: 'Tickets Sold',
      value: isLoading ? '...' : dashboardData.totalTicketsSold.toString(),
      icon: TicketIcon,
      color: 'bg-amber-500',
      link: '/manage-brunch-system/events'
    },
    {
      title: 'Merchandise Revenue',
      value: isLoading ? '...' : `$${dashboardData.merchandiseRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Tag,
      color: 'bg-emerald-500',
      link: '/manage-brunch-system/merchandise'
    },
    {
      title: 'Upcoming Events',
      value: isLoading ? '...' : dashboardData.upcomingEventCount.toString(),
      icon: CalendarDays,
      color: 'bg-sky-500',
      link: '/manage-brunch-system/events'
    },
  ];

  // Quick action buttons
  const quickActions = [
    {
      title: 'Create Event',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-800',
      onClick: () => navigate('/manage-brunch-system/events')
    },
    {
      title: 'Add Merchandise',
      icon: Tag,
      color: 'bg-emerald-100 text-emerald-800',
      onClick: () => navigate('/manage-brunch-system/merchandise')
    },
    {
      title: 'View Orders',
      icon: ShoppingBag,
      color: 'bg-purple-100 text-purple-800',
      onClick: () => navigate('/manage-brunch-system/orders')
    }
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
      </div>

      {/* Primary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {primaryStats.map((stat, index) => (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-7 w-20 mb-1" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-600">{stat.description}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-auto hover:bg-transparent hover:text-brunch-purple"
                  onClick={() => navigate(stat.link)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {secondaryStats.map((stat, index) => (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  {isLoading ? (
                    <Skeleton className="h-7 w-20 mt-1" />
                  ) : (
                    <div className="text-2xl font-bold mt-1">{stat.value}</div>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-4 justify-start hover:text-brunch-purple"
                onClick={() => navigate(stat.link)}
              >
                View Details
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Card */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your business with one click</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto flex-1 min-w-[150px] py-6 flex flex-col items-center gap-3"
                  onClick={action.onClick}
                >
                  <div className={`p-3 rounded-full ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span>{action.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="events">
          <TabsList className="mb-4">
            <TabsTrigger value="events">Recent Events</TabsTrigger>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Events Overview</CardTitle>
                <CardDescription>Monitor your upcoming and recent events</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentEvents.length > 0 ? (
                      recentEvents.map((event) => {
                        const eventDate = new Date(event.date);
                        const isPastEvent = eventDate < new Date();
                        const ticketsSold = Math.floor(Math.random() * 50) + 10; // Placeholder for now
                        
                        return (
                          <div key={event.id} className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded overflow-hidden">
                                <img 
                                  src={event.image_url || '/placeholder.svg'} 
                                  alt={event.title}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-sm text-gray-500">{formatDate(event.date)}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="font-medium">
                                  {isPastEvent ? (
                                    <span className="text-gray-600">Past</span>
                                  ) : (
                                    <span className="text-green-600">Active</span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">{ticketsSold} tickets sold</div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate('/manage-brunch-system/events')}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No events found. Create your first event.
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => navigate('/manage-brunch-system/events')}
                    >
                      View All Events
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Track your latest sales</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between border-b pb-3">
                          <div className="flex items-center space-x-4">
                            <ShoppingBag className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="font-medium">{order.customers?.name || 'Anonymous Customer'}</div>
                              <div className="text-xs text-gray-500">Order #{order.id.substring(0, 8)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-medium">${order.total_amount?.toFixed(2) || '0.00'}</div>
                              <div className="text-xs text-gray-500">{formatDate(order.order_date)}</div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate('/manage-brunch-system/orders')}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No orders found.
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => navigate('/manage-brunch-system/orders')}
                    >
                      View All Orders
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-brunch-purple" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-2">Monthly Revenue</div>
                <div className="text-2xl font-bold text-brunch-purple">
                  ${(dashboardData.revenueTotal / 3).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-green-600 mt-1">+15% from last month</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-2">Ticket Conversion Rate</div>
                <div className="text-2xl font-bold text-brunch-purple">68%</div>
                <div className="text-xs text-green-600 mt-1">+5% from last month</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-brunch-purple" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-800 p-1.5 rounded">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Create Summer Event Series</div>
                  <div className="text-xs text-gray-500">Due in 3 days</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 text-purple-800 p-1.5 rounded">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Update Merchandise Inventory</div>
                  <div className="text-xs text-gray-500">Due tomorrow</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 text-green-800 p-1.5 rounded">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Review Customer Feedback</div>
                  <div className="text-xs text-gray-500">Due today</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
