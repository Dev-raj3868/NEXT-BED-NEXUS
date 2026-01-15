import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Department {
  id: string;
  name: string;
  totalBeds: number;
  occupied: number;
  available: number;
}

const departments: Department[] = [
  { id: "1", name: "General Medicine", totalBeds: 50, occupied: 42, available: 8 },
  { id: "2", name: "Cardiology", totalBeds: 30, occupied: 28, available: 2 },
  { id: "3", name: "Orthopedics", totalBeds: 25, occupied: 18, available: 7 },
  { id: "4", name: "Pediatrics", totalBeds: 40, occupied: 32, available: 8 },
  { id: "5", name: "Neurology", totalBeds: 20, occupied: 15, available: 5 },
  { id: "6", name: "ICU", totalBeds: 15, occupied: 14, available: 1 },
];

const getOccupancyColor = (percentage: number) => {
  if (percentage >= 90) return "text-destructive bg-destructive/10";
  if (percentage >= 70) return "text-warning bg-warning/10";
  return "text-success bg-success/10";
};

const DepartmentTable = () => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden animate-slide-up">
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">Department Wise Bed Status</h3>
        <p className="text-sm text-muted-foreground mt-1">Real-time bed availability across departments</p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Department Name</TableHead>
              <TableHead className="font-semibold text-center">Total Beds</TableHead>
              <TableHead className="font-semibold text-center">Occupied</TableHead>
              <TableHead className="font-semibold text-center">Available</TableHead>
              <TableHead className="font-semibold text-center">Occupancy %</TableHead>
              <TableHead className="font-semibold text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => {
              const occupancy = Math.round((dept.occupied / dept.totalBeds) * 100);
              return (
                <TableRow key={dept.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="text-center">{dept.totalBeds}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-primary font-medium">{dept.occupied}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-success font-medium">{dept.available}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-semibold",
                        getOccupancyColor(occupancy)
                      )}
                    >
                      {occupancy}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DepartmentTable;
