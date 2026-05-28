import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WorkspaceProvider } from "@/lib/workspace";
import { AppStateProvider } from "@/lib/appState";
import { DoctorStateProvider } from "@/lib/doctorState";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import ClinicOverview from "./pages/clinic/Overview";
import Bookings from "./pages/clinic/Bookings";
import Calendar from "./pages/clinic/Calendar";
import Conversations from "./pages/clinic/Conversations";
import Doctors from "./pages/clinic/Doctors";
import Services from "./pages/clinic/Services";
import Profile from "./pages/clinic/Profile";
import Team from "./pages/clinic/Team";
import Integrations from "./pages/clinic/Integrations";
import Reports from "./pages/clinic/Reports";
import Support from "./pages/clinic/Support";

import AdminDashboard from "./pages/admin/Dashboard";
import Leads from "./pages/admin/Leads";
import Verification from "./pages/admin/Verification";
import Onboarding from "./pages/admin/Onboarding";
import Accounts from "./pages/admin/Accounts";
import AgentQA from "./pages/admin/AgentQA";
import Issues, { IntegrationsHealth } from "./pages/admin/Issues";
import Templates, { Billing, AdminSettings } from "./pages/admin/Templates";

import DoctorToday from "./pages/doctor/Today";
import DoctorSchedule from "./pages/doctor/Schedule";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorConversations from "./pages/doctor/Conversations";
import DoctorEmergency from "./pages/doctor/Emergency";
import DoctorAvailability from "./pages/doctor/Availability";
import DoctorProfile from "./pages/doctor/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <WorkspaceProvider>
        <AppStateProvider>
          <DoctorStateProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />

                {/* Clinic Hub */}
                <Route path="/app" element={<ClinicOverview />} />
                <Route path="/app/bookings" element={<Bookings />} />
                <Route path="/app/calendar" element={<Calendar />} />
                <Route path="/app/conversations" element={<Conversations />} />
                <Route path="/app/doctors" element={<Doctors />} />
                <Route path="/app/services" element={<Services />} />
                <Route path="/app/profile" element={<Profile />} />
                <Route path="/app/team" element={<Team />} />
                <Route path="/app/integrations" element={<Integrations />} />
                <Route path="/app/reports" element={<Reports />} />
                <Route path="/app/support" element={<Support />} />

                {/* Internal Admin Console */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/leads" element={<Leads />} />
                <Route path="/admin/verification" element={<Verification />} />
                <Route path="/admin/onboarding" element={<Onboarding />} />
                <Route path="/admin/accounts" element={<Accounts />} />
                <Route path="/admin/qa" element={<AgentQA />} />
                <Route path="/admin/issues" element={<Issues />} />
                <Route path="/admin/integrations" element={<IntegrationsHealth />} />
                <Route path="/admin/templates" element={<Templates />} />
                <Route path="/admin/billing" element={<Billing />} />
                <Route path="/admin/settings" element={<AdminSettings />} />

                {/* Doctor Dashboard */}
                <Route path="/doctor" element={<DoctorToday />} />
                <Route path="/doctor/schedule" element={<DoctorSchedule />} />
                <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                <Route path="/doctor/conversations" element={<DoctorConversations />} />
                <Route path="/doctor/emergency" element={<DoctorEmergency />} />
                <Route path="/doctor/availability" element={<DoctorAvailability />} />
                <Route path="/doctor/profile" element={<DoctorProfile />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </DoctorStateProvider>
        </AppStateProvider>
      </WorkspaceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
