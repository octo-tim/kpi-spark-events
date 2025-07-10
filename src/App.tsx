import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import EventList from "./pages/EventList";
import EventCreate from "./pages/EventCreate";
import EventDetail from "./pages/EventDetail";
import EventEdit from "./pages/EventEdit";
import Analytics from "./pages/Analytics";
import Auth from "./pages/Auth";
import Reports from "./pages/Reports";
import ReportCreate from "./pages/ReportCreate";
import EventManagersManagement from "./pages/EventManagersManagement";
import PartnersManagement from "./pages/PartnersManagement";
import LocationsManagement from "./pages/LocationsManagement";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/events" element={<EventList />} />
                    <Route path="/events/create" element={<EventCreate />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route path="/events/:id/edit" element={<EventEdit />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/reports/create" element={<ReportCreate />} />
                    <Route path="/management/managers" element={<EventManagersManagement />} />
                    <Route path="/management/partners" element={<PartnersManagement />} />
                    <Route path="/management/locations" element={<LocationsManagement />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
