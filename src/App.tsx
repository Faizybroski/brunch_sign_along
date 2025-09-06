import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import { MerchandiseProvider } from "./hooks/useMerchandiseContext";
import { Loader2 } from "lucide-react";
import { AdminAuthProvider } from "./hooks/useAdminAuth";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Eagerly load critical components
import Index from "./pages/Index";

// Lazy load non-critical routes
const Events = lazy(() => import("./pages/Events"));
const NotFound = lazy(() => import("./pages/NotFound"));
const EventPricing = lazy(() => import("./pages/EventPricing"));
const Checkout = lazy(() => import("./pages/Checkout"));
const TicketTypeSelection = lazy(() => import("./pages/TicketTypeSelection"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const CustomersPage = lazy(() => import("./pages/CustomersPage"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Refund = lazy(() => import("./pages/Refund"));
const MerchandiseCheckout = lazy(() => import("./pages/MerchandiseCheckout"));
const Merchandise = lazy(() => import("./pages/Merchandise"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminMerchandise = lazy(() => import("./pages/admin/AdminMerchandise"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminTickets = lazy(() => import("./pages/admin/AdminTickets"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const AdminNewsletterSubmissions = lazy(() => import("./pages/admin/AdminNewsletterSubmissions"));
const AdminContactMessages = lazy(() => import("./pages/admin/AdminContactMessages"));

const Fallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-brunch-purple mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-brunch-purple">Loading...</h2>
    </div>
  </div>
);

class ErrorBoundaryComponent extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-500">Something went wrong</h2>
            <button 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <TooltipProvider>
    <ErrorBoundaryComponent>
      <Suspense fallback={<Fallback />}>
        <BrowserRouter>
          <MerchandiseProvider>
            <AdminAuthProvider>
              <ScrollToTop />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<><Navbar /><Index /></>} />
                <Route path="/events" element={
                  <Suspense fallback={<Fallback />}>
                    <Navbar />
                    <Events />
                  </Suspense>
                } />
                <Route path="/select-tickets/:eventId" element={
                  <Suspense fallback={<Fallback />}>
                    <Navbar />
                    <TicketTypeSelection />
                  </Suspense>
                } />
                <Route path="/pricing/:eventId" element={
                  <Suspense fallback={<Fallback />}>
                    <Navbar />
                    <EventPricing />
                  </Suspense>
                } />
                <Route path="/checkout/:eventId" element={
                  <Suspense fallback={<Fallback />}>
                    <Navbar />
                    <Checkout />
                  </Suspense>
                } />
                <Route path="/merchandise" element={
                  <Suspense fallback={<Fallback />}>
                    <Navbar />
                    <Merchandise />
                  </Suspense>
                } />
                <Route path="/merchandise-checkout" element={
                  <Suspense fallback={<Fallback />}>
                    <Navbar />
                    <MerchandiseCheckout />
                  </Suspense>
                } />
                <Route path="/order-confirmation" element={
                  <Suspense fallback={<Fallback />}>
                    <Navbar />
                    <OrderConfirmation />
                  </Suspense>
                } />
                <Route path="/admin/customers" element={
                  <Suspense fallback={<Fallback />}>
                    <Navbar />
                    <CustomersPage />
                  </Suspense>
                } />
                <Route path="/privacy" element={
                  <Suspense fallback={<Fallback />}>
                    <Navbar />
                    <Privacy />
                  </Suspense>
                } />
                <Route path="/terms" element={
                  <Suspense fallback={<Fallback />}>
                    <Navbar />
                    <Terms />
                  </Suspense>
                } />
                <Route path="/refund" element={
                  <Suspense fallback={<Fallback />}>
                    <Navbar />
                    <Refund />
                  </Suspense>
                } />

                {/* Admin Routes */}
                <Route path="/manage-brunch-system" element={
                  <Suspense fallback={<Fallback />}>
                    <AdminLogin />
                  </Suspense>
                } />
                
                <Route path="/manage-brunch-system/dashboard" element={
                  <Suspense fallback={<Fallback />}>
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  </Suspense>
                } />
                
                <Route path="/manage-brunch-system/events" element={
                  <Suspense fallback={<Fallback />}>
                    <ProtectedRoute>
                      <AdminEvents />
                    </ProtectedRoute>
                  </Suspense>
                } />
                
                <Route path="/manage-brunch-system/tickets" element={
                  <Suspense fallback={<Fallback />}>
                    <ProtectedRoute>
                      <AdminTickets />
                    </ProtectedRoute>
                  </Suspense>
                } />
                
                <Route path="/manage-brunch-system/customers" element={
                  <Suspense fallback={<Fallback />}>
                    <ProtectedRoute>
                      <AdminCustomers />
                    </ProtectedRoute>
                  </Suspense>
                } />
                
                <Route path="/manage-brunch-system/merchandise" element={
                  <Suspense fallback={<Fallback />}>
                    <ProtectedRoute>
                      <AdminMerchandise />
                    </ProtectedRoute>
                  </Suspense>
                } />
                
                <Route path="/manage-brunch-system/orders" element={
                  <Suspense fallback={<Fallback />}>
                    <ProtectedRoute>
                      <AdminOrders />
                    </ProtectedRoute>
                  </Suspense>
                } />
                
                <Route path="/manage-brunch-system/content" element={
                  <Suspense fallback={<Fallback />}>
                    <ProtectedRoute>
                      <AdminContent />
                    </ProtectedRoute>
                  </Suspense>
                } />
                
                <Route path="/manage-brunch-system/newsletter" element={
                  <Suspense fallback={<Fallback />}>
                    <ProtectedRoute>
                      <AdminNewsletterSubmissions />
                    </ProtectedRoute>
                  </Suspense>
                } />
                
                <Route path="/manage-brunch-system/contact-messages" element={
                  <Suspense fallback={<Fallback />}>
                    <ProtectedRoute>
                      <AdminContactMessages />
                    </ProtectedRoute>
                  </Suspense>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={
                  <Suspense fallback={<Fallback />}>
                    <Navbar />
                    <NotFound />
                  </Suspense>
                } />
              </Routes>
            </AdminAuthProvider>
          </MerchandiseProvider>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundaryComponent>
  </TooltipProvider>
);

export default App;
