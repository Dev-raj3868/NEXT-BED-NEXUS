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

interface Room {
  _id: string;
  floor_name: string;
  floor_id?: string;
  department_name: string;
  department_id?: string;
  room_category: string;
  room_number: string;
  rate_per_day: number;
  amenities: string[];
  is_active?: boolean;
}

const GetRoom = () => {
  const { toast } = useToast();
  const CLINIC_ID = "clinic001";
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Master data for editing
  const [floors, setFloors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  // Edit Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Room>>({});

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_rooms`,
        { clinic_id: CLINIC_ID },
        { withCredentials: true }
      );
      if (response.data.resSuccess === 1) setRooms(response.data.data || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const [fRes, dRes] = await Promise.all([
        axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_floors`,{}, { withCredentials: true }),
        axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_departments`, { clinic_id: CLINIC_ID }, { withCredentials: true })
      ]);
      if (fRes.data.resSuccess === 1) setFloors(fRes.data.data);
      if (dRes.data.resSuccess === 1) setDepartments(dRes.data.data);
    } catch (err) { console.error("Master data fetch error", err); }
  };

  useEffect(() => {
    fetchRooms();
    fetchMasterData();
  }, []);

  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setEditFormData({
      room_number: room.room_number,
      room_category: room.room_category,
      rate_per_day: room.rate_per_day,
      floor_id: room.floor_id,
      department_id: room.department_id,
      is_active: room.is_active ?? true,
      amenities: room.amenities || []
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedRoom) return;
    setUpdateLoading(true);
    
    // Find the department name for the selected ID
    const dept = departments.find(d => d._id === editFormData.department_id);

    try {
      const payload = {
        room_id: selectedRoom._id,
        hospital_id: CLINIC_ID,
        ...editFormData,
        department_name: dept?.name || selectedRoom.department_name,
        rate_per_day: Number(editFormData.rate_per_day)
      };

      console.log("Update Payload:", payload);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/update_rooms`, 
        payload, 
        { withCredentials: true }
      );

      console.log("Update Response:", res.data);
      if (res.data.resSuccess === 1) {
        toast({ title: "Room Updated", description: "Details saved successfully." });
        setIsEditOpen(false);
        fetchRooms();
      } else {
        toast({ title: "Update Failed", description: res.data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not connect to server.", variant: "destructive" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const totalPages = Math.ceil(rooms.length / itemsPerPage);
  const currentRooms = rooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Room Management</h1>
          <p className="text-muted-foreground">Monitor and update hospital rooms</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room No.</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rate/Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRooms.map((room) => (
                    <TableRow key={room._id}>
                      <TableCell className="font-medium">{room.room_number}</TableCell>
                      <TableCell>{room.floor_name || "N/A"}</TableCell>
                      <TableCell>{room.department_name}</TableCell>
                      <TableCell className="capitalize">{room.room_category.replace(/-/g, ' ')}</TableCell>
                      <TableCell>₹{room.rate_per_day?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={room.is_active !== false ? "default" : "destructive"}>
                          {room.is_active !== false ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(room)}>
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

      {/* --- Full Edit Modal --- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Room Details</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Room Number</Label>
              <Input value={editFormData.room_number} onChange={(e) => setEditFormData({...editFormData, room_number: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={editFormData.room_category} onValueChange={(v) => setEditFormData({...editFormData, room_category: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general-ward">General Ward</SelectItem>
                  <SelectItem value="private-bed-1">Private Bed</SelectItem>
                  <SelectItem value="semi-private">Semi-Private</SelectItem>
                  <SelectItem value="icu">ICU</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Floor</Label>
              <Select value={editFormData.floor_id} onValueChange={(v) => setEditFormData({...editFormData, floor_id: v})}>
                <SelectTrigger><SelectValue placeholder="Select Floor" /></SelectTrigger>
                <SelectContent>
                  {floors.map(f => <SelectItem key={f._id} value={f._id}>{f.floor_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={editFormData.department_id} onValueChange={(v) => setEditFormData({...editFormData, department_id: v})}>
                <SelectTrigger><SelectValue placeholder="Select Dept" /></SelectTrigger>
                <SelectContent>
                  {departments.map(d => <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rate Per Day (₹)</Label>
              <Input type="number" value={editFormData.rate_per_day} onChange={(e) => setEditFormData({...editFormData, rate_per_day: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editFormData.is_active ? "true" : "false"} onValueChange={(v) => setEditFormData({...editFormData, is_active: v === "true"})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateLoading}>
              {updateLoading ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetRoom;