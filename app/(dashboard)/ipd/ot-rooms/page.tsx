'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const mockOTRooms = [
  { id: 1, otName: "OT-1", floor: "Floor 1", costPerDay: 25000, costPerHour: 1500, status: "available" },
  { id: 2, otName: "OT-2", floor: "Floor 1", costPerDay: 30000, costPerHour: 2000, status: "occupied" },
  { id: 3, otName: "OT-3", floor: "Floor 2", costPerDay: 35000, costPerHour: 2500, status: "available" },
  { id: 4, otName: "OT-4", floor: "Floor 2", costPerDay: 28000, costPerHour: 1800, status: "maintenance" },
  { id: 5, otName: "OT-5", floor: "Floor 3", costPerDay: 40000, costPerHour: 3000, status: "available" },
];

const GetOTRoom = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockOTRooms.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Available</Badge>;
      case "occupied":
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">Occupied</Badge>;
      case "maintenance":
        return <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">OT Rooms</h1>
        <p className="text-muted-foreground">View all operating theatre rooms</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">OT Room List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OT Name</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Cost Per Day</TableHead>
                <TableHead>Cost Per Hour</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOTRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.otName}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>₹{room.costPerDay.toLocaleString()}</TableCell>
                  <TableCell>₹{room.costPerHour.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(room.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GetOTRoom;
