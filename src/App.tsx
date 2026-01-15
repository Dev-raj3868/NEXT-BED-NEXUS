import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import PlaceholderPage from "./pages/PlaceholderPage";
import AddPatient from "./pages/patients/AddPatient";
import GetPatient from "./pages/patients/GetPatient";
import TransferPatient from "./pages/patients/TransferPatient";
import CreateAdmission from "./pages/patients/CreateAdmission";
import GetAdmission from "./pages/patients/GetAdmission";
import AddFloor from "./pages/ipd/AddFloor";
import GetFloor from "./pages/ipd/GetFloor";
import AddRoom from "./pages/ipd/AddRoom";
import GetRoom from "./pages/ipd/GetRoom";
import AddDepartment from "./pages/ipd/AddDepartment";
import GetDepartment from "./pages/ipd/GetDepartment";
import AddRoomType from "./pages/ipd/AddRoomType";
import GetBed from "./pages/ipd/GetBed";
import AddOTRoom from "./pages/ipd/AddOTRoom";
import GetOTRoom from "./pages/ipd/GetOTRoom";
import AddOTSlot from "./pages/ot/AddOTSlot";
import GetOTSlot from "./pages/ot/GetOTSlot";
import AddOTInventory from "./pages/ot/AddOTInventory";
import GetOTInventory from "./pages/ot/GetOTInventory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Patient Management */}
            <Route path="/patients/add" element={<AddPatient />} />
            <Route path="/patients/search" element={<GetPatient />} />
            <Route path="/patients/transfer" element={<TransferPatient />} />
            <Route path="/patients/admission/add" element={<CreateAdmission />} />
            <Route path="/patients/admission/search" element={<GetAdmission />} />
            
            {/* IPD/Ward */}
            <Route path="/ipd/floors" element={<GetFloor />} />
            <Route path="/ipd/floors/add" element={<AddFloor />} />
            <Route path="/ipd/rooms" element={<GetRoom />} />
            <Route path="/ipd/rooms/add" element={<AddRoom />} />
            <Route path="/ipd/department" element={<GetDepartment />} />
            <Route path="/ipd/department/add" element={<AddDepartment />} />
            <Route path="/ipd/room-types" element={<PlaceholderPage />} />
            <Route path="/ipd/room-types/add" element={<AddRoomType />} />
            <Route path="/ipd/beds" element={<GetBed />} />
            <Route path="/ipd/beds/add" element={<PlaceholderPage />} />
            <Route path="/ipd/ot-rooms" element={<GetOTRoom />} />
            <Route path="/ipd/ot-rooms/add" element={<AddOTRoom />} />
            
            {/* OT Modules */}
            <Route path="/ot/slots" element={<GetOTSlot />} />
            <Route path="/ot/slots/add" element={<AddOTSlot />} />
            <Route path="/ot/inventory" element={<GetOTInventory />} />
            <Route path="/ot/inventory/add" element={<AddOTInventory />} />
            
            {/* Billing */}
            <Route path="/billing/create" element={<PlaceholderPage />} />
            <Route path="/billing/search" element={<PlaceholderPage />} />
            <Route path="/billing/create-final" element={<PlaceholderPage />} />
            <Route path="/billing/get-final" element={<PlaceholderPage />} />
            
            {/* Analytics */}
            <Route path="/analytics" element={<PlaceholderPage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
