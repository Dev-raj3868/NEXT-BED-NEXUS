import { BedDouble, Users, CheckCircle, Wrench } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import DepartmentTable from "@/components/dashboard/DepartmentTable";
import PatientsTable from "@/components/dashboard/PatientsTable";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor bed availability and patient admissions in real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Beds"
          value={180}
          icon={BedDouble}
          variant="primary"
        />
        <StatCard
          title="Occupied Beds"
          value={149}
          icon={Users}
          variant="warning"
          trend={{ value: 3.2, isPositive: true }}
        />
        <StatCard
          title="Available Beds"
          value={26}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Under Maintenance"
          value={5}
          icon={Wrench}
          variant="info"
        />
      </div>

      {/* Department Table */}
      <DepartmentTable />

      {/* Patients Table */}
      <PatientsTable />
    </div>
  );
};

export default Dashboard;
