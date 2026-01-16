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

// Updated Interface to match your nested response
interface Bed {
  _id: string;
  room_id: {
    _id: string;
    department_name: string;
    room_category: string;
    room_number: string;
  };
  bed_number: string;
  status: string;
}

const getStatusVariant = (status: string) => {
  switch (status?.toUpperCase()) {
    case "AVAILABLE":
      return "default";
    case "OCCUPIED":
      return "secondary";
    case "MAINTENANCE":
      return "destructive";
    default:
      return "outline";
  }
};

const GetBed = () => {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_beds`,
        { clinic_id: "clinic123" },
        { withCredentials: true }
      );

      console.log("Fetched Beds Response:", response.data);

      // Map the data correctly from the response
      if (response.data.resSuccess === 1) {
        setBeds(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching beds:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  const totalPages = Math.ceil(beds.length / itemsPerPage);
  const currentBeds = beds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room No.</TableHead>
                      <TableHead>Dept.</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Bed No.</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBeds.length > 0 ? (
                      currentBeds.map((bed) => (
                        <TableRow key={bed._id}>
                          {/* Accessing nested room_id data */}
                          <TableCell className="font-medium">
                            {bed.room_id?.room_number || "N/A"}
                          </TableCell>
                          <TableCell>{bed.room_id?.department_name}</TableCell>
                          <TableCell className="capitalize text-xs">
                            {bed.room_id?.room_category?.replace(/-/g, ' ')}
                          </TableCell>
                          <TableCell className="font-bold">{bed.bed_number}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(bed.status)}>
                              {bed.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          No beds found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {beds.length > itemsPerPage && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }} 
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>{currentPage}</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(p => p + 1); }} 
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

export default GetBed;