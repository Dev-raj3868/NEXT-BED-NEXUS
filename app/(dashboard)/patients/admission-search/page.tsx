'use client';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Edit } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/* ---------------- MOCK DATA ---------------- */
const mockAdmissions = [
  { id: 1, name: "John Doe", phoneNumber: "9876543210", assignedDoctor: "Dr. Smith", admissionDate: "2026-01-05", reasonForAdmission: "Chest Pain", dischargeDate: null },
  { id: 2, name: "Jane Smith", phoneNumber: "9876543211", assignedDoctor: "Dr. Johnson", admissionDate: "2026-01-06", reasonForAdmission: "Fracture", dischargeDate: null },
  { id: 3, name: "Robert Wilson", phoneNumber: "9876543212", assignedDoctor: "Dr. Williams", admissionDate: "2026-01-07", reasonForAdmission: "Surgery", dischargeDate: "2026-01-08" },
  { id: 4, name: "Emily Davis", phoneNumber: "9876543213", assignedDoctor: "Dr. Brown", admissionDate: "2026-01-07", reasonForAdmission: "Observation", dischargeDate: null },
  { id: 5, name: "Michael Brown", phoneNumber: "9876543214", assignedDoctor: "Dr. Davis", admissionDate: "2026-01-08", reasonForAdmission: "Dialysis", dischargeDate: null },
  { id: 6, name: "Sarah Johnson", phoneNumber: "9876543215", assignedDoctor: "Dr. Miller", admissionDate: "2026-01-04", reasonForAdmission: "Cardiac Check", dischargeDate: "2026-01-06" },
  { id: 7, name: "David Lee", phoneNumber: "9876543216", assignedDoctor: "Dr. Taylor", admissionDate: "2026-01-03", reasonForAdmission: "Appendicitis", dischargeDate: "2026-01-05" },
  { id: 8, name: "Lisa Anderson", phoneNumber: "9876543217", assignedDoctor: "Dr. Thomas", admissionDate: "2026-01-08", reasonForAdmission: "Pneumonia", dischargeDate: null },
];

const ITEMS_PER_PAGE = 5;

const GetAdmission = () => {
  /* ---------------- SEARCH INPUTS ---------------- */
  const [searchAdmissionId, setSearchAdmissionId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchAdmissionDate, setSearchAdmissionDate] = useState("");

  /* ---------------- APPLIED FILTERS ---------------- */
  const [filters, setFilters] = useState({
    admissionId: "",
    name: "",
    phone: "",
    admissionDate: "",
  });

  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- EDIT DIALOG ---------------- */
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAdmission, setSelectedAdmission] =
    useState<(typeof mockAdmissions)[0] | null>(null);

  /* ---------------- SEARCH ---------------- */
  const handleSearch = () => {
    setFilters({
      admissionId: searchAdmissionId,
      name: searchName,
      phone: searchPhone,
      admissionDate: searchAdmissionDate,
    });
    setCurrentPage(1);
    setHasSearched(true);
  };

  /* ---------------- RESET ---------------- */
  const handleReset = () => {
    setSearchAdmissionId("");
    setSearchName("");
    setSearchPhone("");
    setSearchAdmissionDate("");

    setFilters({
      admissionId: "",
      name: "",
      phone: "",
      admissionDate: "",
    });

    setHasSearched(false);
    setCurrentPage(1);
  };

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredAdmissions = mockAdmissions.filter((admission) => {
    const matchesId = admission.id
      .toString()
      .includes(filters.admissionId);
    const matchesName = admission.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const matchesPhone = admission.phoneNumber.includes(filters.phone);
    const matchesDate = filters.admissionDate
      ? admission.admissionDate === filters.admissionDate
      : true;

    return matchesId && matchesName && matchesPhone && matchesDate;
  });

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredAdmissions.length / ITEMS_PER_PAGE);

  const paginatedAdmissions = filteredAdmissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ---------------- EDIT ---------------- */
  const handleEditClick = (admission: (typeof mockAdmissions)[0]) => {
    setSelectedAdmission(admission);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    toast({
      title: "Admission Updated",
      description: "Admission details updated successfully.",
    });
    setShowEditDialog(false);
    setSelectedAdmission(null);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Get Admission</h1>
        <p className="text-muted-foreground">
          Search and view patient admissions
        </p>
      </div>

      {/* SEARCH */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Admission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input placeholder="Admission ID" value={searchAdmissionId} onChange={(e) => setSearchAdmissionId(e.target.value)} />
            <Input placeholder="Patient Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            <Input placeholder="Phone Number" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} />
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
          <CardTitle>Admission Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Discharge Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!hasSearched ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Please search to view admission records
                  </TableCell>
                </TableRow>
              ) : paginatedAdmissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No admission records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAdmissions.map((admission) => (
                  <TableRow key={admission.id}>
                    <TableCell>{admission.name}</TableCell>
                    <TableCell>{admission.phoneNumber}</TableCell>
                    <TableCell>{admission.assignedDoctor}</TableCell>
                    <TableCell>{admission.admissionDate}</TableCell>
                    <TableCell>{admission.reasonForAdmission}</TableCell>
                    <TableCell>
                      {admission.dischargeDate ?? (
                        <span className="text-muted-foreground">
                          Not Discharged
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(admission)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          {hasSearched && totalPages > 0 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

    
      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Admission</DialogTitle>
          </DialogHeader>
          {selectedAdmission && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Patient Name</Label>
                <Input
                  id="editName"
                  value={selectedAdmission.name}
                  onChange={(e) => setSelectedAdmission({ ...selectedAdmission, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDoctor">Assigned Doctor</Label>
                <Select 
                  value={selectedAdmission.assignedDoctor}
                  onValueChange={(value) => setSelectedAdmission({ ...selectedAdmission, assignedDoctor: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                    <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                    <SelectItem value="Dr. Williams">Dr. Williams</SelectItem>
                    <SelectItem value="Dr. Brown">Dr. Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editReason">Reason for Admission</Label>
                <Textarea
                  id="editReason"
                  value={selectedAdmission.reasonForAdmission}
                  onChange={(e) => setSelectedAdmission({ ...selectedAdmission, reasonForAdmission: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDischarge">Discharge Date</Label>
                <Input
                  id="editDischarge"
                  type="date"
                  value={selectedAdmission.dischargeDate || ""}
                  onChange={(e) => setSelectedAdmission({ ...selectedAdmission, dischargeDate: e.target.value || null })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetAdmission;
