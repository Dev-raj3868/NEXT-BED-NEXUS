import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const AddOTSlot = () => {
  const [formData, setFormData] = useState({
    admissionId: "",
    patientId: "",
    patientName: "",
    phoneNumber: "",
    otId: "",
    surgeonId: "",
    surgeryType: "",
    procedureName: "",
    slotStartTime: "",
    slotEndTime: "",
  });
  const [slotDate, setSlotDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OT Slot data:", { ...formData, slotDate });
    toast({
      title: "Success",
      description: "OT Slot added successfully!",
    });
    setFormData({
      admissionId: "",
      patientId: "",
      patientName: "",
      phoneNumber: "",
      otId: "",
      surgeonId: "",
      surgeryType: "",
      procedureName: "",
      slotStartTime: "",
      slotEndTime: "",
    });
    setSlotDate(undefined);
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
              <div className="space-y-2">
                <Label htmlFor="admissionId">Admission ID</Label>
                <Input
                  id="admissionId"
                  value={formData.admissionId}
                  onChange={(e) => setFormData({ ...formData, admissionId: e.target.value })}
                  placeholder="Enter admission ID"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  placeholder="Enter patient ID"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="Enter patient name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otId">OT ID</Label>
                <Select
                  value={formData.otId}
                  onValueChange={(value) => setFormData({ ...formData, otId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select OT" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OT-1">OT-1</SelectItem>
                    <SelectItem value="OT-2">OT-2</SelectItem>
                    <SelectItem value="OT-3">OT-3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="surgeonId">Surgeon ID</Label>
                <Input
                  id="surgeonId"
                  value={formData.surgeonId}
                  onChange={(e) => setFormData({ ...formData, surgeonId: e.target.value })}
                  placeholder="Enter surgeon ID"
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
                    <SelectValue placeholder="Select surgery type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="major">Major Surgery</SelectItem>
                    <SelectItem value="minor">Minor Surgery</SelectItem>
                    <SelectItem value="emergency">Emergency Surgery</SelectItem>
                    <SelectItem value="elective">Elective Surgery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedureName">Procedure Name</Label>
                <Input
                  id="procedureName"
                  value={formData.procedureName}
                  onChange={(e) => setFormData({ ...formData, procedureName: e.target.value })}
                  placeholder="Enter procedure name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Slot Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !slotDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {slotDate ? format(slotDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={slotDate}
                      onSelect={setSlotDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slotStartTime">Slot Start Time</Label>
                <Input
                  id="slotStartTime"
                  type="time"
                  value={formData.slotStartTime}
                  onChange={(e) => setFormData({ ...formData, slotStartTime: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slotEndTime">Slot End Time</Label>
                <Input
                  id="slotEndTime"
                  type="time"
                  value={formData.slotEndTime}
                  onChange={(e) => setFormData({ ...formData, slotEndTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Add OT Slot
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddOTSlot;
