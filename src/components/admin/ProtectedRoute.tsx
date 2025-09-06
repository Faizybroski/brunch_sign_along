
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAdmin, isLoading, user, session } = useAdminAuth();
  const location = useLocation();
  
  console.log("ProtectedRoute auth status:", { isAdmin, isLoading, userEmail: user?.email, hasSession: !!session });
  
  useEffect(() => {
    if (!isLoading && !session) {
      console.log("No session found in ProtectedRoute");
      toast.error("You need to be logged in to access this page");
    } else if (!isLoading && !isAdmin && user) {
      console.log("User is logged in but not an admin");
      toast.error("You don't have admin privileges");
    }
  }, [isLoading, session, isAdmin, user]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    console.log("Auth is still loading, showing spinner");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brunch-purple" />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!session) {
    console.log("No session found, redirecting to login");
    return <Navigate to="/manage-brunch-system" state={{ from: location }} replace />;
  }

  // If user is authenticated but not an admin, show error and redirect
  if (!isAdmin) {
    console.log("User is not admin, redirecting to login");
    
    // Only show toast if this is a real user (not the special tickets account)
    if (user && user.email !== 'tickets@brunchsingalong.com') {
      toast.error("You don't have admin privileges");
    }
    
    return <Navigate to="/manage-brunch-system" state={{ from: location }} replace />;
  }

  // User is authenticated and has admin privileges
  console.log("User is admin, allowing access");
  return <>{children}</>;
};

export default ProtectedRoute;
