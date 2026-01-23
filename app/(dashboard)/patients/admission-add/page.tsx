'use client';

import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, UserPlus } from "lucide-react";
import axios from "axios";

const CreateAdmission = () => {
  const { toast } = useToast();
  const CLINIC_ID = "clinic001";

  /* ================= MASTER DATA STATES ================= */
  const [floors, setFloors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= PATIENT SEARCH STATES ================= */
  const [isExistingPatient, setIsExistingPatient] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [searchName, setSearchName] = useState("");
  const [phoneSuggestions, setPhoneSuggestions] = useState<any[]>([]);
  const [nameSuggestions, setNameSuggestions] = useState<any[]>([]);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [showNameDropdown, setShowNameDropdown] = useState(false);

  /* ================= FORM STATES ================= */
  const [patientInfo, setPatientInfo] = useState({
    phoneNumber: "",
    patientId: "",
    globalId: "",
    patientName: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });

  const [admissionInfo, setAdmissionInfo] = useState({
    admissionDate: "",
    admissionTime: "",
    admissionType: "",
    reasonForAdmission: "",
    estimatedDischargeDate: "",
    advancePayment: "",
  });

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
    assignmentType: "Admission",
    dailyRate: "",
  });

  /* ================= FETCH INITIAL DATA ================= */
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [floorRes, deptRes, roomRes] = await Promise.all([
          axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_floors`, {}, { withCredentials: true }),
          axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_departments`, { clinic_id: CLINIC_ID }, { withCredentials: true }),
          axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_rooms`, { clinic_id: CLINIC_ID }, { withCredentials: true })
        ]);
        console.log("Base Data:", floorRes.data, deptRes.data, roomRes.data);
        if (floorRes.data.resSuccess === 1) setFloors(floorRes.data.data);
        if (deptRes.data.resSuccess === 1) setDepartments(deptRes.data.data);
        if (roomRes.data.resSuccess === 1) setRooms(roomRes.data.data);
      } catch (err) { console.error("Data fetch error", err); }
    };
    fetchBaseData();
  }, []);

  /* ================= PATIENT SUGGESTIONS ================= */
  const fetchPatientSuggestions = async (query: string, type: 'phone' | 'name') => {
    if (query.length < 3) return;
    try {
      const payload = type === 'phone' ? { phone_number: query, clinic_id: CLINIC_ID } : { patient_name: query, clinic_id: CLINIC_ID };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/name-suggestion-patient-information`, payload, { withCredentials: true });
      if (res.data.resSuccess === 1) {
        if (type === 'phone') { setPhoneSuggestions(res.data.data); setShowPhoneDropdown(true); }
        else { setNameSuggestions(res.data.data); setShowNameDropdown(true); }
      }
    } catch (err) { console.error(err); }
  };

  /* ================= DEPENDENT LOGIC ================= */
  const onFloorChange = (floorId: string) => {
    setBedInfo({ ...bedInfo, floor: floorId, roomId: "", bedId: "" });
    // setFilteredRooms(rooms.filter(r => r.floor_id === floorId));
    setFilteredRooms(rooms);
  };

  const onRoomChange = async (roomId: string) => {
    const selectedRoom = rooms.find(r => r._id === roomId);
    setBedInfo({ 
      ...bedInfo, roomId, 
      roomName: selectedRoom?.room_number || "",
      roomType: selectedRoom?.room_category || "",
      roomRate: selectedRoom?.rate_per_day || "",
      dailyRate: selectedRoom?.rate_per_day || ""
    });

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_beds`, { clinic_id: CLINIC_ID, room_id: roomId }, { withCredentials: true });
      if (res.data.resSuccess === 1) {
        console.log("Beds Data:", res.data.data);
        // setBeds(res.data.data.filter((b: any) => b.status === "AVAILABLE"));
        setBeds(res.data.data);
      }
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      patient_id: patientInfo.patientId,
      global_id: patientInfo.globalId,
      admission_date: admissionInfo.admissionDate ? new Date(admissionInfo.admissionDate).toISOString() : null,
      admission_time: admissionInfo.admissionTime,
      admission_type: admissionInfo.admissionType,
      patient_name: patientInfo.patientName,
      phone_number: patientInfo.phoneNumber || searchPhone,
      reason_For_Admission: admissionInfo.reasonForAdmission,
      admission_doctor_id: "DR-123",
      doctor_name: bedInfo.doctorName,
      specialization: bedInfo.specialization,
      initial_department: bedInfo.department,
      estimated_discharge_date: admissionInfo.estimatedDischargeDate ? new Date(admissionInfo.estimatedDischargeDate).toISOString() : null,
      emergency_contact_name: patientInfo.emergencyContactName,
      emergency_contact_number: patientInfo.emergencyContactNumber,
      advance_Payment: Number(admissionInfo.advancePayment),
      remark: bedInfo.remark,
      created_by: "STAFF-456",
      bed_id: bedInfo.bedId,
      room_id: bedInfo.roomId,
      room_name: bedInfo.roomName,
      floor: bedInfo.floor,
      department: bedInfo.department,
      room_type: bedInfo.roomType,
      room_rate: Number(bedInfo.roomRate),
      date_in: bedInfo.dateIn ? new Date(bedInfo.dateIn).toISOString() : null,
      assignment_type: bedInfo.assignmentType,
      daily_rate: Number(bedInfo.dailyRate),
      authorized_by: "DR-123",
      clinic_id: CLINIC_ID
    };

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/admissionAndBeds/create_admission`,
        payload,
        {
          withCredentials: true
        });
        console.log("Create Admission Response:", res.data);
      if (res.data.resSuccess === 1) toast({ title: "Admission Created" });
    } catch (error) { 
      toast({ title: "Error", variant: "destructive" });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create Admission</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= PATIENT INFO ================= */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Patient Info</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <span className={!isExistingPatient ? "font-semibold" : "text-muted-foreground"}>New Patient</span>
              <button type="button" onClick={() => setIsExistingPatient(!isExistingPatient)} className={`relative w-12 h-6 rounded-full ${isExistingPatient ? "bg-green-500" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${isExistingPatient ? "translate-x-6" : ""}`} />
              </button>
              <span className={isExistingPatient ? "font-semibold" : "text-muted-foreground"}>Existing Patient</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 relative">
                <Label>Phone Number</Label>
                <Input value={isExistingPatient ? searchPhone : patientInfo.phoneNumber} onChange={(e) => {
                  const v = e.target.value;
                  isExistingPatient ? setSearchPhone(v) : setPatientInfo({...patientInfo, phoneNumber: v});
                  if(isExistingPatient) fetchPatientSuggestions(v, 'phone');
                }} />
                {isExistingPatient && showPhoneDropdown && phoneSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
                    {phoneSuggestions.map(p => (
                      <div key={p._id} className="p-2 hover:bg-slate-100 cursor-pointer text-sm" onClick={() => {
                        setPatientInfo({ patientName: p.patient_name, phoneNumber: p.phone_number, patientId: p._id, globalId: p.global_id || p._id, emergencyContactName: p.emergency_contact_name || "", emergencyContactNumber: p.emergency_contact_number || "" });
                        setSearchPhone(p.phone_number); setSearchName(p.patient_name); setShowPhoneDropdown(false);
                      }}>{p.phone_number} - {p.patient_name}</div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2 relative">
                <Label>Patient Name</Label>
                <Input value={isExistingPatient ? searchName : patientInfo.patientName} onChange={(e) => {
                  const v = e.target.value;
                  isExistingPatient ? setSearchName(v) : setPatientInfo({...patientInfo, patientName: v});
                  if(isExistingPatient) fetchPatientSuggestions(v, 'name');
                }} />
                {isExistingPatient && showNameDropdown && nameSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
                    {nameSuggestions.map(p => (
                      <div key={p._id} className="p-2 hover:bg-slate-100 cursor-pointer text-sm" onClick={() => {
                        setPatientInfo({ patientName: p.patient_name, phoneNumber: p.phone_number, patientId: p._id, globalId: p.global_id || p._id, emergencyContactName: p.emergency_contact_name || "", emergencyContactNumber: p.emergency_contact_number || "" });
                        setSearchName(p.patient_name); setSearchPhone(p.phone_number); setShowNameDropdown(false);
                      }}>{p.patient_name} ({p.phone_number})</div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2"><Label>Patient ID</Label><Input value={patientInfo.patientId} readOnly /></div>
              <div className="space-y-2"><Label>Global ID</Label><Input value={patientInfo.globalId} readOnly /></div>
              <div className="space-y-2"><Label>Emergency Contact</Label><Input value={patientInfo.emergencyContactName} onChange={(e) => setPatientInfo({...patientInfo, emergencyContactName: e.target.value})} readOnly={isExistingPatient} /></div>
              <div className="space-y-2"><Label>Emergency Number</Label><Input value={patientInfo.emergencyContactNumber} onChange={(e) => setPatientInfo({...patientInfo, emergencyContactNumber: e.target.value})} readOnly={isExistingPatient} /></div>
            </div>
          </CardContent>
        </Card>

        {/* ================= ADMISSION INFO ================= */}
        <Card>
          <CardHeader><CardTitle>Admission Info</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Admission Date</Label><Input type="date" value={admissionInfo.admissionDate} onChange={(e) => setAdmissionInfo({...admissionInfo, admissionDate: e.target.value})} /></div>
            <div className="space-y-2"><Label>Admission Time</Label><Input type="time" value={admissionInfo.admissionTime} onChange={(e) => setAdmissionInfo({...admissionInfo, admissionTime: e.target.value})} /></div>
            <div className="space-y-2">
              <Label>Admission Type</Label>
              <Select onValueChange={(v) => setAdmissionInfo({...admissionInfo, admissionType: v})}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="direct_admission">Direct Admission</SelectItem><SelectItem value="referral">Referral</SelectItem><SelectItem value="transfer">Transfer</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2"><Label>Reason</Label><Textarea value={admissionInfo.reasonForAdmission} onChange={(e) => setAdmissionInfo({...admissionInfo, reasonForAdmission: e.target.value})} /></div>
            <div className="space-y-2"><Label>Est. Discharge Date</Label><Input type="date" value={admissionInfo.estimatedDischargeDate} onChange={(e) => setAdmissionInfo({...admissionInfo, estimatedDischargeDate: e.target.value})} /></div>
            <div className="space-y-2"><Label>Advance Payment</Label><Input type="number" value={admissionInfo.advancePayment} onChange={(e) => setAdmissionInfo({...admissionInfo, advancePayment: e.target.value})} /></div>
          </CardContent>
        </Card>

        {/* ================= BED INFO ================= */}
        <Card>
          <CardHeader><CardTitle>Bed Info</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Doctor Name</Label><Input value={bedInfo.doctorName} onChange={(e) => setBedInfo({...bedInfo, doctorName: e.target.value})} /></div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Select onValueChange={(v) => setBedInfo({...bedInfo, specialization: v})}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="cardiology">Cardiology</SelectItem><SelectItem value="orthopedics">Orthopedics</SelectItem><SelectItem value="neurology">Neurology</SelectItem><SelectItem value="general">General Medicine</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select onValueChange={(v) => setBedInfo({...bedInfo, department: v})}>
                <SelectTrigger><SelectValue placeholder="Select Dept" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d._id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Floor</Label>
              <Select onValueChange={onFloorChange}>
                <SelectTrigger><SelectValue placeholder="Select Floor" /></SelectTrigger>
                <SelectContent>{floors.map(f => <SelectItem key={f._id} value={f._id}>{f.floor_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Room</Label>
              <Select onValueChange={onRoomChange} disabled={!bedInfo.floor}>
                <SelectTrigger><SelectValue placeholder="Select Room" /></SelectTrigger>
                <SelectContent>{filteredRooms.map(r => <SelectItem key={r._id} value={r._id}>{r.room_number} ({r.room_category})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bed</Label>
              <Select onValueChange={(v) => setBedInfo({...bedInfo, bedId: v})} disabled={!bedInfo.roomId}>
                <SelectTrigger><SelectValue placeholder="Select Bed" /></SelectTrigger>
                <SelectContent>{beds.map(b => <SelectItem key={b._id} value={b._id}>Bed {b.bed_number}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Room Type</Label><Input value={bedInfo.roomType} readOnly /></div>
            <div className="space-y-2"><Label>Room Rate</Label><Input value={bedInfo.roomRate} readOnly /></div>
            <div className="space-y-2"><Label>Daily Rate</Label><Input type="number" value={bedInfo.dailyRate} onChange={(e) => setBedInfo({...bedInfo, dailyRate: e.target.value})} /></div>
            <div className="space-y-2"><Label>Date In</Label><Input type="date" value={bedInfo.dateIn} onChange={(e) => setBedInfo({...bedInfo, dateIn: e.target.value})} /></div>
            <div className="space-y-2">
              <Label>Assignment Type</Label>
              <Select onValueChange={(v) => setBedInfo({...bedInfo, assignmentType: v})}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="primary">Primary</SelectItem><SelectItem value="secondary">Secondary</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Remark</Label><Input value={bedInfo.remark} onChange={(e) => setBedInfo({...bedInfo, remark: e.target.value})} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin mr-2" /> : "Create Admission"}</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdmission;