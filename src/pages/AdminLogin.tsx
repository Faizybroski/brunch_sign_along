import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertCircle, Info, Loader2 } from "lucide-react";
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from "@/integrations/supabase/client";

// Form schema for validation
const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type FormData = z.infer<typeof formSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [processingAuth, setProcessingAuth] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [authAlertMessage, setAuthAlertMessage] = useState("");
  const { signIn, user, session, isAdmin, isLoading } = useAdminAuth();
  
  // Check if the user is already logged in
  useEffect(() => {
    console.log("AdminLogin checking auth status:", { user, session, isAdmin });
    
    // If we have a session and user is admin, redirect to dashboard
    if (session && isAdmin && !isLoading) {
      console.log("User is already authenticated and has admin privileges, redirecting to dashboard");
      navigate('/manage-brunch-system/dashboard');
    }
  }, [user, session, isAdmin, isLoading, navigate]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "tickets@brunchsingalong.com",
      password: "Goodday11"
    },
  });

  const onSubmit = async (values: FormData) => {
    console.log("Submit pressed with values:", values.email);
    if (isLoading || processingAuth) {
      console.log("Already loading, skipping submit");
      return;
    }
    
    setProcessingAuth(true);
    try {
      console.log("Attempting login with:", values.email);
      
      await signIn(values.email, values.password);
      console.log("Login function completed without errors");
      
      // Just to be sure, check if we're authenticated and navigate
      if (session && isAdmin) {
        navigate('/manage-brunch-system/dashboard');
      }
      
    } catch (error: any) {
      console.error("Login error in component:", error);
      
      // Special handling for email not confirmed
      if (error.message?.includes("Email not confirmed")) {
        setAuthAlertMessage(`Please verify your email before logging in. Check your inbox for a verification link.`);
        setShowAuthAlert(true);
      } else if (error.message?.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(error.message || "Failed to log in");
      }
    } finally {
      setProcessingAuth(false);
    }
  };

  const resendVerificationEmail = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    try {
      setProcessingAuth(true);
      console.log("Resending verification email to:", email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: window.location.origin + '/manage-brunch-system'
        }
      });
      
      if (error) throw error;
      
      toast.success(`Verification email sent to ${email}! Please check your inbox and spam folder.`);
      setAuthAlertMessage(`Verification email resent to ${email}! Please check both your inbox and spam folder.`);
      setShowAuthAlert(true);
    } catch (error: any) {
      console.error("Failed to resend verification email:", error);
      toast.error(error.message || "Failed to send verification email");
    } finally {
      setProcessingAuth(false);
    }
  };

  const resetPassword = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    try {
      setProcessingAuth(true);
      console.log("Sending password reset email to:", email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/manage-brunch-system'
      });
      
      if (error) throw error;
      
      toast.success(`Password reset email sent to ${email}! Please check your inbox and spam folder.`);
      setAuthAlertMessage(`Password reset email sent to ${email}! Please check both your inbox and spam folder.`);
      setShowAuthAlert(true);
    } catch (error: any) {
      console.error("Failed to send password reset email:", error);
      toast.error(error.message || "Failed to send password reset email");
    } finally {
      setProcessingAuth(false);
    }
  };
  
  // Don't show login form while checking authentication
  if (isLoading && !processingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brunch-pink/20 to-brunch-purple/20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brunch-purple mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brunch-pink/20 to-brunch-purple/20">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access the management system
          </p>
          {(isLoading || processingAuth) && (
            <div className="mt-4 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-brunch-purple" />
            </div>
          )}
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-2 rounded-r">
          <div className="flex items-center">
            <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Default login: tickets@brunchsingalong.com / Goodday11
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email" 
                      type="email" 
                      {...field} 
                      disabled={isLoading || processingAuth}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your password" 
                      type="password" 
                      {...field} 
                      disabled={isLoading || processingAuth}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm text-brunch-purple hover:underline"
                onClick={resetPassword}
                disabled={isLoading || processingAuth}
              >
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-brunch-purple hover:bg-brunch-purple-dark"
              disabled={isLoading || processingAuth}
            >
              {(isLoading || processingAuth) ? 'Processing...' : 'Login'}
            </Button>
            
            <div className="text-center mt-4 space-y-2">
              <button
                type="button"
                className="text-xs text-gray-500 hover:underline block w-full mt-1"
                onClick={resendVerificationEmail}
                disabled={isLoading || processingAuth}
              >
                Resend verification email
              </button>
            </div>
          </form>
        </Form>
      </div>

      {/* Alert Dialog for Auth messages */}
      <AlertDialog open={showAuthAlert} onOpenChange={setShowAuthAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Notice</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex items-start space-x-2 mb-4 pt-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p>{authAlertMessage}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              onClick={() => setShowAuthAlert(false)} 
              variant="outline"
              disabled={processingAuth}
            >
              Close
            </Button>
            <Button 
              onClick={resendVerificationEmail}
              className="bg-brunch-purple hover:bg-brunch-purple-dark"
              disabled={processingAuth}
            >
              Resend Verification Email
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminLogin;
