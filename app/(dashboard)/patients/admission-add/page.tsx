'use client';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Search, UserPlus } from "lucide-react";

const CreateAdmission = () => {
  /* ================= PATIENT ================= */
  const [isExistingPatient, setIsExistingPatient] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState("");
  const [patientFound, setPatientFound] = useState(false);

  const [patientInfo, setPatientInfo] = useState({
    phoneNumber: "",
    patientId: "",
    globalId: "",
    patientName: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });

  /* ================= ADMISSION ================= */
  const [admissionInfo, setAdmissionInfo] = useState({
    admissionDate: "",
    admissionTime: "",
    admissionType: "",
    reasonForAdmission: "",
    estimatedDischargeDate: "",
    advancePayment: "",
  });

  /* ================= BED ================= */
  const [bedInfo, setBedInfo] = useState({
    doctorName: "",
    specialization: "",
    remark: "",
    bedId: "",
    roomId: "",
    roomName: "",
    floor: "",
    department: "",
    roomType: "",
    roomRate: "",
    dateIn: "",
    assignmentType: "",
    dailyRate: "",
  });

  /* ================= SEARCH PATIENT ================= */
  const handleSearchPatient = () => {
    if (phoneSearch === "9876543210") {
      setPatientFound(true);
      setPatientInfo({
        phoneNumber: phoneSearch,
        patientId: "PAT001",
        globalId: "GLB001",
        patientName: "John Doe",
        emergencyContactName: "Jane Doe",
        emergencyContactNumber: "9876543211",
      });
      toast({ title: "Patient Found", description: "Details loaded" });
    } else {
      toast({
        title: "Patient Not Found",
        description: "No patient exists",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Admission Created",
      description: "Patient admission created successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Admission</h1>
        <p className="text-muted-foreground">
          Add new or existing patient admission
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= PATIENT INFO ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Patient Info
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Toggle */}
            <div className="flex items-center gap-3">
              <span className={!isExistingPatient ? "font-semibold" : "text-muted-foreground"}>
                New Patient
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsExistingPatient(!isExistingPatient);
                  setPatientFound(false);
                  setPhoneSearch("");
                }}
                className={`relative w-12 h-6 rounded-full ${
                  isExistingPatient ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
                    isExistingPatient ? "translate-x-6" : ""
                  }`}
                />
              </button>
              <span className={isExistingPatient ? "font-semibold" : "text-muted-foreground"}>
                Existing Patient
              </span>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                {!isExistingPatient ? (
                  <Input
                    value={patientInfo.phoneNumber}
                    onChange={(e) =>
                      setPatientInfo({ ...patientInfo, phoneNumber: e.target.value })
                    }
                  />
                ) : (
                  <div className="relative">
                    <Input
                      value={phoneSearch}
                      onChange={(e) => setPhoneSearch(e.target.value)}
                      placeholder="Search by phone..."
                      className="pr-9"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={handleSearchPatient}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Patient ID</Label>
                <Input value={patientInfo.patientId} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Global ID</Label>
                <Input value={patientInfo.globalId} readOnly />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                placeholder="Patient Name"
                value={patientInfo.patientName}
                readOnly={isExistingPatient}
                onChange={(e) =>
                  setPatientInfo({ ...patientInfo, patientName: e.target.value })
                }
              />
              <Input
                placeholder="Emergency Contact Name"
                value={patientInfo.emergencyContactName}
                readOnly={isExistingPatient}
                onChange={(e) =>
                  setPatientInfo({
                    ...patientInfo,
                    emergencyContactName: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Emergency Contact Number"
                value={patientInfo.emergencyContactNumber}
                readOnly={isExistingPatient}
                onChange={(e) =>
                  setPatientInfo({
                    ...patientInfo,
                    emergencyContactNumber: e.target.value,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

       {/* Admission Info */}
        <Card>
          <CardHeader>
            <CardTitle>Admission Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={admissionInfo.admissionDate}
                  onChange={(e) => setAdmissionInfo({ ...admissionInfo, admissionDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admissionTime">Admission Time</Label>
                <Input
                  id="admissionTime"
                  type="time"
                  value={admissionInfo.admissionTime}
                  onChange={(e) => setAdmissionInfo({ ...admissionInfo, admissionTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admissionType">Admission Type</Label>
                <Select value={admissionInfo.admissionType} onValueChange={(value) => setAdmissionInfo({ ...admissionInfo, admissionType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reasonForAdmission">Reason for Admission</Label>
                <Textarea
                  id="reasonForAdmission"
                  value={admissionInfo.reasonForAdmission}
                  onChange={(e) => setAdmissionInfo({ ...admissionInfo, reasonForAdmission: e.target.value })}
                  placeholder="Enter reason for admission..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedDischargeDate">Estimated Discharge Date</Label>
                <Input
                  id="estimatedDischargeDate"
                  type="date"
                  value={admissionInfo.estimatedDischargeDate}
                  onChange={(e) => setAdmissionInfo({ ...admissionInfo, estimatedDischargeDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="advancePayment">Advance Payment</Label>
                <Input
                  id="advancePayment"
                  type="number"
                  value={admissionInfo.advancePayment}
                  onChange={(e) => setAdmissionInfo({ ...admissionInfo, advancePayment: e.target.value })}
                  placeholder="Enter amount"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bed Info */}
        <Card>
          <CardHeader>
            <CardTitle>Bed Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctorName">Doctor Name</Label>
                <Input
                  id="doctorName"
                  value={bedInfo.doctorName}
                  onChange={(e) => setBedInfo({ ...bedInfo, doctorName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select value={bedInfo.specialization} onValueChange={(value) => setBedInfo({ ...bedInfo, specialization: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="general">General Medicine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="remark">Remark</Label>
                <Input
                  id="remark"
                  value={bedInfo.remark}
                  onChange={(e) => setBedInfo({ ...bedInfo, remark: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedId">Bed ID</Label>
                <Select value={bedInfo.bedId} onValueChange={(value) => setBedInfo({ ...bedInfo, bedId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BED001">BED001</SelectItem>
                    <SelectItem value="BED002">BED002</SelectItem>
                    <SelectItem value="BED003">BED003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomId">Room ID</Label>
                <Input
                  id="roomId"
                  value={bedInfo.roomId}
                  onChange={(e) => setBedInfo({ ...bedInfo, roomId: e.target.value })}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                  id="roomName"
                  value={bedInfo.roomName}
                  onChange={(e) => setBedInfo({ ...bedInfo, roomName: e.target.value })}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Select value={bedInfo.floor} onValueChange={(value) => setBedInfo({ ...bedInfo, floor: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Floor 1</SelectItem>
                    <SelectItem value="2">Floor 2</SelectItem>
                    <SelectItem value="3">Floor 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={bedInfo.department} onValueChange={(value) => setBedInfo({ ...bedInfo, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Select value={bedInfo.roomType} onValueChange={(value) => setBedInfo({ ...bedInfo, roomType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Ward</SelectItem>
                    <SelectItem value="private">Private Room</SelectItem>
                    <SelectItem value="icu">ICU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomRate">Room Rate</Label>
                <Input
                  id="roomRate"
                  value={bedInfo.roomRate}
                  onChange={(e) => setBedInfo({ ...bedInfo, roomRate: e.target.value })}
                  placeholder="Auto-filled based on room"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateIn">Date In</Label>
                <Input
                  id="dateIn"
                  type="date"
                  value={bedInfo.dateIn}
                  onChange={(e) => setBedInfo({ ...bedInfo, dateIn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignmentType">Assignment Type</Label>
                <Select value={bedInfo.assignmentType} onValueChange={(value) => setBedInfo({ ...bedInfo, assignmentType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyRate">Daily Rate</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  value={bedInfo.dailyRate}
                  onChange={(e) => setBedInfo({ ...bedInfo, dailyRate: e.target.value })}
                  placeholder="Enter daily rate"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit">Create Admission</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdmission;
