import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Resources from "./pages/Resources";
import Ebooks from "./pages/Ebooks";
import EbooksAndCourses from "./pages/EbooksAndCourses";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import MyLearning from "./pages/MyLearning";
import Auth from "./pages/Auth";
import PaymentSuccess from "./pages/PaymentSuccess";
// import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import Blog from "./pages/Blog";
import Webinars from "./pages/Webinars";
import NotFound from "./pages/NotFound";
import { UserProfile } from "./components/UserProfile";
import UserDashboard from "./pages/user/Dashboard";
import ConsultationsPage from "./pages/user/Consultations";
import AdminBookings from "./pages/admin/Bookings";
import AdminSubscriptions from "./pages/admin/Subscriptions";
import AdminAffiliates from "./pages/admin/Affiliates";
import AdminSupport from "./pages/admin/Support";
import ManageServices from "./pages/admin/ManageServices";
import AddService from "./pages/admin/AddService";
import EditService from "./pages/admin/EditService";
import Affiliates from "./pages/Affiliates";
import MyProducts from "./pages/user/MyProducts";
import MyWebinars from "./pages/user/MyWebinars";
import MyBookings from "./pages/user/MyBookings";
import Cart from "./pages/Cart";
import EditProfile from "./pages/EditProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
  <CartProvider>
  <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/ebooks" element={<Ebooks />} />
            <Route path="/shop" element={<EbooksAndCourses />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/my-learning" element={<MyLearning />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/webinars" element={<Webinars />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/affiliates" element={<Affiliates />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/services" element={<ManageServices />} />
            <Route path="/admin/services/add" element={<AddService />} />
            <Route path="/admin/services/edit/:id" element={<EditService />} />
            <Route path="/profile" element={<UserProfile />}>
              <Route index element={<UserDashboard />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="consultations" element={<ConsultationsPage />} />
              <Route path="learning" element={<MyLearning />} />
              <Route path="products" element={<MyProducts />} />
              <Route path="webinars" element={<MyWebinars />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="affiliates" element={<AdminAffiliates />} />
              <Route path="support" element={<AdminSupport />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
