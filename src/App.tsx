import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import VerifyAccount from "./pages/VerifyAccount";
import ForgotPassword from "./pages/ForgotPassword";
import AffiliateRedirect from "./pages/AffiliateRedirect";
import AffiliatePayouts from "./pages/AffiliatePayouts";
import ProductDetail from "./pages/ProductDetail";
import ScheduleDelivery from "./pages/ScheduleDelivery";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import Affiliates from "./pages/Affiliates";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Invite from "./pages/Invite";
import First from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppShell = () => {
  const location = useLocation();
  const showFooter = location.pathname === "/" || location.pathname === "/auth";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <Routes>
          <Route path="/first-visit" element={<First />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/verify" element={<VerifyAccount />} />
          <Route path="/r/:code" element={<AffiliateRedirect />} />
          <Route path="/" element={<Index />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <ScheduleDelivery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/affiliates"
            element={
              <ProtectedRoute>
                <Affiliates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/affiliates/payouts"
            element={
              <ProtectedRoute>
                <AffiliatePayouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
