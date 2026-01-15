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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Eye, Calendar, User } from "lucide-react";

// Mock data for demonstration
const mockPatients = [
  { id: "P001", name: "John Smith", phone: "9876543210", age: 45, gender: "Male", createdAt: "2024-01-15" },
  { id: "P002", name: "Sarah Johnson", phone: "9876543211", age: 32, gender: "Female", createdAt: "2024-01-16" },
  { id: "P003", name: "Michael Brown", phone: "9876543212", age: 58, gender: "Male", createdAt: "2024-01-17" },
  { id: "P004", name: "Emily Davis", phone: "9876543213", age: 28, gender: "Female", createdAt: "2024-01-18" },
  { id: "P005", name: "Robert Wilson", phone: "9876543214", age: 67, gender: "Male", createdAt: "2024-01-19" },
  { id: "P006", name: "Jennifer Taylor", phone: "9876543215", age: 41, gender: "Female", createdAt: "2024-01-20" },
  { id: "P007", name: "David Martinez", phone: "9876543216", age: 35, gender: "Male", createdAt: "2024-01-21" },
  { id: "P008", name: "Lisa Anderson", phone: "9876543217", age: 52, gender: "Female", createdAt: "2024-01-22" },
];

const GetPatient = () => {
  const [searchFilters, setSearchFilters] = useState({
    patientName: "",
    phoneNumber: "",
    patientId: "",
    admissionId: "",
    fromDate: "",
    toDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(mockPatients.length / itemsPerPage);
  const paginatedPatients = mockPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchFilters({
      patientName: "",
      phoneNumber: "",
      patientId: "",
      admissionId: "",
      fromDate: "",
      toDate: "",
    });
    setHasSearched(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
          <Search className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Get Patient</h1>
          <p className="text-muted-foreground">Search and view patient records</p>
        </div>
      </div>

      {/* Search Filters Card */}
      <Card className="border-t-4 border-t-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="w-5 h-5 text-primary" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Patient Name
                </Label>
                <Input
                  id="patientName"
                  placeholder="Search by name"
                  value={searchFilters.patientName}
                  onChange={(e) => setSearchFilters({ ...searchFilters, patientName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="Search by phone"
                  value={searchFilters.phoneNumber}
                  onChange={(e) => setSearchFilters({ ...searchFilters, phoneNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  placeholder="Search by patient ID"
                  value={searchFilters.patientId}
                  onChange={(e) => setSearchFilters({ ...searchFilters, patientId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admissionId">Admission ID</Label>
                <Input
                  id="admissionId"
                  placeholder="Search by admission ID"
                  value={searchFilters.admissionId}
                  onChange={(e) => setSearchFilters({ ...searchFilters, admissionId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  From Date
                </Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={searchFilters.fromDate}
                  onChange={(e) => setSearchFilters({ ...searchFilters, fromDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  To Date
                </Label>
                <Input
                  id="toDate"
                  type="date"
                  value={searchFilters.toDate}
                  onChange={(e) => setSearchFilters({ ...searchFilters, toDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit" variant="gradient">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Table */}
      {hasSearched && (
        <Card className="border-t-4 border-t-secondary animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">Search Results</span>
              <span className="text-sm font-normal text-muted-foreground">
                Showing {paginatedPatients.length} of {mockPatients.length} patients
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Phone Number</TableHead>
                    <TableHead className="font-semibold">Age</TableHead>
                    <TableHead className="font-semibold">Gender</TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPatients.map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          patient.gender === "Male" 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-pink-100 text-pink-700"
                        }`}>
                          {patient.gender}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(patient.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Search Yet State */}
      {!hasSearched && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Search for Patients</h3>
            <p className="text-muted-foreground max-w-md">
              Use the search filters above to find patient records. You can search by name, phone number, ID, or date range.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GetPatient;
