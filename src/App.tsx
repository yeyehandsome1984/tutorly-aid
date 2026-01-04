import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Tutors from "./pages/Tutors";
import Subjects from "./pages/Subjects";
import Auth from "./pages/Auth";
import FAQ from "./pages/Questions";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TutorsManagement from "./pages/admin/TutorsManagement";
import SubjectsManagement from "./pages/admin/SubjectsManagement";
import TopicsManagement from "./pages/admin/TopicsManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import TutorSubjectsManagement from "./pages/admin/TutorSubjectsManagement";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import AuthRecoveryRedirect from "./components/AuthRecoveryRedirect";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthRecoveryRedirect />
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tutors" element={<Tutors />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="tutors" element={<TutorsManagement />} />
              <Route path="subjects" element={<SubjectsManagement />} />
              <Route path="topics" element={<TopicsManagement />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="tutor-subjects" element={<TutorSubjectsManagement />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
