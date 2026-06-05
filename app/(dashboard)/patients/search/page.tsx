'use client';
import { useState, useEffect } from "react";
import axios from "axios";
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
import { Search, Eye, Calendar, User, Loader2, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const GetPatient = () => {
  const [searchFilters, setSearchFilters] = useState({
    patientId: "",
    startDate: "",
    endDate: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionType, setSuggestionType] = useState(null); // 'name' or 'phone'
  const [suggestionValue, setSuggestionValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [patients, setPatients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const CLINIC_ID = "clinic001"; // Mock clinic ID, replace with actual context later

  useEffect(() => {
    if (hasSearched) {
      fetchPatients();
    }
  }, [currentPage, hasSearched]);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const payload: any = {
        clinic_id: CLINIC_ID,
        page: currentPage,
      };

      if (searchFilters.patientId) {
        payload.patient_id = searchFilters.patientId;
      }
      if (searchFilters.startDate) {
        payload.start_date = searchFilters.startDate;
      }
      if (searchFilters.endDate) {
        payload.end_date = searchFilters.endDate;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/profile/get-patient-information`,
        payload,
        { withCredentials: true }
      );

      console.log("Patient search response", response.data);
      if (response.data && response.data.apiSuccess === 1) {
        setPatients(response.data.data || []);
        setTotalCount(response.data.pagination.totalCount || 0);
        setTotalPages(response.data.pagination.totalPages || 0);
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to fetch patient information",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error fetching patient information:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred while fetching patient profiles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async (value: string, type: 'name' | 'phone') => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const payload: any = { clinic_id: CLINIC_ID };
      if (type === 'name') payload.patient_name = value;
      else payload.phone_number = value;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/profile/name-suggestion-patient-information`,
        payload,
        { withCredentials: true }
      );

      // console.log("Patient suggestions", response.data);

      if (response.data && response.data.apiSuccess === 1) {
        setSuggestions(response.data.data || []);
        setShowSuggestions(true);
        setSuggestionType(type);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const selectSuggestion = (suggestion: any) => {
    setSearchFilters({
      ...searchFilters,
      patientId: suggestion.patient_id
    });
    setSuggestionValue(suggestion.patient_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setCurrentPage(1); // Reset to first page on new search
    fetchPatients();
  };

  const handleReset = () => {
    setSearchFilters({
      patientId: "",
      startDate: "",
      endDate: "",
    });
    setSuggestionValue("");
    setSuggestions([]);
    setShowSuggestions(false);
    setPatients([]);
    setTotalCount(0);
    setTotalPages(0);
    setCurrentPage(1);
    setHasSearched(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
              <div className="space-y-2 relative">
                <Label htmlFor="patientSearch" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Search Patient (Name/Phone)
                </Label>
                <div className="relative">
                  <Input
                    id="patientSearch"
                    placeholder="Type name or phone number..."
                    value={suggestionValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSuggestionValue(val);
                      const type = /^\d+$/.test(val) ? 'phone' : 'name';
                      fetchSuggestions(val, type);
                    }}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                      <Command>
                        <CommandList>
                          <CommandGroup heading="Suggestions">
                            {suggestions.map((s: any) => (
                              <CommandItem
                                key={s.patient_id}
                                onSelect={() => selectSuggestion(s)}
                                className="flex flex-col items-start cursor-pointer transition-colors hover:bg-accent"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <User className="w-4 h-4 text-primary" />
                                  <span className="font-medium">{s.patient_name}</span>
                                  <span className="ml-auto text-xs text-muted-foreground">{s.patient_id}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Phone className="w-3 h-3" />
                                  {s.phone_number}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  placeholder="Filter by patient ID"
                  value={searchFilters.patientId}
                  onChange={(e) => setSearchFilters({ ...searchFilters, patientId: e.target.value })}
                />
              </div>

              <div className="space-y-2 lg:col-start-1">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  From Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={searchFilters.startDate}
                  onChange={(e) => setSearchFilters({ ...searchFilters, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  To Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={searchFilters.endDate}
                  onChange={(e) => setSearchFilters({ ...searchFilters, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
                Reset
              </Button>
              <Button type="submit" variant="gradient" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Searching..." : "Search"}
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
              {hasSearched && !isLoading && (
                <span className="text-sm font-normal text-muted-foreground">
                  Showing {patients.length} of {totalCount} patients
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Patient ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Phone Number</TableHead>
                    <TableHead className="font-semibold">Membership ID</TableHead>
                    <TableHead className="font-semibold">Age</TableHead>
                    <TableHead className="font-semibold">Gender</TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                        <p className="text-muted-foreground mt-2">Loading patients...</p>
                      </TableCell>
                    </TableRow>
                  ) : patients.length > 0 ? (
                    patients.map((patient: any) => (
                      <TableRow key={patient.patient_id}>
                        <TableCell>{patient.patient_id}</TableCell>
                        <TableCell>{patient.patient_name}</TableCell>
                        <TableCell>{patient.phone_number}</TableCell>
                        <TableCell>{patient.membership_id || "N/A"}</TableCell>
                        <TableCell>{patient.age || "N/A"}</TableCell>
                        <TableCell>{patient.gender || "N/A"}</TableCell>
                        <TableCell>{new Date(patient.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" className="text-primary">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {hasSearched ? "No patients found matching your criteria." : "Please use the search filters above to find patients."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <Pagination className="mt-4 flex justify-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => handlePageChange(currentPage - 1)}
                      isActive={currentPage > 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => handlePageChange(currentPage + 1)}
                      isActive={currentPage < totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
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
