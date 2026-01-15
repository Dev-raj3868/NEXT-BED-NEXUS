'use client';
import { useState } from "react";
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

  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- TRANSFER DIALOG ---------------- */
  const [selectedPatient, setSelectedPatient] =
    useState<(typeof mockPatients)[0] | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

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
  const handleSearch = () => {
    setFilters({
      name: searchName,
      phone: searchPhone,
      admissionId: searchAdmissionId,
      admissionDate: searchAdmissionDate,
    });
    setCurrentPage(1);
    setHasSearched(true);
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
  const totalPages = Math.ceil(filteredPatients.length / PAGE_SIZE);

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  /* ---------------- ACTIONS ---------------- */
  const handleTransferClick = (patient: (typeof mockPatients)[0]) => {
    setSelectedPatient(patient);
    setShowTransferDialog(true);
  };

  const handleSubmitTransfer = () => {
    toast({
      title: "Transfer Successful",
      description: `${selectedPatient?.patient_name} transferred successfully.`,
    });

    setShowTransferDialog(false);
    setSelectedPatient(null);
  };

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
            <Input placeholder="Patient name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            <Input placeholder="Phone number" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} />
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
                <TableHead>Bed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!hasSearched ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Please search to view patients
                  </TableCell>
                </TableRow>
              ) : paginatedPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.patient_name}</TableCell>
                    <TableCell>{patient.phone_number}</TableCell>
                    <TableCell>{patient.doctor_name}</TableCell>
                    <TableCell>{patient.transferred_to_bed}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        {patient.admission_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleTransferClick(patient)}>
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Select value={transferData.floor} onValueChange={(value) => setTransferData({ ...transferData, floor: value })}>
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
                <Label htmlFor="room">Room</Label>
                <Select value={transferData.room} onValueChange={(value) => setTransferData({ ...transferData, room: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="101">Room 101</SelectItem>
                    <SelectItem value="102">Room 102</SelectItem>
                    <SelectItem value="201">Room 201</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bed">Bed</Label>
                <Select value={transferData.bed} onValueChange={(value) => setTransferData({ ...transferData, bed: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Bed A</SelectItem>
                    <SelectItem value="B">Bed B</SelectItem>
                    <SelectItem value="C">Bed C</SelectItem>
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
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
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
            <Button onClick={handleSubmitTransfer}>Add Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransferPatient;
