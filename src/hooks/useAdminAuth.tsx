
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { toast } from "sonner";

interface AdminAuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  session: null,
  user: null,
  isAdmin: false,
  isLoading: true,
  signOut: async () => {},
  signIn: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle auth state changes and check admin status
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Check if user is admin
          await checkAdminStatus(currentSession.user);
        } else {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", currentSession?.user?.email);
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Check if user is admin
          await checkAdminStatus(currentSession.user);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (currentUser: User) => {
    try {
      console.log("Checking admin status for user:", currentUser.email);
      
      // Special case for tickets@brunchsingalong.com || itsme.shaharyar@gmail.com - always grant admin
      if (currentUser.email === 'tickets@brunchsingalong.com' || currentUser.email==="itsme.shaharyar@gmail.com") {
        console.log("Auto granting admin access to tickets@brunchsingalong.com || itsme.shaharyar@gmail.com");
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }
      
      // For other users, check the admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } else {
        console.log("Admin check result:", data);
        setIsAdmin(!!data);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting to sign in with:", email);
      
      // For special account, first check if it exists and try to create it if needed
      if (email === 'tickets@brunchsingalong.com' || email==="itsme.shaharyar@gmail.com") {
        console.log("Handling special account login");
        
        // Try to sign up first (in case it doesn't exist)
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/manage-brunch-system'
          }
        });
        
        // Now try to login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.error("Error signing in special account:", error);
          toast.error("Please check your email for verification link or try again");
          throw error;
        }
        
        setUser(data.user);
        setSession(data.session);
        setIsAdmin(true); // Auto-grant admin for the special account
        toast.success("Login successful");
        return;
      }
      
      // Standard login for normal accounts
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Failed to log in");
        throw error;
      }
      
      setUser(data.user);
      setSession(data.session);
      toast.success("Login successful");
      
    } catch (error: any) {
      console.error("Login flow error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ session, user, isAdmin, isLoading, signOut, signIn }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
