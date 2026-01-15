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
import { useState } from "react";

const mockFloors = [
  { id: "FL001", name: "Ground Floor" },
  { id: "FL002", name: "First Floor" },
  { id: "FL003", name: "Second Floor" },
  { id: "FL004", name: "Third Floor" },
  { id: "FL005", name: "Fourth Floor" },
];

const GetFloor = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Get Floors</h1>
        <p className="text-muted-foreground">View all floors in the hospital</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Floor List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Floor ID</TableHead>
                <TableHead>Floor Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFloors.map((floor) => (
                <TableRow key={floor.id}>
                  <TableCell className="font-medium">{floor.id}</TableCell>
                  <TableCell>{floor.name}</TableCell>
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

export default GetFloor;
