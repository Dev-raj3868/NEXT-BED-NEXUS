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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2, Edit2, Save } from "lucide-react";

interface Bed {
  _id: string;
  room_id: {
    _id: string;
    department_name: string;
    room_category: string;
    room_number: string;
  };
  bed_number: string;
  position?: string;
  status: string;
  features?: string[];
}

const getStatusVariant = (status: string) => {
  switch (status?.toUpperCase()) {
    case "AVAILABLE": return "default";
    case "OCCUPIED": return "secondary";
    case "MAINTENANCE": return "destructive";
    case "CLEANING": return "outline";
    default: return "outline";
  }
};

const GetBed = () => {
  const { toast } = useToast();
  const CLINIC_ID = "clinic001";

  const [beds, setBeds] = useState<Bed[]>([]);
  const [rooms, setRooms] = useState<any[]>([]); // To allow moving beds between rooms
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Edit States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_beds`,
        { clinic_id: CLINIC_ID },
        { withCredentials: true }
      );
      console.log("Beds Response:", response.data);
      if (response.data.resSuccess === 1) setBeds(response.data.data || []);
    } catch (error) {
      console.error("Error fetching beds:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_rooms`,
        { clinic_id: CLINIC_ID },
        { withCredentials: true }
      );
      if (res.data.resSuccess === 1) setRooms(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchBeds();
    fetchRooms();
  }, []);

  const openEditModal = (bed: Bed) => {
    setSelectedBed(bed);
    setEditFormData({
      bed_number: bed.bed_number,
      position: bed.position || "",
      status: bed.status,
      room_id: bed.room_id?._id,
      features: bed.features || []
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedBed) return;
    setUpdateLoading(true);

    try {
      const payload = {
        bed_id: selectedBed._id,
        clinic_id: CLINIC_ID,
        ...editFormData
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/update_beds`,
        payload,
        { withCredentials: true }
      );

      if (res.data.resSuccess === 1) {
        toast({ title: "Bed Updated", description: "Changes saved successfully." });
        setIsEditOpen(false);
        fetchBeds(); // Refresh list
      } else {
        toast({ title: "Update Failed", description: res.data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Server connection failed.", variant: "destructive" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const totalPages = Math.ceil(beds.length / itemsPerPage);
  const currentBeds = beds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bed Management</h1>
          <p className="text-muted-foreground">Monitor and edit hospital bed assignments</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room No.</TableHead>
                    <TableHead>Dept / Category</TableHead>
                    <TableHead>Bed No.</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBeds.map((bed) => (
                    <TableRow key={bed._id}>
                      <TableCell className="font-medium">{bed.room_id?.room_number || "N/A"}</TableCell>
                      <TableCell>
                        <div className="text-xs">{bed.room_id?.department_name}</div>
                        <div className="text-[10px] text-muted-foreground capitalize">{bed.room_id?.room_category?.replace(/-/g, ' ')}</div>
                      </TableCell>
                      <TableCell className="font-bold">{bed.bed_number}</TableCell>
                      <TableCell>{bed.position || "Not Set"}</TableCell>
                      <TableCell><Badge variant={getStatusVariant(bed.status)}>{bed.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(bed)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} />
                      </PaginationItem>
                      <PaginationItem><PaginationLink isActive>{currentPage}</PaginationLink></PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* --- Bed Edit Modal --- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Bed: {selectedBed?.bed_number}</DialogTitle></DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Room Assignment</Label>
              <Select value={editFormData.room_id} onValueChange={(v) => setEditFormData({...editFormData, room_id: v})}>
                <SelectTrigger><SelectValue placeholder="Select Room" /></SelectTrigger>
                <SelectContent>
                  {rooms.map(r => (
                    <SelectItem key={r._id} value={r._id}>Room {r.room_number} ({r.department_name})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bed Number</Label>
                <Input value={editFormData.bed_number} onChange={(e) => setEditFormData({...editFormData, bed_number: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input value={editFormData.position} onChange={(e) => setEditFormData({...editFormData, position: e.target.value})} placeholder="e.g. Window Side" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bed Status</Label>
              <Select value={editFormData.status} onValueChange={(v) => setEditFormData({...editFormData, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="OCCUPIED">Occupied</SelectItem>
                  <SelectItem value="RESERVED">Reserved</SelectItem>
                  <SelectItem value="CLEANING">Cleaning</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateLoading}>
              {updateLoading ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4 mr-2" />Update Bed</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetBed;