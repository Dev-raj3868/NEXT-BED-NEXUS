import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, ArrowRightLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  name: string;
  bedNumber: string;
  roomType: string;
  admittedDate: string;
  daysAdmitted: number;
}

const patients: Patient[] = [
  { id: "1", name: "Rajesh Kumar", bedNumber: "ICU-05", roomType: "ICU", admittedDate: "2024-01-15", daysAdmitted: 12 },
  { id: "2", name: "Priya Sharma", bedNumber: "GEN-12", roomType: "General", admittedDate: "2024-01-20", daysAdmitted: 7 },
  { id: "3", name: "Amit Patel", bedNumber: "PVT-03", roomType: "Private", admittedDate: "2024-01-22", daysAdmitted: 5 },
  { id: "4", name: "Sunita Devi", bedNumber: "SEMI-08", roomType: "Semi-Private", admittedDate: "2024-01-24", daysAdmitted: 3 },
  { id: "5", name: "Mohammed Ali", bedNumber: "ICU-02", roomType: "ICU", admittedDate: "2024-01-25", daysAdmitted: 2 },
];

const getRoomTypeStyle = (roomType: string) => {
  switch (roomType) {
    case "ICU":
      return "bg-destructive/10 text-destructive";
    case "Private":
      return "bg-primary/10 text-primary";
    case "Semi-Private":
      return "bg-info/10 text-info";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

const getDaysStyle = (days: number) => {
  if (days >= 10) return "text-destructive font-semibold";
  if (days >= 5) return "text-warning font-semibold";
  return "text-foreground";
};

const PatientsTable = () => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden animate-slide-up">
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">Currently Admitted Patients</h3>
        <p className="text-sm text-muted-foreground mt-1">Active admissions with bed assignments</p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Patient Name</TableHead>
              <TableHead className="font-semibold">Bed Number</TableHead>
              <TableHead className="font-semibold">Room Type</TableHead>
              <TableHead className="font-semibold">Admitted Date</TableHead>
              <TableHead className="font-semibold text-center">Days Admitted</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {patient.bedNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      getRoomTypeStyle(patient.roomType)
                    )}
                  >
                    {patient.roomType}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(patient.admittedDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className={cn("text-center", getDaysStyle(patient.daysAdmitted))}>
                  {patient.daysAdmitted} days
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="View">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Transfer">
                      <ArrowRightLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Discharge">
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PatientsTable;
