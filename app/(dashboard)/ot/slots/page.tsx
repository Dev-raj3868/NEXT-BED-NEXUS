'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, Loader2, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface OTSlot {
  _id: string;
  booking_id: string;
  ot_name: string;
  doctor_name: string;
  status: string;
  slot_date: string;
  surgery_type: string;
  procedure_name: string;
  slot_start_time: string;
  slot_end_time: string;
  patient_id: {
    patient_name: string;
    age: number;
    gender: string;
  };
}

const GetOTSlot = () => {
  const [searchData, setSearchData] = useState({ bookingId: "", otId: "" });
  const [dateOfOT, setDateOfOT] = useState<Date>();
  const [slots, setSlots] = useState<OTSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Full Edit Modal States
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<OTSlot | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<OTSlot>>({});

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setShowResults(true);
    try {
      const payload = {
        hospital_id: "clinic001",
        date: dateOfOT ? format(dateOfOT, "yyyy-MM-dd") : "",
        booking_id: searchData.bookingId,
        ot_id: searchData.otId,
      };
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/ot-modules/get_ot_slots`,
        payload,
      {
        withCredentials: true
      });
      console.log("OT Slots Response:", response.data);
      if (response.data.resSuccess === 1) setSlots(response.data.data || []);
    } catch (error) {
      console.error("Error fetching OT slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (slot: OTSlot) => {
    setSelectedSlot(slot);
    setEditFormData({
      ot_name: slot.ot_name,
      doctor_name: slot.doctor_name,
      surgery_type: slot.surgery_type,
      procedure_name: slot.procedure_name,
      slot_date: slot.slot_date,
      slot_start_time: slot.slot_start_time,
      slot_end_time: slot.slot_end_time,
      status: slot.status
    });
    setIsUpdateOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedSlot) return;
    setUpdateLoading(true);
    try {
      const payload = {
        bookingId: selectedSlot.booking_id,
        updateData: editFormData // Sending the partial data object
      };

      console.log("Update Payload:", payload);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ot-modules/update_ot_slots`, 
        payload, 
        { withCredentials: true }
      );

      console.log("Update Response:", response.data);
      if (response.data.resSuccess === 1) {
        toast({ title: "Updated", description: "OT slot details updated successfully." });
        setIsUpdateOpen(false);
        handleSearch(); // Refresh list
      }
    } catch (error) {
      toast({ title: "Error", description: "Update failed.", variant: "destructive" });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">OT Slot Management</h1>
          <p className="text-muted-foreground">View and edit operating theatre schedules</p>
        </div>
      </div>

      {/* --- Search Filters --- */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Booking ID</Label>
              <Input value={searchData.bookingId} onChange={(e) => setSearchData({ ...searchData, bookingId: e.target.value })} placeholder="OTB-..." />
            </div>
            <div className="space-y-2">
              <Label>OT Name</Label>
              <Input value={searchData.otId} onChange={(e) => setSearchData({ ...searchData, otId: e.target.value })} placeholder="Enter OT" />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start"><CalendarIcon className="mr-2 h-4 w-4" /> {dateOfOT ? format(dateOfOT, "PPP") : "Select date"}</Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateOfOT} onSelect={setDateOfOT} /></PopoverContent>
              </Popover>
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Search"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowResults(false)}>Reset</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* --- Results Table --- */}
      {showResults && (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>OT / Doctor</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Date / Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow key={slot._id}>
                    <TableCell className="font-mono text-xs">{slot.booking_id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{slot.ot_name}</div>
                      <div className="text-xs text-muted-foreground">{slot.doctor_name}</div>
                    </TableCell>
                    <TableCell>{slot.patient_id?.patient_name}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{slot.procedure_name}</TableCell>
                    <TableCell>
                      <div className="text-xs">{format(new Date(slot.slot_date), "dd MMM")}</div>
                      <div className="text-[10px] text-muted-foreground">{slot.slot_start_time} - {slot.slot_end_time}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{slot.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openUpdateModal(slot)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* --- Full Edit Modal --- */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update OT Slot Details</DialogTitle>
            <DialogDescription>Modify any field for Booking ID: {selectedSlot?.booking_id}</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>OT Name</Label>
              <Input value={editFormData.ot_name} onChange={(e) => setEditFormData({...editFormData, ot_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Doctor Name</Label>
              <Input value={editFormData.doctor_name} onChange={(e) => setEditFormData({...editFormData, doctor_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Surgery Type</Label>
              <Select 
                value={editFormData.surgery_type} 
                onValueChange={(v) => setEditFormData({ ...editFormData, surgery_type: v })}
              >
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Procedure Name</Label>
              <Input value={editFormData.procedure_name} onChange={(e) => setEditFormData({...editFormData, procedure_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Slot Date</Label>
              <Input type="date" value={editFormData.slot_date} onChange={(e) => setEditFormData({...editFormData, slot_date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editFormData.status} onValueChange={(v) => setEditFormData({...editFormData, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="time" value={editFormData.slot_start_time} onChange={(e) => setEditFormData({...editFormData, slot_start_time: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input type="time" value={editFormData.slot_end_time} onChange={(e) => setEditFormData({...editFormData, slot_end_time: e.target.value})} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateLoading}>
              {updateLoading ? <Loader2 className="animate-spin" /> : "Save All Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetOTSlot;