
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Tag, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X,
  Ticket,
  FileImage,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut, user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate('/manage-brunch-system');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/manage-brunch-system/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Events',
      href: '/manage-brunch-system/events',
      icon: Calendar,
    },
    {
      name: 'Tickets',
      href: '/manage-brunch-system/tickets',
      icon: Ticket,
    },
    {
      name: 'Customers',
      href: '/manage-brunch-system/customers',
      icon: Users,
    },
    {
      name: 'Merchandise',
      href: '/manage-brunch-system/merchandise',
      icon: Tag,
    },
    {
      name: 'Orders',
      href: '/manage-brunch-system/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Content',
      href: '/manage-brunch-system/content',
      icon: FileImage,
    },
    {
      name: 'Newsletter',
      href: '/manage-brunch-system/newsletter',
      icon: Mail,
    },
    {
      name: 'Contact Messages',
      href: '/manage-brunch-system/contact-messages',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold text-brunch-purple">Brunch Admin</h1>
            {user && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {user.email}
              </p>
            )}
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-brunch-purple text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="flex items-center w-full text-left text-gray-700 hover:bg-gray-100"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:ml-64" : ""
      )}>
        <main className="p-6 md:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
