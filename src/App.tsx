import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import VerifyAccount from "./pages/VerifyAccount";
import ForgotPassword from "./pages/ForgotPassword";
import AffiliateRedirect from "./pages/AffiliateRedirect";
import AffiliatePayouts from "./pages/AffiliatePayouts";
import LandingPage from "./pages/LandingPage";
import ProductDetail from "./pages/ProductDetail";
import ScheduleDelivery from "./pages/ScheduleDelivery";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import Affiliates from "./pages/Affiliates";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/verify" element={<VerifyAccount />} />
            <Route path="/r/:code" element={<AffiliateRedirect />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
            <Route path="/schedule/:productId" element={<ProtectedRoute><ScheduleDelivery /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            <Route path="/affiliates" element={<ProtectedRoute><Affiliates /></ProtectedRoute>} />
            <Route path="/affiliates/payouts" element={<ProtectedRoute><AffiliatePayouts /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
