'use client';
import { useState, useEffect } from "react";
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowRightLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

/* ---------------- MOCK DATA ---------------- */
const mockPatients = [
  {
    id: 1,
    patient_name: "John Doe",
    phone_number: "9876543210",
    doctor_name: "Dr. Smith",
    admission_id: "ADM001",
    transferred_to_bed: "Bed 101",
    admission_status: "Active",
    admission_date: "2026-01-05",
  },
  {
    id: 2,
    patient_name: "Jane Smith",
    phone_number: "9876543211",
    doctor_name: "Dr. Johnson",
    admission_id: "ADM002",
    transferred_to_bed: "Bed 102",
    admission_status: "Active",
    admission_date: "2026-01-06",
  },
  {
    id: 3,
    patient_name: "Robert Wilson",
    phone_number: "9876543212",
    doctor_name: "Dr. Williams",
    admission_id: "ADM003",
    transferred_to_bed: "Bed 203",
    admission_status: "Active",
    admission_date: "2026-01-07",
  },
  {
    id: 4,
    patient_name: "Emily Davis",
    phone_number: "9876543213",
    doctor_name: "Dr. Brown",
    admission_id: "ADM004",
    transferred_to_bed: "Bed 304",
    admission_status: "Active",
    admission_date: "2026-01-07",
  },
  {
    id: 5,
    patient_name: "Michael Brown",
    phone_number: "9876543214",
    doctor_name: "Dr. Davis",
    admission_id: "ADM005",
    transferred_to_bed: "Bed 105",
    admission_status: "Active",
    admission_date: "2026-01-08",
  },
];

const PAGE_SIZE = 5;

