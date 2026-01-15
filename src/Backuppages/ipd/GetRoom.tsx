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

const mockRooms = [
  {
    floorName: "Ground Floor",
    departmentName: "Cardiology",
    roomCategory: "Private",
    roomNumber: "101",
    ratePerDay: 5000,
    amenities: ["AC", "TV", "WiFi"],
    isActive: true,
  },
  {
    floorName: "First Floor",
    departmentName: "Neurology",
    roomCategory: "Semi-Private",
    roomNumber: "201",
    ratePerDay: 3500,
    amenities: ["AC", "TV"],
    isActive: true,
  },
  {
    floorName: "Second Floor",
    departmentName: "Orthopedics",
    roomCategory: "General Ward",
    roomNumber: "301",
    ratePerDay: 1500,
    amenities: ["Fan"],
    isActive: false,
  },
  {
    floorName: "First Floor",
    departmentName: "General Medicine",
    roomCategory: "ICU",
    roomNumber: "ICU-01",
    ratePerDay: 15000,
    amenities: ["AC", "Ventilator", "Monitor"],
    isActive: true,
  },
];

const GetRoom = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Get Rooms</h1>
        <p className="text-muted-foreground">View all rooms in the hospital</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Floor Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Room Category</TableHead>
                  <TableHead>Room Number</TableHead>
                  <TableHead>Rate/Day (₹)</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRooms.map((room, index) => (
                  <TableRow key={index}>
                    <TableCell>{room.floorName}</TableCell>
                    <TableCell>{room.departmentName}</TableCell>
                    <TableCell>{room.roomCategory}</TableCell>
                    <TableCell className="font-medium">{room.roomNumber}</TableCell>
                    <TableCell>₹{room.ratePerDay.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((amenity, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={room.isActive ? "default" : "destructive"}>
                        {room.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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

export default GetRoom;
