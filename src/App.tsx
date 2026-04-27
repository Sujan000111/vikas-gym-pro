import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AuthenticatedRoute } from "@/components/layout/AuthenticatedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import AICoach from "./pages/AICoach";
import Feedback from "./pages/Feedback";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function Shell() {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith('/dashboard');
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ScrollToTop />
            <Shell />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
