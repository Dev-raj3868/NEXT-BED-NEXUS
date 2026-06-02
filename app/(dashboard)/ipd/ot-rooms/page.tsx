'use client';

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
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
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OTRoom {
  _id: string;
  ot_name?: string;
  floor?: string;
  floor_id?: string;
  cost_per_day?: number;
  cost_per_hour?: number;
  status?: string;
}

const GetOTRoom = () => {
  const CLINIC_ID = "clinic001";
  const [rooms, setRooms] = useState<OTRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(rooms.length / itemsPerPage);

  const currentRooms = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return rooms.slice(indexOfFirstItem, indexOfLastItem);
  }, [rooms, currentPage]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ot-modules/get_ot_rooms`,
        { clinic_id: CLINIC_ID },
        { withCredentials: true }
      );
      console.log("OT Rooms response:", response.data);
      if (response.data?.resSuccess !== 1) {
        toast({
          title: "Error",
          description: response.data?.resMessage || "Failed to fetch OT rooms.",
          variant: "destructive",
        });
        setRooms([]);
        return;
      }

      setRooms(response.data?.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to fetch OT rooms.",
        variant: "destructive",
      });
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Active</Badge>;
      case "Inactive":
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">Inactive</Badge>;
      case "Under Maintenance":
        return <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">Under Maintenance</Badge>;
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading OT rooms...</p>
            </div>
          ) : (
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
                {currentRooms.length > 0 ? (
                  currentRooms.map((room) => (
                    <TableRow key={room._id}>
                      <TableCell className="font-medium">{room.ot_name || '-'}</TableCell>
                      <TableCell>{room.floor || room.floor_id || '-'}</TableCell>
                      <TableCell>
                        {typeof room.cost_per_day === 'number' ? `₹${room.cost_per_day.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell>
                        {typeof room.cost_per_hour === 'number' ? `₹${room.cost_per_hour.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(room.status || '-') }</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No OT rooms found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {!loading && totalPages > 1 && (
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
