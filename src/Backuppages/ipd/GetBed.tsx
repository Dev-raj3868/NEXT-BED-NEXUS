import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const mockBeds = [
  {
    roomId: "101",
    bedNumber: "101-A",
    position: "Left",
    status: "Occupied",
    currentPatient: "John Doe",
  },
  {
    roomId: "101",
    bedNumber: "101-B",
    position: "Right",
    status: "Available",
    currentPatient: null,
  },
  {
    roomId: "201",
    bedNumber: "201-A",
    position: "Left",
    status: "Occupied",
    currentPatient: "Jane Smith",
  },
  {
    roomId: "201",
    bedNumber: "201-B",
    position: "Right",
    status: "Maintenance",
    currentPatient: null,
  },
  {
    roomId: "ICU-01",
    bedNumber: "ICU-01-A",
    position: "Center",
    status: "Occupied",
    currentPatient: "Robert Brown",
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Available":
      return "default";
    case "Occupied":
      return "secondary";
    case "Maintenance":
      return "destructive";
    default:
      return "outline";
  }
};

const GetBed = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Get Beds</h1>
        <p className="text-muted-foreground">View all beds in the hospital</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bed List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room ID</TableHead>
                <TableHead>Bed Number</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Patient</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBeds.map((bed, index) => (
                <TableRow key={index}>
                  <TableCell>{bed.roomId}</TableCell>
                  <TableCell className="font-medium">{bed.bedNumber}</TableCell>
                  <TableCell>{bed.position}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(bed.status)}>
                      {bed.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{bed.currentPatient || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetBed;
