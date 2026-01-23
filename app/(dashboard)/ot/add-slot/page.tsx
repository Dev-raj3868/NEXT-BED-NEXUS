'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const AddOTSlot = () => {
  const CLINIC_ID = "clinic001";
  const [loading, setLoading] = useState(false);
  
  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    admissionId: "",
    patientId: "",
    patientName: "",
    phoneNumber: "",
    otId: "",
    otName: "",
    doctorName: "",
    doctorId: "",
    surgeryType: "",
    procedureName: "",
    slotStartTime: "",
    slotEndTime: "",
  });
  const [slotDate, setSlotDate] = useState<Date>();

  /* ---------------- SUGGESTIONS STATE ---------------- */
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* ---------------- SEARCH PATIENTS ---------------- */
  useEffect(() => {
    const getSuggestions = async () => {
      if (formData.patientName.length < 3) return;
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/name-suggestion-patient-information`, {
          patient_name: formData.patientName,
          clinic_id: CLINIC_ID
        }, { withCredentials: true });
        if (res.data.resSuccess === 1) {
          setSuggestions(res.data.data);
          setShowSuggestions(true);
        }
      } catch (err) { console.error(err); }
    };
    const timeout = setTimeout(getSuggestions, 500);
    return () => clearTimeout(timeout);
  }, [formData.patientName]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotDate) {
      toast({ title: "Error", description: "Please select a slot date", variant: "destructive" });
      return;
    }

    setLoading(true);

    const payload = {
      booking_id: `OTB-${format(new Date(), "yyyyMMdd")}-${Math.floor(1000 + Math.random() * 9000)}`,
      admission_id: formData.admissionId,
      doctor_name: formData.doctorName,
      patient_id: formData.patientId,
      ot_id: formData.otId,
      ot_name: formData.otName,
      doctor_id: formData.doctorId,
      surgery_type: formData.surgeryType,
      procedure_name: formData.procedureName,
      slot_date: format(slotDate, "yyyy-MM-dd"),
      slot_start_time: formData.slotStartTime,
      slot_end_time: formData.slotEndTime,
      authorized_by: "Admin"
    };

    console.log("Submitting OT Slot Payload:", payload);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ot-modules/add_ot_slots`,
        payload,
        { withCredentials: true }
      );

      console.log("OT Slot Response:", response.data);

      if (response.data.resSuccess === 1) {
        toast({ title: "Success", description: "OT Slot added successfully!" });
        // Reset Form
        setFormData({
          admissionId: "", patientId: "", patientName: "", phoneNumber: "",
          otId: "", otName: "", doctorName: "", doctorId: "",
          surgeryType: "", procedureName: "", slotStartTime: "", slotEndTime: "",
        });
        setSlotDate(undefined);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast({ title: "Error", description: "Failed to add OT Slot", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add OT Slot</h1>
        <p className="text-muted-foreground">Schedule a new operating theatre slot</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-lg">OT Slot Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2 relative">
                <Label>Patient Name (Search)</Label>
                <Input
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="Type name to search..."
                  required
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
                    {suggestions.map((p) => (
                      <div key={p._id} className="p-2 hover:bg-slate-100 cursor-pointer text-sm" onClick={() => {
                        setFormData({
                          ...formData,
                          patientName: p.patient_name,
                          patientId: p._id,
                          phoneNumber: p.phone_number,
                          admissionId: p.current_admission_id || "" // Assuming admission ID comes from patient info
                        });
                        setShowSuggestions(false);
                      }}>
                        {p.patient_name} ({p.phone_number})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionId">Admission ID</Label>
                <Input
                  id="admissionId"
                  value={formData.admissionId}
                  onChange={(e) => setFormData({ ...formData, admissionId: e.target.value })}
                  placeholder="Admission ID"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otId">Operating Theatre</Label>
                <Select
                  value={formData.otId}
                  onValueChange={(value) => {
                    const otNames: Record<string, string> = { "6965d76f750616a95352d4c2": "First OT", "ot2": "Second OT" };
                    setFormData({ ...formData, otId: value, otName: otNames[value] });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select OT" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6965d76f750616a95352d4c2">First OT</SelectItem>
                    <SelectItem value="ot2">Second OT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorName">Surgeon Name</Label>
                <Input
                  id="doctorName"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value, doctorId: "DOC-" + e.target.value.substring(0,3).toUpperCase() })}
                  placeholder="Enter surgeon name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="surgeryType">Surgery Type</Label>
                <Select
                  value={formData.surgeryType}
                  onValueChange={(value) => setFormData({ ...formData, surgeryType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Minor">Minor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedureName">Procedure Name</Label>
                <Input
                  id="procedureName"
                  value={formData.procedureName}
                  onChange={(e) => setFormData({ ...formData, procedureName: e.target.value })}
                  placeholder="e.g. Laparoscopic Appendectomy"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Slot Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !slotDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {slotDate ? format(slotDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={slotDate} onSelect={setSlotDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="slotStartTime">Start Time</Label>
                  <Input id="slotStartTime" type="time" value={formData.slotStartTime} onChange={(e) => setFormData({ ...formData, slotStartTime: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slotEndTime">End Time</Label>
                  <Input id="slotEndTime" type="time" value={formData.slotEndTime} onChange={(e) => setFormData({ ...formData, slotEndTime: e.target.value })} required />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Schedule OT Slot"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddOTSlot;