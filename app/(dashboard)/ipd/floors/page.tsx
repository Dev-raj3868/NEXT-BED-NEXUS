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
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react"; // For a loading spinner

// Define an interface for your Floor data
interface Floor {
  _id: string; // or id, depending on your DB
  floor_name: string;
}

const GetFloor = () => {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch floors from backend
  const fetchFloors = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_floors`, {
          clinic_id: "clinic123",
        },
        { withCredentials: true }
      );
      console.log("Fetched floors:", response.data);
      // Adjust based on your actual API response structure
      // Usually it's response.data.floors or response.data.data
      if (response.data.resSuccess === 1) {
        setFloors(response.data.data || []); 
      }
    } catch (error) {
      console.error("Error fetching floors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloors();
  }, []);

  // Simple Pagination Logic for the UI
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFloors = floors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(floors.length / itemsPerPage);

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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading floors...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Floor ID</TableHead>
                    <TableHead>Floor Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentFloors.length > 0 ? (
                    currentFloors.map((floor) => (
                      <TableRow key={floor._id}>
                        <TableCell className="font-medium">{floor._id}</TableCell>
                        <TableCell>{floor.floor_name}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4">
                        No floors found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {floors.length > itemsPerPage && (
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

export default GetFloor;