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
import { CalendarIcon, Loader2, ReceiptTextIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import axios from "axios";
import OTSlotDetailsModal from "./OTSlotDetailsModal";

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

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

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

  const openDetailsModal = (slot: OTSlot) => {
    setSelectedSlotId(slot._id);
    setDetailsOpen(true);
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
              <Label>OT ID</Label>
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
                      <Button variant="ghost" size="icon" onClick={() => openDetailsModal(slot)}>
                        <ReceiptTextIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <OTSlotDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        slotId={selectedSlotId}
        onUpdated={() => handleSearch()}
      />
    </div>
  );
};

export default GetOTSlot;