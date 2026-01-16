'use client';

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
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

// Updated Interface to match your backend response
interface Room {
  _id: string;
  floor_name: string;
  department_name: string;
  room_category: string;
  room_number: string;
  rate_per_day: number;
  amenities: string[];
  isActive?: boolean;
}

const GetRoom = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_rooms`,
        { clinic_id: "clinic123" },
        { withCredentials: true }
      );

      console.log("Fetched Rooms Response:", response.data);

      if (response.data.resSuccess === 1) {
        // Assuming data is in response.data.data
        setRooms(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = rooms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rooms.length / itemsPerPage);

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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading rooms...</p>
            </div>
          ) : (
            <>
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
                    {currentRooms.length > 0 ? (
                      currentRooms.map((room) => (
                        <TableRow key={room._id}>
                          <TableCell>{room.floor_name || "N/A"}</TableCell>
                          <TableCell>{room.department_name}</TableCell>
                          <TableCell className="capitalize">{room.room_category.replace(/-/g, ' ')}</TableCell>
                          <TableCell className="font-medium">{room.room_number}</TableCell>
                          <TableCell>₹{room.rate_per_day?.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {room.amenities?.map((amenity, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={room.isActive !== false ? "default" : "destructive"}>
                              {room.isActive !== false ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          No rooms found for this clinic.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {rooms.length > itemsPerPage && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(p => Math.max(1, p - 1));
                          }} 
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>{currentPage}</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(p => p + 1);
                          }} 
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GetRoom;