const TransferPatient = () => {
  /* ---------------- SEARCH INPUTS ---------------- */
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchAdmissionId, setSearchAdmissionId] = useState("");
  const [searchAdmissionDate, setSearchAdmissionDate] = useState("");

  /* ---------------- APPLIED FILTERS ---------------- */
  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    admissionId: "",
    admissionDate: "",
  });

  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  const CLINIC_ID = "clinic001";

  /* ================= MASTER DATA STATES ================= */
  const [floors, setFloors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);

  /* ---------------- SUGGESTIONS STATE ---------------- */
  const [phoneSuggestions, setPhoneSuggestions] = useState<any[]>([]);
  const [nameSuggestions, setNameSuggestions] = useState<any[]>([]);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [showNameDropdown, setShowNameDropdown] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [admissionsLoading, setAdmissionsLoading] = useState(false);

  /* ---------------- TRANSFER DIALOG ---------------- */
  const [selectedPatient, setSelectedPatient] =
    useState<(typeof mockPatients)[0] | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  /* ---------------- PATIENT ADMISSIONS ---------------- */
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>("");
  const [transferLoading, setTransferLoading] = useState(false);

  /* ---------------- TRANSFER FORM ---------------- */
  const [transferData, setTransferData] = useState({
    floor: "",
    room: "",
    bed: "",
    department: "",
    roomType: "",
    dailyRate: "",
    transferReason: "",
    transferDate: "",
  });

  /* ---------------- SEARCH ---------------- */
  const handleSearch = async () => {
    // apply filters locally for inputs
    setFilters({
      name: searchName,
      phone: searchPhone,
      admissionId: searchAdmissionId,
      admissionDate: searchAdmissionDate,
    });
    setCurrentPage(1);
    setHasSearched(true);

    // build payload similar to admission-search
    const payload: any = {
      clinic_id: "clinic001",
      patient_id: selectedPatientId || undefined,
      admission_id: searchAdmissionId || undefined,
      from_date: searchAdmissionDate || undefined,
      to_date: undefined,
    };

    setAdmissionsLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/admissionAndBeds/get_admission`, payload, { withCredentials: true });
      console.log("Search admissions response:", res.data);
      if (res.data.resSuccess === 1) {
        setAdmissions(res.data.data || []);
      } else {
        setAdmissions([]);
      }
    } catch (err) {
      console.error('Search admissions error:', err);
      setAdmissions([]);
    } finally {
      setAdmissionsLoading(false);
    }
  };

  /* ---------------- FETCH SUGGESTIONS ---------------- */
  const fetchSuggestions = async (query: string, type: 'phone' | 'name') => {
    setShowNameDropdown(false);
    setShowPhoneDropdown(false);
    if (query.length < 3) return;

    try {
      const payload = type === 'phone'
        ? { phone_number: query, clinic_id: "clinic001" }
        : { patient_name: query, clinic_id: "clinic001" };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/profile/name-suggestion-patient-information`,
        payload,
        { withCredentials: true }
      );

      if (response.data.resSuccess === 1) {
        // console.log("Response", response.data);
        if (type === 'phone') {
          setPhoneSuggestions(response.data.data || []);
          setShowPhoneDropdown(true);
        } else {
          setNameSuggestions(response.data.data || []);
          setShowNameDropdown(true);
        }
      }
    } catch (error) {
      console.error('Suggestion fetch error:', error);
    }
  };

  /* ================= FETCH MASTER DATA ================= */
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [floorRes, deptRes, roomRes] = await Promise.all([
          axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_floors`, {}, { withCredentials: true }),
          axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_departments`, { clinic_id: CLINIC_ID }, { withCredentials: true }),
          axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_rooms`, { clinic_id: CLINIC_ID }, { withCredentials: true })
        ]);
        if (floorRes.data.resSuccess === 1) setFloors(floorRes.data.data);
        if (deptRes.data.resSuccess === 1) setDepartments(deptRes.data.data);
        if (roomRes.data.resSuccess === 1) setRooms(roomRes.data.data);
      } catch (err) {
        console.error('Base data fetch error:', err);
      }
    };
    fetchBaseData();
  }, []);

  const onFloorChange = (floorId: string) => {
    setTransferData({ ...transferData, floor: floorId, room: "", bed: "" });
    // try to filter rooms by floor_id, otherwise fallback to all rooms
    // const fr = rooms.filter(r => r.floor_id === floorId);
    // setFilteredRooms(fr.length > 0 ? fr : rooms);
    setFilteredRooms(rooms);
    // setBeds([]);
  };

  const onRoomChange = async (roomId: string) => {
    const selectedRoom = rooms.find(r => r._id === roomId);
    setTransferData({
      ...transferData,
      room: roomId,
      roomType: selectedRoom?.room_category || transferData.roomType,
      dailyRate: selectedRoom?.rate_per_day ? String(selectedRoom.rate_per_day) : transferData.dailyRate,
    });

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_beds`, { clinic_id: CLINIC_ID, room_id: roomId }, { withCredentials: true });
      if (res.data.resSuccess === 1) {
        console.log('Beds response:', res.data);
        // setBeds(res.data.data.filter((b: any) => b.status === "AVAILABLE"));
        setBeds(res.data.data);
      }
    } catch (err) {
      console.error('Beds fetch error:', err);
      setBeds([]);
    }
  };

  /* ---------------- RESET ---------------- */
  const handleReset = () => {
    setSearchName("");
    setSearchPhone("");
    setSearchAdmissionId("");
    setSearchAdmissionDate("");

    setFilters({
      name: "",
      phone: "",
      admissionId: "",
      admissionDate: "",
    });

    setHasSearched(false);
    setCurrentPage(1);
  };

  /* ---------------- FILTER ---------------- */
  const filteredPatients = mockPatients.filter((patient) => {
    const matchesName = patient.patient_name
      .toLowerCase()
      .includes(filters.name.toLowerCase());

    const matchesPhone = patient.phone_number.includes(filters.phone);

    const matchesAdmissionId = patient.admission_id
      .toLowerCase()
      .includes(filters.admissionId.toLowerCase());

    const matchesDate = filters.admissionDate
      ? patient.admission_date === filters.admissionDate
      : true;

    return matchesName && matchesPhone && matchesAdmissionId && matchesDate;
  });

  /* ---------------- PAGINATION ---------------- */
  // when searched we display admissions fetched from API; otherwise show filtered mock patients
  const totalPages = Math.ceil((hasSearched ? admissions.length : filteredPatients.length) / PAGE_SIZE);

  const paginatedPatients = (hasSearched ? admissions : filteredPatients).slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  /* ---------------- ACTIONS ---------------- */
  const handleTransferClick = (patient: (typeof mockPatients)[0]) => {
    setSelectedPatient(patient);
    // if patient object contains an id usable for API, set it and fetch admissions
    if ((patient as any)._id) {
      setSelectedPatientId((patient as any)._id);
      fetchPatientAdmissions((patient as any)._id);
    }
    setShowTransferDialog(true);
  };

  const handleSubmitTransfer = async () => {
    // basic validation
    if (!selectedPatient) {
      toast({ title: "No patient selected", description: "Please select a patient to transfer.", variant: 'destructive' } as any);
      return;
    }

    if (!transferData.bed) {
      toast({ title: "No bed selected", description: "Please select a bed.", variant: 'destructive' } as any);
      return;
    }
    setTransferLoading(true);
    try {
      const selectedRoomObj = rooms.find(r => r._id === transferData.room);
      const selectedFloorObj = floors.find(f => f._id === transferData.floor);
      console.log("Selected admission:", selectedPatient)

      const payload: any = {
        admission_id: selectedAdmissionId || selectedPatient.admission_id || undefined,
        transfer_id: `TRF-${Date.now()}`,
        new_bed_id: transferData.bed,
        new_room_id: transferData.room,
        new_room_name: selectedRoomObj?.room_number || undefined,
        new_floor: selectedFloorObj?._id || transferData.floor,
        new_department: transferData.department,
        new_room_type: transferData.roomType,
        new_daily_rate: transferData.dailyRate ? Number(transferData.dailyRate) : undefined,
        transfer_reason: transferData.transferReason,
        transfer_date: transferData.transferDate ? new Date(transferData.transferDate).toISOString() : new Date().toISOString(),
        authorized_by: "SYSTEM",
        transferred_by: "CURRENT_USER",
        patient_id: selectedPatientId || undefined,
      };

      console.log('Transfer payload:', payload);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/admissionAndBeds/transfer_patient`, payload, { withCredentials: true });
      if (res.data.resSuccess === 1) {
        toast({ title: 'Transfer Successful', description: `${selectedPatient.patient_name} transferred successfully.` } as any);
        setShowTransferDialog(false);
        setSelectedPatient(null);
        setSelectedPatientId("");
        setSelectedAdmissionId("");
        setTransferData({ floor: "", room: "", bed: "", department: "", roomType: "", dailyRate: "", transferReason: "", transferDate: "" });
      } else {
        toast({ title: 'Transfer failed', description: res.data.message || 'Unexpected response from server', variant: 'destructive' } as any);
      }
    } catch (err) {
      console.error('Transfer API error:', err);
      toast({ title: 'Error', description: 'Failed to transfer patient', variant: 'destructive' } as any);
    } finally {
      setTransferLoading(false);
    }
  };

  /* ---------------- FETCH PATIENT ADMISSIONS ---------------- */
  const fetchPatientAdmissions = async (patientId: string) => {
    if (!patientId) return;
    try {
      const payload = { clinic_id: "clinic001", patient_id: patientId };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admissionAndBeds/get_admission`,
        payload,
        { withCredentials: true }
      );
      console.log('Admissions response:', response.data);
      if (response.data.resSuccess === 1) {
        setAdmissions(response.data.data || []);
        const active = (response.data.data || []).find((a: any) => !a.discharge_date);
        if (active) setSelectedAdmissionId(active.admission_id || active._id || "");
        else if ((response.data.data || []).length > 0) setSelectedAdmissionId(response.data.data[0]._id || response.data.data[0].admission_id || "");
      }
    } catch (err) {
      console.error('Fetch admissions error:', err);
    }
  };

  useEffect(() => {
    if (selectedPatientId) fetchPatientAdmissions(selectedPatientId);
  }, [selectedPatientId]);

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transfer Patient</h1>
        <p className="text-muted-foreground">
          Search and transfer patients
        </p>
      </div>

      {/* SEARCH */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Patient
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Input
                placeholder="Patient name"
                value={searchName}
                onFocus={() => { setShowPhoneDropdown(false); setShowNameDropdown(true); }}
                onChange={(e) => { setSearchName(e.target.value); fetchSuggestions(e.target.value, 'name'); }}
              />
              {showNameDropdown && nameSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                  {nameSuggestions.map((p) => (
                    <div
                      key={p._id}
                      className="p-2 hover:bg-slate-100 cursor-pointer border-b text-sm"
                      onClick={() => {
                        setSearchName(p.patient_name);
                        setSearchPhone(p.phone_number);
                        setSelectedPatientId(p._id);
                        setSelectedPatient(p);
                        setShowNameDropdown(false);
                      }}
                    >
                      <div className="font-bold">{p.patient_name}</div>
                      <div className="text-xs text-muted-foreground">{p.phone_number}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <Input
                placeholder="Phone number"
                value={searchPhone}
                onFocus={() => { setShowNameDropdown(false); setShowPhoneDropdown(true); }}
                onChange={(e) => { setSearchPhone(e.target.value); fetchSuggestions(e.target.value, 'phone'); }}
              />
              {showPhoneDropdown && phoneSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                  {phoneSuggestions.map((p) => (
                    <div
                      key={p._id}
                      className="p-2 hover:bg-slate-100 cursor-pointer border-b text-sm"
                      onClick={() => {
                        setSearchPhone(p.phone_number);
                        setSearchName(p.patient_name);
                        setSelectedPatientId(p._id);
                        setSelectedPatient(p);
                        setShowPhoneDropdown(false);
                      }}
                    >
                      <div className="font-bold">{p.phone_number}</div>
                      <div className="text-xs text-muted-foreground">{p.patient_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Input placeholder="Admission ID" value={searchAdmissionId} onChange={(e) => setSearchAdmissionId(e.target.value)} />
            <Input type="date" value={searchAdmissionDate} onChange={(e) => setSearchAdmissionDate(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Doctor</TableHead>
                {/* <TableHead>Bed</TableHead> */}
                <TableHead>Admission date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!hasSearched ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Please search to view admissions
                  </TableCell>
                </TableRow>
              ) : admissionsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6"><span>Loading...</span></TableCell>
                </TableRow>
              ) : paginatedPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No admissions found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPatients.map((adm: any) => (
                  <TableRow key={adm._id || adm.admission_id}>
                    <TableCell>
                      <div className="font-medium">{adm.patient_name}</div>
                      <div className="text-xs text-muted-foreground">{adm.phone_number}</div>
                    </TableCell>
                    <TableCell>{adm.phone_number}</TableCell>
                    <TableCell>{adm.doctor_name}</TableCell>
                    <TableCell>{adm.admission_date ? new Date(adm.admission_date).toLocaleDateString() : ''}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{adm.admission_status}</TableCell>
                    <TableCell>{adm.initial_department}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => {
                        // set selected admission context and open dialog
                        setSelectedPatient({ patient_name: adm.patient_name, phone_number: adm.phone_number, admission_id: adm.admission_id } as any);
                        setSelectedPatientId(adm.patient_id || adm.global_id || "");
                        setSelectedAdmissionId(adm._id || adm.admission_id || "");
                        setShowTransferDialog(true);
                      }}>
                        <ArrowRightLeft className="w-4 h-4 mr-1" />
                        Transfer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {hasSearched && totalPages > 0 && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                  Previous
                </Button>
                <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transfer Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Transfer Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPatient && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">Transferring: {selectedPatient.patient_name}</p>
                <p className="text-sm text-muted-foreground">Phone: {selectedPatient.phone_number} | ID: {selectedPatient.admission_id}</p>
              </div>
            )}
            {admissions.length > 0 && (
              <div className="space-y-2">
                <Label>Admission</Label>
                <Select value={selectedAdmissionId} onValueChange={(v) => setSelectedAdmissionId(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select admission" />
                  </SelectTrigger>
                  <SelectContent>
                    {admissions.map((a: any) => (
                      <SelectItem key={a._id || a.admission_id} value={a._id || a.admission_id}>
                        {`${a.admission_id || a._id} • ${a.admission_date ? new Date(a.admission_date).toLocaleDateString() : 'No date'}${a.initial_department ? ' • ' + a.initial_department : ''}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Select value={transferData.floor} onValueChange={(value) => onFloorChange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {floors.map(f => <SelectItem key={f._id} value={f._id}>{f.floor_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Select value={transferData.room} onValueChange={(value) => onRoomChange(value)} disabled={!transferData.floor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredRooms.map(r => <SelectItem key={r._id} value={r._id}>{r.room_number} ({r.room_category})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bed">Bed</Label>
                <Select value={transferData.bed} onValueChange={(value) => setTransferData({ ...transferData, bed: value })} disabled={!transferData.room}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed" />
                  </SelectTrigger>
                  <SelectContent>
                    {beds.map(b => <SelectItem key={b._id} value={b._id}>Bed {b.bed_number}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={transferData.department} onValueChange={(value) => setTransferData({ ...transferData, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(d => <SelectItem key={d._id} value={d.name}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Select value={transferData.roomType} onValueChange={(value) => setTransferData({ ...transferData, roomType: value })}>
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
                <Label htmlFor="dailyRate">Daily Rate</Label>
                <Input
                  id="dailyRate"
                  placeholder="Enter daily rate"
                  value={transferData.dailyRate}
                  onChange={(e) => setTransferData({ ...transferData, dailyRate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transferDate">Transfer Date</Label>
                <Input
                  id="transferDate"
                  type="date"
                  value={transferData.transferDate}
                  onChange={(e) => setTransferData({ ...transferData, transferDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transferReason">Transfer Reason</Label>
              <Textarea
                id="transferReason"
                placeholder="Enter reason for transfer..."
                value={transferData.transferReason}
                onChange={(e) => setTransferData({ ...transferData, transferReason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitTransfer} disabled={transferLoading}>{transferLoading ? 'Processing...' : 'Add Transfer'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransferPatient;
