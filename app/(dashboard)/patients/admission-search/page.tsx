'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Loader2, Edit2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const ITEMS_PER_PAGE = 5;

const GetAdmission = () => {
  const { toast } = useToast();
  
  /* ---------------- SEARCH STATES ---------------- */
  const [searchPhone, setSearchPhone] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [searchAdmissionId, setSearchAdmissionId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ---------------- DATA STATES ---------------- */
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- SUGGESTIONS ---------------- */
  const [phoneSuggestions, setPhoneSuggestions] = useState<any[]>([]);
  const [nameSuggestions, setNameSuggestions] = useState<any[]>([]);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [showNameDropdown, setShowNameDropdown] = useState(false);

  /* ---------------- EDIT MODAL STATES ---------------- */
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  /* ---------------- LOGIC: FETCH SUGGESTIONS ---------------- */
  const fetchSuggestions = async (query: string, type: 'phone' | 'name') => {
    if (query.length < 3) return;
    try {
      const payload = type === 'phone' ? { phone_number: query, clinic_id: "clinic001" } : { patient_name: query, clinic_id: "clinic001" };
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/name-suggestion-patient-information`, payload, { withCredentials: true });
      if (response.data.resSuccess === 1) {
        if (type === 'phone') { setPhoneSuggestions(response.data.data || []); setShowPhoneDropdown(true); }
        else { setNameSuggestions(response.data.data || []); setShowNameDropdown(true); }
      }
    } catch (error) { console.error(error); }
  };

  /* ---------------- LOGIC: SEARCH ADMISSIONS ---------------- */
  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    setCurrentPage(1);
    console.log("Searching with:", { selectedPatientId, searchAdmissionId, fromDate, toDate });
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/admissionAndBeds/get_admission`, {
        clinic_id: "clinic001",
        patient_id: selectedPatientId || undefined,
        admission_id: searchAdmissionId || undefined,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
      }, { withCredentials: true });
      if (response.data.resSuccess === 1) setAdmissions(response.data.data || []);
    } catch (error) { toast({ title: "Error", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  /* ---------------- LOGIC: OPEN EDIT MODAL ---------------- */
  const openEditModal = (record: any) => {
    setSelectedRecord(record);
    setEditFormData({
      doctor_name: record.doctor_name,
      specialization: record.specialization,
      admission_status: record.admission_status || "admitted",
      remark: record.remark || "",
      emergency_contact_name: record.emergency_contact_name || "",
      emergency_contact_number: record.emergency_contact_number || "",
      estimated_discharge_date: record.estimated_discharge_date ? new Date(record.estimated_discharge_date).toISOString().split('T')[0] : "",
      discharge_date: "",
      discharge_time: "",
      bed_id: record.bed_id // Required for patient_tracker update in backend
    });
    setIsEditModalOpen(true);
  };

  /* ---------------- LOGIC: UPDATE ADMISSION ---------------- */
  const handleUpdateSubmission = async () => {
    setUpdateLoading(true);
    try {
      const payload = {
        hospital_id: "clinic001",
        admission_id: selectedRecord.admission_id,
        updated_by: "Admin", // Should be from auth context
        updates: { ...editFormData }
      };

      console.log("Update Payload:", payload);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/admissionAndBeds/update_admission`,
        payload,
        {
          withCredentials: true
        });

      console.log("Update Response:", res.data);
      if (res.data.resSuccess === 1) {
        toast({ title: "Updated successfully" });
        setIsEditModalOpen(false);
        handleSearch(); // Refresh table
      } else {
        toast({ title: "Update Failed", description: res.data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error connecting to server", variant: "destructive" });
    } finally { setUpdateLoading(false); }
  };

  const handleReset = () => {
    setSearchPhone(""); setSearchName(""); setSelectedPatientId(""); setSearchAdmissionId("");
    setFromDate(""); setToDate(""); setAdmissions([]); setHasSearched(false);
  };

  const totalPages = Math.ceil(admissions.length / ITEMS_PER_PAGE);
  const paginatedAdmissions = admissions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Get Admission</h1>
        <p className="text-muted-foreground">Search and manage hospital admissions</p>
      </div>

      {/* --- Search Filters --- */}
      <Card className="overflow-visible">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2 relative">
              <Label>Phone Number</Label>
              <Input placeholder="Search phone..." value={searchPhone} onChange={(e) => { setSearchPhone(e.target.value); fetchSuggestions(e.target.value, 'phone'); }} onFocus={() => setShowPhoneDropdown(true)} />
              {showPhoneDropdown && phoneSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                  {phoneSuggestions.map((p) => (
                    <div key={p._id} className="p-2 hover:bg-slate-100 cursor-pointer border-b text-sm" onClick={() => { setSearchPhone(p.phone_number); setSearchName(p.patient_name); setSelectedPatientId(p._id); setShowPhoneDropdown(false); }}>
                      <div className="font-bold">{p.phone_number}</div>
                      <div className="text-xs text-muted-foreground">{p.patient_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 relative">
              <Label>Patient Name</Label>
              <Input placeholder="Search name..." value={searchName} onFocus={() => setShowNameDropdown(true)} onChange={(e) => { setSearchName(e.target.value); fetchSuggestions(e.target.value, 'name'); }} />
              {showNameDropdown && nameSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                  {nameSuggestions.map((p) => (
                    <div key={p._id} className="p-2 hover:bg-slate-100 cursor-pointer border-b text-sm" onClick={() => { setSearchName(p.patient_name); setSearchPhone(p.phone_number); setSelectedPatientId(p._id); setShowNameDropdown(false); }}>
                      <div className="font-bold">{p.patient_name}</div>
                      <div className="text-xs text-muted-foreground">{p.phone_number}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2"><Label>Admission ID</Label><Input placeholder="ID" value={searchAdmissionId} onChange={(e) => setSearchAdmissionId(e.target.value)} /></div>
            <div className="space-y-2"><Label>From</Label><Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>To</Label><Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleReset}>Reset</Button>
            <Button onClick={handleSearch} disabled={loading}>{loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Search className="mr-2 h-4 w-4" />}Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* --- Results Table --- */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admissions.map((adm: any) => (
                <TableRow key={adm._id}>
                  <TableCell>
                    <div className="font-medium">{adm.patient_name}</div>
                    <div className="text-xs text-muted-foreground">{adm.phone_number}</div>
                  </TableCell>
                  <TableCell>{adm.doctor_name}</TableCell>
                  <TableCell>{new Date(adm.admission_date).toLocaleDateString()}</TableCell>
                  <TableCell><div className="text-xs font-semibold">{adm.room_name}</div></TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${adm.admission_status === 'discharge' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>
                      {adm.admission_status || 'Admitted'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(adm)} disabled={adm.admission_status === 'discharge'}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- Full Edit Modal --- */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Admission Details</DialogTitle>
            <DialogDescription>Admission ID: {selectedRecord?.admission_id}</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>Admission Status</Label>
              <Select value={editFormData.admission_status} onValueChange={(v) => setEditFormData({...editFormData, admission_status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admitted">Admitted</SelectItem>
                  <SelectItem value="discharge">Discharge</SelectItem>
                  <SelectItem value="advance_booking">Advance Booking</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2"><Label>Doctor Name</Label><Input value={editFormData.doctor_name} onChange={(e) => setEditFormData({...editFormData, doctor_name: e.target.value})} /></div>
            <div className="space-y-2"><Label>Specialization</Label><Input value={editFormData.specialization} onChange={(e) => setEditFormData({...editFormData, specialization: e.target.value})} /></div>
            <div className="space-y-2"><Label>Est. Discharge Date</Label><Input type="date" value={editFormData.estimated_discharge_date} onChange={(e) => setEditFormData({...editFormData, estimated_discharge_date: e.target.value})} /></div>
            
            <div className="space-y-2"><Label>Emergency Contact Name</Label><Input value={editFormData.emergency_contact_name} onChange={(e) => setEditFormData({...editFormData, emergency_contact_name: e.target.value})} /></div>
            <div className="space-y-2"><Label>Emergency Contact No.</Label><Input value={editFormData.emergency_contact_number} onChange={(e) => setEditFormData({...editFormData, emergency_contact_number: e.target.value})} /></div>

            {editFormData.admission_status === "discharge" && (
              <>
                <div className="space-y-2 p-2 bg-amber-50 rounded border border-amber-200">
                  <Label>Discharge Date *</Label>
                  <Input type="date" value={editFormData.discharge_date} onChange={(e) => setEditFormData({...editFormData, discharge_date: e.target.value})} required />
                </div>
                <div className="space-y-2 p-2 bg-amber-50 rounded border border-amber-200">
                  <Label>Discharge Time *</Label>
                  <Input type="time" value={editFormData.discharge_time} onChange={(e) => setEditFormData({...editFormData, discharge_time: e.target.value})} required />
                </div>
              </>
            )}

            <div className="md:col-span-2 space-y-2"><Label>Remark</Label><Textarea value={editFormData.remark} onChange={(e) => setEditFormData({...editFormData, remark: e.target.value})} /></div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSubmission} disabled={updateLoading}>
              {updateLoading ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetAdmission;